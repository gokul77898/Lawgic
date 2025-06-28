
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
import { KeyConceptSchema } from '@/ai/schemas';


const GenerateInfographicImageInputSchema = z.object({
  summary: z.string().describe('A one-sentence summary of the legal text.'),
  keyConcepts: z
    .array(KeyConceptSchema)
    .length(4)
    .describe('A list of four key concepts, each with a concept, description, and icon name.'),
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
    const prompt = `You are an expert graphic designer tasked with creating a professional, clean, and modern infographic.

**CRITICAL: YOUR #1 PRIORITY IS PERFECT TEXT LEGIBILITY.** All text must be 100% complete, spelled correctly, and rendered in a clean, bold, sans-serif font (like Arial or Helvetica). There must be no typos, garbled letters, or cut-off text.

**Design and Layout Instructions (Follow these EXACTLY):**

1.  **Background:** Use a solid, very light grey background (e.g., #f8f9fa).
2.  **Color Palette:** Use a professional and cohesive color palette. The primary color for accents and icons should be a deep navy blue (e.g., #0a2540). Text should be black or very dark grey.
3.  **Main Title (Summary):**
    *   Place the provided "Summary" text at the very top of the infographic, centered.
    *   Make it the largest text on the image.
    *   Place a short, navy blue horizontal line directly underneath the summary text.
4.  **Key Concepts Grid (2x2):**
    *   Create a 2x2 grid of four rounded rectangular cards below the main title. The cards should have a white background and a subtle drop shadow. Ensure adequate spacing between cards.
    *   For each of the four cards, do the following:
        *   **Icon:** At the top of the card, centered, place a simple, navy blue, line-art icon corresponding to the provided icon name.
        *   **Concept Title:** Below the icon, display the "concept" text as a bold heading.
        *   **Concept Description:** Below the heading, display the "description" text in a smaller, regular font.
        *   All text within the card should be centered and perfectly readable.
5.  **Relationships Text:**
    *   Place the "Relationships" text at the bottom of the infographic, below the grid.
    *   Use a regular font size, smaller than the main title but slightly larger than the card descriptions.
6.  **Overall Style:** The final image must look modern, clean, and professional. Ensure balanced whitespace and perfect alignment.

**Content for the Infographic:**

*   **Summary:**
    > ${summary}

*   **Key Concepts Grid (for the four cards):**
    1.  **Icon:** ${keyConcepts[0].icon}
        **Concept:** ${keyConcepts[0].concept}
        **Description:** ${keyConcepts[0].description}
    2.  **Icon:** ${keyConcepts[1].icon}
        **Concept:** ${keyConcepts[1].concept}
        **Description:** ${keyConcepts[1].description}
    3.  **Icon:** ${keyConcepts[2].icon}
        **Concept:** ${keyConcepts[2].concept}
        **Description:** ${keyConcepts[2].description}
    4.  **Icon:** ${keyConcepts[3].icon}
        **Concept:** ${keyConcepts[3].concept}
        **Description:** ${keyConcepts[3].description}

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
