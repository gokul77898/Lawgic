
'use server';
/**
 * @fileOverview Flow to generate an infographic image from legal analysis data.
 *
 * - generateInfographicImage - A function that handles the generation of the infographic image.
 * - GenerateInfographicImageInput - The input type for the generateInfographicImage function.
 * - GenerateInfographicImageOutput - The return type for the generateInfographicImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInfographicImageInputSchema = z.object({
  summary: z.string().describe("A brief summary of the legal text."),
  concepts: z.array(z.string()).describe("Key legal concepts extracted from the text."),
  relationships: z.array(z.string()).describe("Relationships between the extracted concepts."),
  structure: z.string().describe("A description of the suggested infographic structure."),
});
export type GenerateInfographicImageInput = z.infer<typeof GenerateInfographicImageInputSchema>;

const GenerateInfographicImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe("A data URI of the generated infographic image."),
});
export type GenerateInfographicImageOutput = z.infer<typeof GenerateInfographicImageOutputSchema>;

export async function generateInfographicImage(
  input: GenerateInfographicImageInput
): Promise<GenerateInfographicImageOutput> {
  return generateInfographicImageFlow(input);
}

const generateInfographicImageFlow = ai.defineFlow(
  {
    name: 'generateInfographicImageFlow',
    inputSchema: GenerateInfographicImageInputSchema,
    outputSchema: GenerateInfographicImageOutputSchema,
  },
  async ({ summary, concepts, relationships, structure }) => {
    const conceptsList = concepts.map(c => `- ${c}`).join('\n');
    const relationshipsList = relationships.map(r => `- ${r}`).join('\n');

    const prompt = `You are a world-class graphic designer specializing in data visualization. Your sole task is to create a professional, ultra-high-resolution infographic. You are an expert in creating clean, modern, vector-style graphics with perfectly legible text. You never cut off text or make spelling errors.

Create an infographic based on the following information.

**Key Information to Render:**
*   **Summary:** ${summary}
*   **Key Concepts:**
${conceptsList}
*   **Relationships:**
${relationshipsList}

**Suggested Structure:**
Use the following description as a guide for the layout:
${structure}

**CRITICAL INSTRUCTIONS:**
1.  **Content Accuracy:** You MUST include all the text from the "Key Information to Render" section. Render every word with perfect spelling. DO NOT add, omit, or change any text from the key information. Ensure all content is fully visible and not cut-off.
2.  **Style:** The image MUST be in a clean, simple, modern, vector-graphic style. Use sharp lines, simple icons, and a clear, high-contrast color palette.
3.  **Text Quality:** All text MUST be perfectly sharp, legible, and easy to read. There should be zero blurriness, artifacts, or incomplete words.
4.  **Layout:** Follow the "Suggested Structure" as a guide to lay out the information logically and visually.

The final output must be a visually appealing, professional, and flawlessly accurate infographic that contains all the provided key information.
`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
