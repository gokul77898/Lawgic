
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
  prompt: `You are an expert in information design. Your task is to convert complex legal text into a simple, clear, and logical structure for an infographic.

  **Crucial Constraint:** Your output will be used by another AI to generate an image. Therefore, your proposed structure MUST be simple. Avoid complex layouts, overlapping elements, or dense text blocks. Prioritize clarity and simplicity to ensure the final image is readable.

  Analyze the legal text and describe a simple infographic structure.
  
  **Your description must include:**
  - **Sections:** A logical breakdown with clear, concise headings. Use simple columnar or row-based layouts.
  - **Visual Elements:** Suggest simple, distinct icons.
  - **Flow:** Describe how the sections connect.
  - **Text:** All text must be brief and meticulously proofread.

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
