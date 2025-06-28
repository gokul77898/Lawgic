
'use server';
/**
 * @fileOverview Flow to convert extracted legal information into a clear flowchart structure for an infographic.
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
  prompt: `You are an expert in information design, specializing in creating simple, clear flowcharts and diagrams from complex text. Your task is to convert the following legal text into a logical flowchart structure.

**Crucial Constraint:** Your output will be used by another AI to generate an image. Therefore, your proposed flowchart structure MUST be extremely simple and easy to draw. Prioritize clarity to ensure the final image is readable.

Analyze the legal text and describe a simple flowchart or diagram structure.

**Your description must include:**
- **Layout:** A simple top-to-bottom or left-to-right flow. Use basic shapes like rectangles for concepts and arrows for relationships.
- **Nodes:** Define the key concepts or steps as nodes in the flowchart.
- **Connectors:** Describe the arrows or lines that connect the nodes, representing the aiflow and relationships.
- **Text Placement:** Specify exactly where the summary and relationship text should be placed on the diagram.

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
