
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
    const prompt = `You are an expert graphic designer tasked with creating a professional, clean, and modern infographic with exceptional text clarity.

**NON-NEGOTIABLE CRITICAL #1 PRIORITY: PERFECT TEXT LEGIBILITY.**
-   **Font:** All text MUST be rendered in a clean, bold, sans-serif font (like Arial or Helvetica).
-   **Clarity:** The text must be large, sharp, and perfectly readable. There can be absolutely NO typos, garbled letters, cut-off text, or misspellings.
-   **Contrast:** All text must be black or very dark grey for maximum contrast against the background.

**Design and Layout Instructions (Follow these EXACTLY):**

1.  **Background:** Use a solid, very light grey background (e.g., #f8f9fa).
2.  **Color Palette:** Use a professional and cohesive color palette. The primary color for accents and icons should be a deep navy blue (e.g., #0a2540).
3.  **Main Title (Summary):**
    *   Place the provided "Summary" text at the very top of the infographic, centered.
    *   **This must be the largest text on the image, in a bold, impactful font.**
    *   Place a short, navy blue horizontal line directly underneath the summary text.
4.  **Key Concepts (Vertical List):**
    *   Below the main title, create a vertical list of the four key concepts. Each concept should be its own distinct section, separated by a thin horizontal line.
    *   **For each of the four sections, do the following:**
        *   **Layout:** Use a horizontal layout for the content of each section.
        *   **Icon:** On the far left, place a simple, navy blue, line-art icon that corresponds to the provided icon name.
        *   **Text Block (to the right of the icon):**
            *   **Alignment:** All text in this block (title and description) **MUST be left-aligned.**
            *   **Concept Title:** Display the "concept" text as a **bold, large heading.**
            *   **Concept Description:** Below the title, display the "description" text in a **clear, medium-large font.** The description font size should be noticeably larger than typical infographic text.
5.  **Relationships Text:**
    *   Place the "Relationships" text at the very bottom of the infographic, below the four concepts.
    *   **Use a clean, readable font size that is easy to read.**
6.  **Overall Style:** The final image must look modern, clean, and uncluttered. Ensure generous whitespace and perfect alignment of all elements.

**Content for the Infographic:**

*   **Summary:**
    > ${summary}

*   **Key Concepts (Vertical List):**
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

Produce a high-quality, high-resolution infographic based on these exact specifications. Failure to produce perfectly legible text will result in a failed generation.`;

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
