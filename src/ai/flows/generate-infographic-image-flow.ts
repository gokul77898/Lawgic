
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
**Primary Goal: TEXT CLARITY.** Your only job is to generate a professional infographic where the text is perfectly readable. If the text is not 100% sharp, clear, and legible, the result is a failure.

**Style:**
- Use a simple, modern, vector-graphic style.
- Use a high-contrast color palette.
- **Font:** Use a standard, simple, sans-serif font like Arial or Helvetica. DO NOT use fancy or artistic fonts.

**Layout Guide:**
- Use this description to guide the visual layout:
${structure}

**Text to Render (EXACTLY AS WRITTEN):**
- **Summary:** ${summary}
- **Key Concepts:**
${conceptsList}
- **Relationships:**
${relationshipsList}

**ABSOLUTE RULES:**
1.  **LEGIBILITY:** Text must be perfectly sharp and easy to read. No blurriness. No artifacts.
2.  **COMPLETENESS:** Render all text provided. Do not cut off or omit any words.
3.  **ACCURACY:** Spelling must be 100% correct, identical to the text provided.
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
