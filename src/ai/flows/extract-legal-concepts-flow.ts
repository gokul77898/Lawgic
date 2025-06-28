
// src/ai/flows/extract-legal-concepts-flow.ts
'use server';
/**
 * @fileOverview Extracts key legal concepts and relationships from legal text.
 *
 * - extractLegalConcepts - A function that analyzes legal text and extracts key concepts.
 * - ExtractLegalConceptsInput - The input type for the extractLegalConcepts function.
 * - ExtractLegalConceptsOutput - The return type for the extractLegalConcepts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractLegalConceptsInputSchema = z.object({
  legalText: z.string().describe('The legal text to analyze.'),
});
export type ExtractLegalConceptsInput = z.infer<typeof ExtractLegalConceptsInputSchema>;

const ExtractLegalConceptsOutputSchema = z.object({
  concepts: z.array(z.string()).describe('Key legal concepts extracted from the text.'),
  relationships: z
    .array(z.string())
    .describe('Relationships between the extracted concepts.'),
  summary: z.string().describe('A brief summary of the legal text.'),
});
export type ExtractLegalConceptsOutput = z.infer<typeof ExtractLegalConceptsOutputSchema>;

export async function extractLegalConcepts(input: ExtractLegalConceptsInput): Promise<ExtractLegalConceptsOutput> {
  return extractLegalConceptsFlow(input);
}

const extractLegalConceptsPrompt = ai.definePrompt({
  name: 'extractLegalConceptsPrompt',
  input: {schema: ExtractLegalConceptsInputSchema},
  output: {schema: ExtractLegalConceptsOutputSchema},
  prompt: `You are a meticulous expert legal analyst and editor. Your task is to analyze the following legal text with extreme precision.
  
  1.  **Extract:** Identify the key legal concepts and the relationships between them.
  2.  **Summarize:** Write a brief, clear summary of the text.
  3.  **Proofread:** Meticulously check your output for any spelling or grammatical errors. Double-check for any spelling errors before outputting the JSON. The output must be flawless.

  Legal Text:
  {{{legalText}}}

  The output must be a JSON object with three fields: 'concepts' (an array of strings), 'relationships' (an array of strings), and 'summary' (a string). Ensure your analysis is accurate and comprehensive.`,
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
