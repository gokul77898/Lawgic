
'use server';
/**
 * @fileOverview Flow to convert extracted legal information into a clear structure for an infographic.
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
  prompt: `You are an expert in information design, specializing in creating visually engaging and easy-to-understand infographics from complex text. Your task is to propose a structure for an infographic based on the provided legal text.

Your output must be a description that an image generation AI can use. It must be clear, simple, and easy to draw.

Your description must include:
- **Theme & Style:** Suggest a visual theme (e.g., 'modern and clean', 'justice and balance').
- **Layout:** Describe a visually appealing layout. Don't just list items; describe how they should be arranged (e.g., a central icon with radiating points, a vertical timeline, three distinct sections with headers).
- **Iconography:** For each key concept, suggest a simple, recognizable icon that could represent it.
- **Text Placement:** Specify exactly where the summary, concepts, and relationship text should be placed on the infographic.

The final image quality depends entirely on the simplicity and clarity of your structural description.

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
