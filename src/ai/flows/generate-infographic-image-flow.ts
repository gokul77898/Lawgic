'use server';
/**
 * @fileOverview Flow to generate an infographic background image.
 *
 * - generateInfographicImage - A function that handles the generation of the infographic image.
 * - GenerateInfographicImageInput - The input type for the generateInfographicImage function.
 * - GenerateInfographicImageOutput - The return type for the generateInfographicImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { KeyConceptSchema } from '@/ai/schemas';


const GenerateInfographicImageInputSchema = z.object({
  title: z.string(),
  keyConceptA: KeyConceptSchema,
  keyConceptB: KeyConceptSchema,
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
    const prompt = `You are a professional graphic designer AI. Create a single, high-quality background illustration for a professional infographic. **DO NOT RENDER ANY TEXT.**

**VISUAL INSTRUCTIONS (Follow these exactly):**

1.  **Style:** Modern, minimalist, and professional. Use clean lines, subtle gradients, and abstract geometric shapes. The feeling should be corporate and clean, like a high-end presentation slide.
2.  **Background Color:** Use a solid, light neutral color like a very light grey (#f8f9fa) or off-white.
3.  **Layout Elements:**
    *   **Top Third:** This area should be mostly clean, reserved for a large title. You can add a subtle, thin horizontal line or a very light geometric pattern at the very top as a decorative header element.
    *   **Bottom Two-Thirds:** Divide this area visually into two vertical columns. Use a thin, faint vertical line down the center to suggest the two columns. In each column, add some abstract, light-colored shapes (like circles, rectangles, or lines) to create visual interest. These shapes must be very subtle and not interfere with the text that will be overlaid.
4.  **Color Palette:** Use a sophisticated and limited color palette. The primary background should be neutral. For the abstract shapes, use desaturated, professional colors like a soft blue, a muted teal, or a light charcoal grey. The colors should be harmonious and not distracting.
5.  **Composition:** The overall composition must be balanced, spacious, and uncluttered. It is a background layer designed to make overlaid text look good. Ensure there is plenty of negative space.

**CRITICAL:** The final image must be an illustration ONLY. **It must not contain any words, letters, or numbers.** The image is a background layer for text that will be added later.`;

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
