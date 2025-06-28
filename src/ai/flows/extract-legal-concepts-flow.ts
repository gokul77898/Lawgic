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
  prompt: `You are an expert legal analyst. Analyze the following legal text and extract the key concepts, relationships between them, and a brief summary.\n\nLegal Text: {{{legalText}}}\n\nOutput should be structured as a JSON object with 'concepts', 'relationships', and 'summary' fields. The 'concepts' and 'relationships' fields should be arrays of strings.\n\nEnsure that the extracted concepts and relationships are accurate and comprehensive, and that the summary provides a clear overview of the legal text.`,
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
