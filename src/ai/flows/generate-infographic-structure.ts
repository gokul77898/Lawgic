'use server';
/**
 * @fileOverview Flow to convert extracted legal information into a clear and understandable visual structure for an infographic.
 *
 * - generateInfographicStructure - A function that handles the generation of the infographic structure.
 * - GenerateInfographicStructureInput - The input type for the generateInfographicStructure function.
 * - GenerateInfographicStructureOutput - The return type for the generateInfographicStructure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInfographicStructureInputSchema = z.object({
  legalText: z
    .string()
    .describe("The extracted legal text to convert into an infographic structure."),
});
export type GenerateInfographicStructureInput = z.infer<typeof GenerateInfographicStructureInputSchema>;

const GenerateInfographicStructureOutputSchema = z.object({
  infographicStructure: z
    .string()
    .describe("A description of the infographic structure, including sections, visual elements, and their relationships."),
});
export type GenerateInfographicStructureOutput = z.infer<typeof GenerateInfographicStructureOutputSchema>;

export async function generateInfographicStructure(
  input: GenerateInfographicStructureInput
): Promise<GenerateInfographicStructureOutput> {
  return generateInfographicStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInfographicStructurePrompt',
  input: {schema: GenerateInfographicStructureInputSchema},
  output: {schema: GenerateInfographicStructureOutputSchema},
  prompt: `You are an expert in information design and data visualization. Your task is to convert complex legal text into a clear, logical, and visually compelling structure for an infographic.

  Analyze the following legal text and generate a description of a detailed infographic structure. This structure will be used to create a high-resolution, HD-quality image. Your description must be precise and well-written, with no spelling or grammatical errors.

  **Include:**
  - **Sections:** Break the information into logical sections with clear headings.
  - **Visual Elements:** Suggest specific, high-quality icons or simple illustrations that clarify the concepts.
  - **Flow & Relationships:** Describe how the sections and elements connect to tell a coherent story.
  - **Text Content:** All suggested text (headings, labels, callouts) must be concise and perfectly proofread.

  Legal Text: {{{legalText}}}
  `,
});

const generateInfographicStructureFlow = ai.defineFlow(
  {
    name: 'generateInfographicStructureFlow',
    inputSchema: GenerateInfographicStructureInputSchema,
    outputSchema: GenerateInfographicStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
