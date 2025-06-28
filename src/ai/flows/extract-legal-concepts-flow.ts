
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
  prompt: `You are a meticulous expert legal analyst. Your task is to analyze legal text and distill it into its most essential components for an infographic. Your absolute top priority is extreme brevity and accuracy, as this text will be rendered on an image where space is limited.

1.  **Extract Concepts:** Identify the 3-5 most important legal concepts. These must be very short (1-3 words max).
2.  **Extract Relationships:** Identify the 3 most critical relationships between these concepts. Describe each relationship in a very short, crisp phrase (3-5 words max).
3.  **Summarize:** Write a single, extremely concise, one-sentence summary of the entire text.
4.  **Proofread:** Meticulously check your output for any spelling or grammatical errors. The output must be flawless.

Legal Text:
{{{legalText}}}

The output must be a JSON object with three fields: 'concepts' (an array of 3-5 strings), 'relationships' (an array of 3 short phrases), and 'summary' (a single sentence). Ensure your analysis is accurate and extremely concise.`,
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
