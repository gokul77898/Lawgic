// src/app/actions.ts
'use server';

import { z } from 'zod';
import { extractLegalConcepts } from '@/ai/flows/extract-legal-concepts-flow';
import { generateInfographicStructure } from '@/ai/flows/generate-infographic-structure.ts';

const formSchema = z.object({
  legalText: z.string().min(50, {
    message: 'Legal text must be at least 50 characters.',
  }),
});

export type InfographicData = {
  concepts: string[];
  relationships: string[];
  summary: string;
  structure: string;
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
    const [conceptsResult, structureResult] = await Promise.all([
      extractLegalConcepts({ legalText }),
      generateInfographicStructure({ legalText }),
    ]);

    return {
      data: {
        concepts: conceptsResult.concepts,
        relationships: conceptsResult.relationships,
        summary: conceptsResult.summary,
        structure: structureResult.infographicStructure,
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
