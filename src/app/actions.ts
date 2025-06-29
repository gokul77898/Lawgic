'use server';

import { z } from 'zod';
import { extractLegalConcepts } from '@/ai/flows/extract-legal-concepts-flow';
import { generateIllustrations } from '@/ai/flows/generate-illustrations-flow';
import type { InfographicPoint } from '@/ai/schemas';

// This schema validates the form data has either text or a file.
const formSchema = z.object({
  legalText: z.string().optional(),
  // The file is received from FormData, so we check if it's a File object.
  file: z.instanceof(File).optional(),
  style: z.enum(['modern', 'classic', 'artistic']).optional(),
})
.refine(data => !!data.legalText || (data.file && data.file.size > 0), {
  message: 'Please paste text or upload a file to continue.',
  path: ['legalText'], // Attach error to the text field for simplicity
});

// Update InfographicPoint to include the imageUrl
export type InfographicPointWithImage = Omit<InfographicPoint, 'illustration_prompt'> & {
  imageUrl: string;
};

export type InfographicData = {
  title: string;
  points: InfographicPointWithImage[];
  summary: string;
}

async function parseFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  if (file.type === 'application/pdf') {
    const pdf = require('pdf-parse');
    const data = await pdf(buffer);
    return data.text;
  }
  
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  throw new Error('Unsupported file type. Please use PDF, DOCX, or TXT.');
}

export async function generateInfographicAction(prevState: any, formData: FormData) {
  if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'YOUR_API_KEY_HERE') {
    return {
      data: null,
      error: 'Google API Key not found. Please add GOOGLE_API_KEY to your .env file.',
    };
  }
  
  const validatedFields = formSchema.safeParse({
    legalText: formData.get('legalText'),
    file: formData.get('file'),
    style: formData.get('style'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    let legalText = validatedFields.data.legalText || '';
    const file = validatedFields.data.file;
    const style = validatedFields.data.style || 'modern';

    if (file && file.size > 0) {
      legalText = await parseFile(file);
    }
    
    if (!legalText || legalText.trim().length < 50) {
      return {
        data: null,
        error: { legalText: ['Provided text or file content must be at least 50 characters.'] }
      }
    }
    
    // 1. Extract concepts and illustration prompts
    const analysisResult = await extractLegalConcepts({ legalText });

    // 2. Generate illustrations in parallel
    const illustrationPrompts = analysisResult.points.map(p => p.illustration_prompt);
    const illustrationResult = await generateIllustrations({ prompts: illustrationPrompts, style });

    // 3. Combine results
    const pointsWithImages = analysisResult.points.map((point, index) => ({
      title: point.title,
      description: point.description,
      imageUrl: illustrationResult.imageUrls[index],
    }));

    return {
      data: {
        title: analysisResult.title,
        points: pointsWithImages,
        summary: analysisResult.summary,
      } as InfographicData,
      error: null,
    };
  } catch (error: any) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { 
      data: null,
      error: errorMessage
    };
  }
}
