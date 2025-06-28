
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
  async ({ structure }) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `You are a world-class graphic designer specializing in data visualization. Your sole task is to create a professional, ultra-high-resolution infographic based *only* on the detailed structure provided below.

**Infographic Structure to Render:**
${structure}

**CRITICAL INSTRUCTIONS:**
1.  **Style:** The image MUST be in a clean, modern, vector-graphic style. Use sharp lines, simple icons, and high-contrast colors.
2.  **Text Quality:** All text MUST be perfectly sharp, legible, and easy to read. There should be zero blurriness or artifacts.
3.  **Accuracy:** Every single word from the provided structure must be rendered with perfect spelling. DO NOT add, omit, or change any text.
4.  **Layout:** Follow the layout described in the structure precisely.

The final output must be a visually appealing, professional, and flawlessly accurate infographic.`,
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
