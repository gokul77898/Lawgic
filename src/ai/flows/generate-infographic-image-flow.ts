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
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an ultra-high-resolution, visually clear, and professional infographic based on the following legal analysis. The final image must be of the highest quality, similar to a vector graphic with sharp lines and crystal-clear, perfectly legible text. Every word must be spelled correctly.

      **Overall Summary:**
      ${summary}

      **Key Concepts to Highlight:**
      ${concepts.join(', ')}

      **Relationships to Visualize:**
      ${relationships.join('; ')}

      **Suggested Structure:**
      ${structure}

      **Design requirements:**
      - **Clarity is paramount.** All text must be easily readable, sharp, and free of artifacts.
      - **Professional Design:** Use a clean, modern layout with a clear visual hierarchy.
      - **Visuals:** Employ simple, high-quality icons and graphics to represent concepts. Avoid overly complex or photorealistic imagery.
      - **Color Palette:** Use a professional and accessible color scheme that ensures high contrast and readability.
      - **Title:** The infographic must be titled "Legal Analysis".
      - **Proofreading:** Double-check all text for spelling and grammatical errors before finalizing the image. The output must be perfect.
      `,
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
