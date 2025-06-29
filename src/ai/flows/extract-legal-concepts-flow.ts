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
      "The main title for the infographic, from the text's central theme (2-3 words)."
    ),
  leftScale: ScaleConceptSchema.describe(
    "Represents one side of the argument/topic."
  ),
  rightScale: ScaleConceptSchema.describe(
    'Represents the opposing side of the argument/topic.'
  ),
  summary: z.string().describe('A one-sentence summary of the entire legal text.'),
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
  prompt: `Analyze the provided legal text. Your goal is to extract the core components to build an infographic based on a 'Scales of Justice' visual metaphor.

You MUST extract the following information:
1.  **Title:** A 2-3 word title summarizing the main topic.
2.  **Left Scale Concept:** Identify the primary concept or party. Provide a 2-4 word title for it. Then, list exactly two concise, 4-6 word supporting points for this concept.
3.  **Right Scale Concept:** Identify the opposing or corresponding concept/party. Provide a 2-4 word title for it. Then, list exactly two concise, 4-6 word supporting points for this concept.
4.  **Summary:** A brief, one-sentence summary of the entire text.

Ensure your output is structured as a JSON object matching the requested schema. All text must be grammatically perfect.

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
