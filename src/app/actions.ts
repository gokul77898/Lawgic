// src/app/actions.ts
'use server';

import { z } from 'zod';
import { extractLegalConcepts } from '@/ai/flows/extract-legal-concepts-flow';
import { generateInfographicImage } from '@/ai/flows/generate-infographic-image-flow';

const formSchema = z.object({
  legalText: z.string().min(50, {
    message: 'Legal text must be at least 50 characters.',
  }),
});

export type InfographicData = {
  concepts: string[];
  relationships: string[];
  summary: string;
  imageUrl: string;
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
    const conceptsResult = await extractLegalConcepts({ legalText });

    const imageResult = await generateInfographicImage({
      summary: conceptsResult.summary,
      concepts: conceptsResult.concepts,
      relationships: conceptsResult.relationships,
    });

    return {
      data: {
        concepts: conceptsResult.concepts,
        relationships: conceptsResult.relationships,
        summary: conceptsResult.summary,
        imageUrl: imageResult.imageUrl,
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
