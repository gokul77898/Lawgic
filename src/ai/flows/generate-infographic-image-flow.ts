
'use server';
/**
 * @fileOverview Flow to generate an infographic image based on a specific visual template.
 *
 * - generateInfographicImage - A function that handles the generation of the infographic image.
 * - GenerateInfographicImageInput - The input type for the generateInfographicImage function.
 * - GenerateInfographicImageOutput - The return type for the generateInfographicImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateInfographicImageInputSchema = z.object({
  summary: z.string().describe('A one-sentence summary of the legal text.'),
  keyConcepts: z
    .array(z.string())
    .length(4)
    .describe('A list of four key concepts, each a short phrase.'),
  relationships: z
    .string()
    .describe(
      'A short paragraph explaining the connection between the concepts.'
    ),
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
  async ({summary, keyConcepts, relationships}) => {
    const prompt = `You are an expert graphic designer tasked with creating a professional and visually engaging infographic based on a specific, clean design.

**CRITICAL: YOUR #1 PRIORITY IS PERFECT TEXT LEGIBILITY.** All text must be 100% complete, spelled correctly, and rendered in a clean, bold, sans-serif font (like Arial or Helvetica). There must be no typos or garbled letters.

**Design and Layout Instructions (Follow these EXACTLY):**

1.  **Background:** Use a plain, solid white background for the entire image.
2.  **Color Palette:** Use a simple, professional palette. The main color for shapes should be a dark blue (e.g., #003366). All text inside shapes should be white. All text outside shapes should be black.
3.  **Main Title:**
    *   Place the provided "Summary" text at the top-center of the infographic.
    *   Use black text.
    *   Place a short, dark blue horizontal line directly underneath the summary text.
4.  **Central Graphic:**
    *   Create a central graphic consisting of four interconnected dark blue circles. They should be arranged in a visually balanced way, similar to a four-leaf clover or a 2x2 grid with connecting elements.
    *   Place one "Key Concept" inside each of the four circles.
    *   The text inside the circles **MUST** be white, centered, and perfectly readable.
5.  **Icons:**
    *   Place four simple, black, line-art style icons around the central graphic. These icons should be abstract and related to legal or business concepts (e.g., scales of justice, a gavel, a document, a handshake). Do not place them inside the circles.
6.  **Relationships Text:**
    *   Place the "Relationships" text below the central graphic.
    *   Use black text, slightly smaller than the main title.
7.  **Final Check:** Before outputting the image, meticulously check that:
    *   Every single word from the content is present and spelled correctly.
    *   The layout exactly matches these instructions.
    *   The text is perfectly clear and legible.

**Content for the Infographic:**

*   **Summary:**
    > ${summary}

*   **Key Concepts (for the four circles):**
    1. ${keyConcepts[0]}
    2. ${keyConcepts[1]}
    3. ${keyConcepts[2]}
    4. ${keyConcepts[3]}

*   **Relationships:**
    > ${relationships}

Produce a high-quality, high-resolution infographic based on these exact specifications.`;

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
