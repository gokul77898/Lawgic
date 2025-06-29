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
    const prompt = `You are a graphic design AI. Create an infographic with a professional and clean style, based on the provided content. **Your output must be a single, high-quality image.**

**VISUAL INSTRUCTIONS (Follow Precisely):**

1.  **Overall Theme:** The infographic visually represents a balance of concepts using the 'Scales of Justice' metaphor.
2.  **Background:** Use a light, off-white or very light beige background (e.g., #fdfaf5).
3.  **Title:**
    *   At the very top, centered, display the main title: "${title}".
    *   Use a large, bold, black, sans-serif font.
4.  **Central Graphic:**
    *   The dominant visual element is a detailed illustration of the Scales of Justice in the center of the image.
    *   Above the pivot of the scales, include a small, official-looking emblem or crest to give it a sense of authority.
5.  **Left Side of Scale:**
    *   On the left scale pan, place some stylized document icons.
    *   To the left of the scale, clearly list the following text, connected by lines to the scale pan:
        *   **Main Concept:** ${leftScale.concept}
        *   **Detail 1:** ${leftScale.details[0]}
        *   **Detail 2:** ${leftScale.details[1]}
6.  **Right Side of Scale:**
    *   On the right scale pan, place some stylized document icons.
    *   To the right of the scale, clearly list the following text, connected by lines to the scale pan:
        *   **Main Concept:** ${rightScale.concept}
        *   **Detail 1:** ${rightScale.details[0]}
        *   **Detail 2:** ${rightScale.details[1]}
7.  **Icons:**
    *   Place a simple, small line-art icon of a balance scale to the far left of the main graphic.
    *   Place a simple, small line-art icon of a clock to the far right of the main graphic.
8.  **Text & Style:**
    *   All text must be perfectly legible, well-aligned, and free of any spelling errors or artifacts.
    *   Use a consistent, professional sans-serif font throughout.
    *   The layout should be balanced and aesthetically pleasing. Do not include any other text or elements not specified here.

**CRITICAL:** The final image must look like a professionally designed infographic, not a simple drawing. Pay close attention to alignment, spacing, and font choice.`;

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
