// src/ai/flows/extract-legal-concepts-flow.ts
'use server';
/**
 * @fileOverview Extracts a summary and key concepts from legal text for an infographic.
 *
 * - extractLegalConcepts - A function that analyzes legal text.
 * - ExtractLegalConceptsInput - The input type for the extractLegalConcepts function.
 * - ExtractLegalConceptsOutput - The return type for the extractLegalConceptsOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { KeyConceptSchema } from '@/ai/schemas';

const ExtractLegalConceptsInputSchema = z.object({
  legalText: z.string().describe('The legal text to analyze.'),
});
export type ExtractLegalConceptsInput = z.infer<typeof ExtractLegalConceptsInputSchema>;

const ExtractLegalConceptsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A comprehensive summary of the legal text, capturing the main argument and conclusion in 2-3 sentences.'
    ),
  keyConcepts: z
    .array(KeyConceptSchema)
    .length(4, 'Must provide exactly 4 key concepts')
    .describe(
      'A list of the four most important, core concepts from the text, each with a title, description, and icon name.'
    ),
  relationships: z
    .string()
    .describe(
      'A detailed paragraph (3-4 sentences) explaining the nuances of how the key concepts are interconnected and build upon each other to support the main summary.'
    ),
});
export type ExtractLegalConceptsOutput = z.infer<typeof ExtractLegalConceptsOutputSchema>;

export async function extractLegalConcepts(
  input: ExtractLegalConceptsInput
): Promise<ExtractLegalConceptsOutput> {
  return extractLegalConceptsFlow(input);
}

const extractLegalConceptsPrompt = ai.definePrompt({
  name: 'extractLegalConceptsPrompt',
  input: {schema: ExtractLegalConceptsInputSchema},
  output: {schema: ExtractLegalConceptsOutputSchema},
  prompt: `You are an expert legal analyst and information designer. Your mission is to distill the entire logical structure and core arguments of the provided legal text into a format suitable for a modern infographic.

1.  **Comprehensive Summary:** Write a thorough summary (2-3 sentences) that precisely captures the central argument, its context, and the final conclusion of the legal text.

2.  **Extract Core Concepts (with details):** Identify the four foundational pillars of the text's argument. For each pillar, provide the details as requested by the output schema.

3.  **Explain the Logical Flow:** Write a detailed paragraph (3-4 sentences) explaining how these four pillars logically connect to form the complete argument.

4.  **Proofread:** Meticulously check your output for any spelling or grammatical errors. The output must be flawless.

Legal Text:
{{{legalText}}}

The output must be a JSON object that adheres to the provided schema.`,
});

const extractLegalConceptsFlow = ai.defineFlow(
  {
    name: 'extractLegalConceptsFlow',
    inputSchema: ExtractLegalConceptsInputSchema,
    outputSchema: ExtractLegalConceptsOutputSchema,
  },
  async (input) => {
    const {output} = await extractLegalConceptsPrompt(input);
    return output!;
  }
);
