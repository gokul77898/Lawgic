// src/ai/flows/extract-legal-concepts-flow.ts
'use server';
/**
 * @fileOverview Extracts key legal concepts and relationships from legal text.
 *
 * - extractLegalConcepts - A function that analyzes legal text and extracts key concepts.
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
  summary: z.string().describe('A 2-3 sentence summary of the legal text.'),
  keyPoints: z
    .array(z.string())
    .describe(
      'A bulleted list of the 4-6 most important points, findings, or arguments from the text. Each point should be a full sentence.'
    ),
});
export type ExtractLegalConceptsOutput = z.infer<typeof ExtractLegalConceptsOutputSchema>;

export async function extractLegalConcepts(input: ExtractLegalConceptsInput): Promise<ExtractLegalConceptsOutput> {
  return extractLegalConceptsFlow(input);
}

const extractLegalConceptsPrompt = ai.definePrompt({
  name: 'extractLegalConceptsPrompt',
  input: {schema: ExtractLegalConceptsInputSchema},
  output: {schema: ExtractLegalConceptsOutputSchema},
  prompt: `You are a meticulous expert legal analyst. Your task is to analyze the provided legal text and extract the most critical information to be used in a detailed infographic. The goal is to represent the core arguments of the text, not just keywords.

1.  **Summarize:** Create a concise 2-3 sentence summary that captures the main topic and conclusion of the text.
2.  **Extract Key Points:** Identify the 4 to 6 most important points, findings, or arguments from the text. Each point should be a complete sentence that clearly explains a core idea.
3.  **Proofread:** Meticulously check your output for any spelling or grammatical errors. The output must be flawless.

Legal Text:
{{{legalText}}}

The output must be a JSON object with two fields: 'summary' (a 2-3 sentence string), and 'keyPoints' (an array of 4-6 strings, where each string is a full sentence).`,
});

const extractLegalConceptsFlow = ai.defineFlow(
  {
    name: 'extractLegalConceptsFlow',
    inputSchema: ExtractLegalConceptsInputSchema,
    outputSchema: ExtractLegalConceptsOutputSchema,
  },
  async input => {
    const {output} = await extractLegalConceptsPrompt(input);
    return output!;
  }
);
