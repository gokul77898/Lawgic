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
    .describe('Three to five key relationships between the concepts, each described in a short phrase.'),
  summary: z.string().describe('A one-sentence summary of the legal text.'),
});
export type ExtractLegalConceptsOutput = z.infer<typeof ExtractLegalConceptsOutputSchema>;

export async function extractLegalConcepts(input: ExtractLegalConceptsInput): Promise<ExtractLegalConceptsOutput> {
  return extractLegalConceptsFlow(input);
}

const extractLegalConceptsPrompt = ai.definePrompt({
  name: 'extractLegalConceptsPrompt',
  input: {schema: ExtractLegalConceptsInputSchema},
  output: {schema: ExtractLegalConceptsOutputSchema},
  prompt: `You are a meticulous expert legal analyst and editor. Your task is to analyze the following legal text with extreme precision. Your goal is to create concise data for a visual infographic, so brevity is essential.
  
1.  **Extract Concepts:** Identify the key legal concepts.
2.  **Extract Relationships:** Identify the 3-5 most critical relationships between the concepts. Describe each relationship in a very short phrase, not a full sentence.
3.  **Summarize:** Write a single, clear, one-sentence summary of the text.
4.  **Proofread:** Meticulously check your output for any spelling or grammatical errors. The output must be flawless.

  Legal Text:
  {{{legalText}}}

  The output must be a JSON object with three fields: 'concepts' (an array of strings), 'relationships' (an array of short phrases), and 'summary' (a single sentence). Ensure your analysis is accurate and extremely concise.`,
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
