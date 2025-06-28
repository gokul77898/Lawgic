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
  prompt: `You are an expert in converting complex information into visually appealing and easy-to-understand infographics.

  Analyze the following legal text and generate a description of a detailed infographic structure that would best represent the information for a high-resolution, HD quality image. Include sections, visual elements (suggesting high-quality icons or illustrations), and their relationships. The structure should be suitable for a visually rich and detailed presentation.

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
