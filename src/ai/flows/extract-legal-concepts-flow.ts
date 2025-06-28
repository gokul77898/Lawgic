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

const ExtractLegalConceptsInputSchema = z.object({
  legalText: z.string().describe('The legal text to analyze.'),
});
export type ExtractLegalConceptsInput = z.infer<typeof ExtractLegalConceptsInputSchema>;

const ExtractLegalConceptsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, one-sentence summary of the main point of the legal text.'
    ),
  keyConcepts: z
    .array(z.string().max(30, 'Concepts must be 30 characters or less'))
    .length(4, 'Must provide exactly 4 key concepts')
    .describe(
      'A list of the four most important, core concepts from the text. Each concept should be a short phrase of 2-3 words.'
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
  prompt: `You are an expert legal analyst. Your task is to distill the provided legal text into its most essential components for an infographic.

1.  **Summarize:** Create a single, concise sentence that captures the main point of the text.
2.  **Extract Core Concepts:** Identify exactly four core concepts from the text. Each concept must be a very short phrase, ideally 2-3 words. These should represent the main pillars of the argument (e.g., "Judicial Power", "Arbitral Authority", "Contractual Obligation").
3.  **Proofread:** Meticulously check your output for any spelling or grammatical errors. The output must be flawless.

Legal Text:
{{{legalText}}}

The output must be a JSON object with two fields: 'summary' (a single sentence string), and 'keyConcepts' (an array of exactly 4 short strings).`,
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
