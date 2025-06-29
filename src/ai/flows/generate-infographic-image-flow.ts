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
    const prompt = `You are a visionary graphic designer AI. Your task is to create a single, stunning, and colorful background illustration for a professional infographic. This is a background layer, so it must be beautiful but also allow text to be readable on top of it. **DO NOT RENDER ANY TEXT ON THE IMAGE.**

**THEME:** The illustration should be an abstract, artistic representation of the infographic's main topic.
-   **Title:** ${input.title}
-   **Key Concept A:** ${input.keyConceptA.concept}
-   **Key Concept B:** ${input.keyConceptB.concept}

**VISUAL INSTRUCTIONS (Follow these exactly):**

1.  **Style:** Vibrant, artistic, and modern. Think of a high-end digital illustration. Use gradients, dynamic shapes, and thematic elements inspired by the content above. The overall feeling should be engaging and professional.
2.  **Color Palette:** Use a rich and harmonious color palette. The colors should be vibrant but work well together. Avoid jarring or overly simplistic colors.
3.  **Composition:** The composition must be visually interesting but also functional as a background. It should be more detailed and vibrant around the edges, with areas of lower visual noise and complexity in the center and top where text will be overlaid. This is critical for readability.
4.  **Content:** Create an abstract visual metaphor for the concepts. For example, if the topic is about a legal conflict, you could use imagery of intertwined, flowing lines or contrasting geometric forms. Do not use literal representations.

**CRITICAL:** The final image must be a beautiful, colorful, and abstract illustration ONLY. **It must not contain any words, letters, or numbers.** It is a background layer, and text will be added later.`;

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
