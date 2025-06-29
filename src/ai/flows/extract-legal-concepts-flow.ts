'use server';
/**
 * @fileOverview Extracts key information from legal text for a professional infographic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { InfographicPointSchema } from '@/ai/schemas';

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
  points: z
    .array(InfographicPointSchema)
    .min(3, 'Must provide at least 3 key points.')
    .max(6, 'Must provide no more than 6 key points.')
    .describe('An array of 3 to 6 key points from the text.'),
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
  prompt: `Analyze the provided legal text to its fullest extent. Your goal is to extract the most important information and structure it for a professional infographic. The information must be comprehensive, detailed, and meticulously proofread.

You MUST extract the following information:
1.  **Title:** A concise but descriptive title that captures the central theme of the text.
2.  **Key Points:** Identify between 3 and 6 of the most critical points, arguments, or pieces of information from the text. For each point, provide:
    - A short title.
    - A one-sentence description.
    - A simple, concise prompt for an AI to generate an illustration (illustration_prompt). For example: "A man giving a speech", "A government building with columns", "Two people arguing".
3.  **Summary:** A detailed, one-paragraph summary that comprehensively explains the entire legal text, its context, and its conclusion.

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
