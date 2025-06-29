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
  async ({title, leftScale, rightScale}) => {
    const leftDetails = leftScale.details.join(' ');
    const rightDetails = rightScale.details.join(' ');

    const prompt = `You are a professional graphic designer AI. Create a single, high-quality infographic image. **The text quality and style are the most important things.**

**VISUAL INSTRUCTIONS (Follow these exactly):**

1.  **Style:** Clean, professional vector illustration.
2.  **Background:** Light beige color (#fdfaf5).
3.  **Title:**
    *   Text: "${title}"
    *   Placement: Top, center.
    *   Font: **Large, bold, black, condensed sans-serif.**
4.  **Central Graphic:**
    *   A large, detailed illustration of the Scales of Justice in the center.
    *   Place a small, official-looking crest above the pivot of the scales.
    *   Put stylized documents on the scale pans.
5.  **Left Side Text:**
    *   Create two stacked text blocks to the left of the scale.
    *   **Top Block:** "${leftScale.concept}"
    *   **Bottom Block:** "${leftDetails}"
    *   Font for both: **Bold, black, condensed sans-serif.**
    *   Connect both text blocks to the left scale pan with thin lines.
6.  **Right Side Text:**
    *   Create two stacked text blocks to the right of the scale.
    *   **Top Block:** "${rightScale.concept}"
    *   **Bottom Block:** "${rightDetails}"
    *   Font for both: **Bold, black, condensed sans-serif.**
    *   Connect both text blocks to the right scale pan with thin lines.
7.  **Corner Icons:**
    *   Top-left: A small line-art icon of a balance scale.
    *   Top-right: A small line-art icon of a clock.

**CRITICAL:** All text must be perfectly clear, bold, and easy to read, with no spelling errors. The final image must look professional and balanced.`;

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
