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
    const prompt = `You are a professional graphic designer AI. Create a single, high-quality background illustration for an infographic. **DO NOT RENDER ANY TEXT.**

**VISUAL INSTRUCTIONS (Follow these exactly):**

1.  **Style:** Clean, professional vector illustration.
2.  **Main Subject:** A large, detailed illustration of the Scales of Justice in the center of the image. The scales should be balanced. Make the scale pans large enough to visually anchor text that will be placed near them later.
3.  **Background:** A solid, light beige color (#fdfaf5).
4.  **Decorative Elements:**
    *   Place a small, official-looking crest or emblem directly above the pivot point of the scales.
    *   In the top-left corner, draw a small, simple line-art icon of a balance scale.
    *   In the top-right corner, draw a small, simple line-art icon of a clock.
5.  **Composition:** The overall image must be balanced, professional, and have ample empty space on the left and right sides of the central scale graphic. This space is where text will be added later.

**CRITICAL:** The final image must be an illustration ONLY. **It must not contain any words, letters, or numbers.**`;

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
