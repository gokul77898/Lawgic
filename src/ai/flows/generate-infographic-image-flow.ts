'use server';
/**
 * @fileOverview Flow to generate an infographic image based on a 'Scales of Justice' template.
 *
 * - generateInfographicImage - A function that handles the generation of the infographic image.
 * - GenerateInfographicImageInput - The input type for the generateInfographicImage function.
 * - GenerateInfographicImageOutput - The return type for the generateInfographicImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { ScaleConceptSchema } from '@/ai/schemas';


const GenerateInfographicImageInputSchema = z.object({
  title: z.string(),
  leftScale: ScaleConceptSchema,
  rightScale: ScaleConceptSchema,
});
export type GenerateInfographicImageInput = z.infer<
  typeof GenerateInfographicImageInputSchema
>;

const GenerateInfographicImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('A data URI of the generated infographic image.'),
});
export type GenerateInfographicImageOutput = z.infer<
  typeof GenerateInfographicImageOutputSchema
>;

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
  async (input) => {
    const prompt = `You are a professional graphic designer AI. Create a single, high-quality background illustration for an infographic, based on a specific template. **DO NOT RENDER ANY TEXT.**

**VISUAL INSTRUCTIONS (Follow these exactly):**

1.  **Style:** Clean, professional vector illustration with a slightly formal, judicial feel.
2.  **Background Color:** Use a solid, light beige color (#fdfaf5).
3.  **Central Element:** Draw a large, detailed illustration of the Scales of Justice. The scales must be perfectly balanced and centered horizontally in the image. The scale pans should be large. The overall scale graphic should occupy the central and right portions of the image, leaving significant empty space on the left.
4.  **Top Decorative Elements:**
    *   In the very top-left corner, draw a small, simple line-art icon of a balance scale.
    *   In the very top-right corner, draw a small, simple line-art icon of a clock.
    *   Below the top margin and centered horizontally, draw a small, detailed, official-looking crest or emblem. This should be positioned above the pivot point of the main scales graphic.
5.  **Composition & Layout:**
    *   The entire top area of the image needs to have enough empty space for a long, two-line title.
    *   The left side of the image must have a large, clear rectangular area for a block of text. This area should be next to, but not overlapping, the central scales graphic.
    *   The right scale pan must be drawn in a way that it can serve as a background for a block of text that will be overlaid later.
    *   The overall composition must be balanced, clean, and professional.

**CRITICAL:** The final image must be an illustration ONLY. **It must not contain any words, letters, or numbers.** The image is a background layer.`;

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

    return {imageUrl: media.url};
  }
);
