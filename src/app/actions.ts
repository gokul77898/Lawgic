// src/app/actions.ts
'use server';

import { z } from 'zod';
import { extractLegalConcepts } from '@/ai/flows/extract-legal-concepts-flow';
import { generateInfographicImage } from '@/ai/flows/generate-infographic-image-flow';
import type { KeyConcept } from '@/ai/schemas';

const formSchema = z.object({
  legalText: z.string().min(50, {
    message: 'Legal text must be at least 50 characters.',
  }),
});

export type InfographicData = {
  keyConcepts: KeyConcept[];
  summary: string;
  imageUrl: string;
  relationships: string;
}

export async function generateInfographicAction(prevState: any, formData: FormData) {
  const validatedFields = formSchema.safeParse({
    legalText: formData.get('legalText'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const legalText = validatedFields.data.legalText;
    const analysisResult = await extractLegalConcepts({ legalText });

    const imageResult = await generateInfographicImage({
      summary: analysisResult.summary,
      keyConcepts: analysisResult.keyConcepts,
      relationships: analysisResult.relationships,
    });

    return {
      data: {
        keyConcepts: analysisResult.keyConcepts,
        summary: analysisResult.summary,
        imageUrl: imageResult.imageUrl,
        relationships: analysisResult.relationships,
      } as InfographicData,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return { 
      data: null,
      error: 'Failed to generate infographic due to an unexpected error. Please try again later.' 
    };
  }
}
