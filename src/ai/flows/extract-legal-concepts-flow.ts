'use server';
/**
 * @fileOverview Extracts key information from legal text to populate a 'Scales of Justice' infographic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { ScaleConceptSchema } from '@/ai/schemas';

const ExtractLegalConceptsInputSchema = z.object({
  legalText: z.string().describe('The legal text to analyze.'),
});
export type ExtractLegalConceptsInput = z.infer<typeof ExtractLegalConceptsInputSchema>;

const ExtractLegalConceptsOutputSchema = z.object({
  title: z
    .string()
    .describe(
      "A concise but descriptive title for the infographic, capturing the text's central theme."
    ),
  leftScale: ScaleConceptSchema.describe(
    "Represents the primary argument, party, or concept."
  ),
  rightScale: ScaleConceptSchema.describe(
    'Represents the opposing or corresponding argument, party, or concept.'
  ),
  summary: z.string().describe('A detailed, one-paragraph summary of the entire legal text.'),
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
  prompt: `Analyze the provided legal text to its fullest extent. Your goal is to extract the most important information and structure it for a 'Scales of Justice' infographic. The information must be comprehensive and detailed.

You MUST extract the following information:
1.  **Title:** A concise but descriptive title that captures the central theme of the text.
2.  **Left Scale Concept:** Identify the primary argument, party, or concept. Provide a short, descriptive title for it. Then, list exactly two detailed supporting points or key arguments for this concept. These details should be complete sentences and fully explain the point.
3.  **Right Scale Concept:** Identify the opposing or corresponding argument, party, or concept. Provide a short, descriptive title for it. Then, list exactly two detailed supporting points or key arguments for this concept, similar to the left scale.
4.  **Summary:** A detailed, one-paragraph summary that comprehensively explains the entire legal text, its context, and its conclusion.

Ensure your output is structured as a JSON object matching the requested schema. All text must be grammatically perfect and free of spelling errors.

Legal Text:
{{{legalText}}}`,
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
