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
      'A comprehensive summary of the legal text, capturing the main argument and conclusion in 2-3 sentences.'
    ),
  keyConcepts: z
    .array(z.string())
    .length(4, 'Must provide exactly 4 key concepts')
    .describe(
      'A list of the four most important, core concepts from the text. Each concept should be a concise phrase that captures a key pillar of the text.'
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
  prompt: `You are an expert legal analyst. Your mission is to distill the entire logical structure and core arguments of the provided legal text. The goal is to capture the complete concept of the article in a format suitable for a detailed infographic.

1.  **Comprehensive Summary:** Write a thorough summary (2-3 sentences) that precisely captures the central argument, its context, and the final conclusion of the legal text. This summary must encapsulate the main takeaway of the entire document.

2.  **Extract Core Arguments:** Identify the four foundational pillars that constitute the text's complete argument. These are not just topics; they are the core propositions or findings. Each concept must be a descriptive phrase that is fully representative of a key part of the author's reasoning (e.g., "Arbitrators' Power is Defined by Contract," "Judicial Review is Narrowly Limited," "Consent to Arbitration Must Be Clear," "Public Policy Can Invalidate Awards").

3.  **Explain the Logical Flow:** Write a detailed paragraph (3-4 sentences) explaining how these four pillars logically connect to form the complete argument. Describe the flow of reasoning from one concept to the next, showing how they build on each other to reach the main conclusion outlined in your summary.

4.  **Proofread:** Meticulously check your output for any spelling or grammatical errors. The output must be flawless.

Legal Text:
{{{legalText}}}

The output must be a JSON object with three fields: 'summary' (a comprehensive 2-3 sentence string), 'keyConcepts' (an array of exactly 4 descriptive strings representing core arguments), and 'relationships' (a detailed 3-4 sentence paragraph explaining the logical flow).`,
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
