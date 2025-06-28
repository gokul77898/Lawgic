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
  prompt: `You are an expert legal analyst. Your mission is to perform a comprehensive analysis of the provided legal text and extract the key information needed to build a detailed, yet easy-to-understand infographic.

1.  **Comprehensive Summary:** Do not oversimplify. Write a thorough summary (2-3 sentences) that captures the core argument, the context, and the conclusion of the legal text. This will be the main title of the infographic.

2.  **Extract Core Pillars:** Identify the **four most important pillars** or concepts that form the foundation of the text's argument. These concepts should be concise enough to fit within a visual element on an infographic, but detailed enough to be meaningful. Think of them as sub-headings (e.g., "Scope of Arbitral Power", "Contractual Consent to Arbitration", "Judicial Review Limitations", "Public Policy Exceptions").

3.  **Explain Interconnections:** Write a detailed paragraph (3-4 sentences) that doesn't just state, but *explains* the nuanced relationships between the four pillars you identified. How do they influence each other? How do they collectively support the main summary?

4.  **Proofread:** Meticulously check your output for any spelling or grammatical errors. The output must be flawless.

Legal Text:
{{{legalText}}}

The output must be a JSON object with three fields: 'summary' (a comprehensive 2-3 sentence string), 'keyConcepts' (an array of exactly 4 concise but descriptive strings), and 'relationships' (a detailed 3-4 sentence paragraph).`,
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
