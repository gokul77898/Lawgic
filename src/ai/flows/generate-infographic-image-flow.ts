
'use server';
/**
 * @fileOverview Flow to generate an infographic image from legal analysis data.
 *
 * - generateInfographicImage - A function that handles the generation of the infographic image.
 * - GenerateInfographicImageInput - The input type for the generateInfographicImage function.
 * - GenerateInfographicImageOutput - The return type for the generateInfographicImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInfographicImageInputSchema = z.object({
  summary: z.string().describe("A brief summary of the legal text."),
  concepts: z.array(z.string()).describe("Key legal concepts extracted from the text."),
  relationships: z.array(z.string()).describe("Relationships between the extracted concepts."),
  structure: z.string().describe("A description of the suggested infographic structure."),
});
export type GenerateInfographicImageInput = z.infer<typeof GenerateInfographicImageInputSchema>;

const GenerateInfographicImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe("A data URI of the generated infographic image."),
});
export type GenerateInfographicImageOutput = z.infer<typeof GenerateInfographicImageOutputSchema>;

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
  async ({ summary, concepts, relationships, structure }) => {
    const conceptsList = concepts.map(c => `- ${c}`).join('\n');
    const relationshipsList = relationships.map(r => `- ${r}`).join('\n');

    const prompt = `
**TASK:** Generate a single, ultra-high-resolution, professional infographic image.

**STYLE:**
- Clean, simple, modern, vector-graphic style.
- Sharp lines, simple icons.
- Clear, high-contrast color palette.

**CONTENT AND LAYOUT INSTRUCTIONS:**
- Use the following description as a precise guide for the layout and content:
${structure}

**TEXT TO RENDER (MUST BE PERFECT):**
- **Summary:** ${summary}
- **Key Concepts:**
${conceptsList}
- **Relationships:**
${relationshipsList}

**ABSOLUTE RULES (FAILURE IS NOT AN OPTION):**
1.  **TEXT ACCURACY:** Render ALL text from the "TEXT TO RENDER" section above. Spelling must be 100% correct. Every word must be identical to the source text.
2.  **TEXT COMPLETENESS:** Do NOT cut off, truncate, or omit any text. All text must be fully visible and complete.
3.  **TEXT LEGIBILITY:** All text must be perfectly sharp, legible, and easy to read. There must be zero blurriness, artifacts, or distortion.
4.  **NO ADDITIONS:** Do not add any text that is not in the "TEXT TO RENDER" section.
`;
    
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

    return { imageUrl: media.url };
  }
);
