
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
    const prompt = `You are a graphic design AI. Your only mission is to generate an infographic based on the provided content.

**CRITICAL RULE #1: TEXT MUST BE EXTREMELY LARGE AND PERFECTLY LEGIBLE.**
- **This is the most important rule.** All text on the infographic must be significantly larger than standard. Prioritize readability above all else.
- **Font:** Use a clean, bold, sans-serif font like Arial or Helvetica for all text.
- **Clarity & Spelling:** Text must be sharp, high-contrast (black or dark navy), and perfectly aligned. There must be **ZERO TYPOS, SPELLING ERRORS, ARTIFACTS, or CUT-OFF LETTERS.** Re-read the input text to ensure you copy it perfectly.

**LAYOUT AND CONTENT (Follow these instructions precisely):**

1.  **BACKGROUND:** A solid, very light grey background (#f8f9fa).
2.  **COLOR SCHEME:** Use a professional navy blue (#0a2540) for icons and accents.
3.  **MAIN TITLE (Summary):**
    -   Place the "Summary" text at the top, centered.
    -   **Font Size:** Make this the LARGEST text on the image. It must be bold and impactful.
    -   Add a short navy blue line directly below the title.
4.  **KEY CONCEPTS (Vertical List):**
    -   Create a clean, well-spaced vertical list for the four key concepts below the title.
    -   Separate each concept with a thin, navy blue horizontal line.
    -   For each of the four concepts:
        -   **Icon:** On the far left, show a simple, navy blue line-art icon for the concept.
        -   **Text (to the right of the icon, left-aligned):**
            -   **Alignment:** All text blocks (title and description) for all four concepts must share the exact same left-alignment to create a clean vertical line.
            -   **Concept Title:** Display the "concept" text. **Font Size: Make this a VERY LARGE, bold heading.**
            -   **Concept Description:** Display the "description" text below the title. **Font Size: Make this LARGE and easy to read.** It must be significantly larger than typical body text.
5.  **RELATIONSHIPS TEXT:**
    -   Place this text at the bottom of the infographic.
    -   **Font Size: Make this LARGE and perfectly readable.**

**INFOGRAPHIC CONTENT:**

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

Re-read all rules. Your success is measured by how large, clear, and perfectly aligned the text is. Do not fail on these primary objectives.`;

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
