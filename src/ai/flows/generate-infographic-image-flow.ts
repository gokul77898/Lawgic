
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
  async ({ summary, concepts, relationships }) => {
    const conceptsList = concepts.map(c => `- ${c}`).join('\n');
    const relationshipsList = relationships.map(r => `- ${r}`).join('\n');

    const prompt = `You are an expert graphic designer tasked with creating a minimalist, clear, and professional infographic.

**Critical Mission:** Your absolute #1 priority is flawless text rendering. Every single word must be perfectly legible, spelled correctly, and complete. If the text is not 100% readable, the entire image is a failure.

**Content to Display:**
1.  **Main Title (from Summary):** ${summary}
2.  **Key Concepts (as a list or distinct blocks):**
${conceptsList}
3.  **Key Relationships (as a list or connecting lines):**
${relationshipsList}

**Visual Instructions (Non-negotiable):**
- **Layout:** Create a simple, clean, three-section layout. A main title section, a section for 'Key Concepts', and a section for 'Key Relationships'. Use simple geometric shapes (rectangles, circles) to frame the content. Do NOT create complex or illustrative scenes.
- **Style:** Flat, 2D vector graphic. High-contrast colors. No gradients, no shadows, no complex textures.
- **Font:** Use a bold, standard, sans-serif font like Arial or Helvetica. The font must be extremely clear.
- **Icons:** You may use one simple, universally understood icon for each 'Key Concept'. The icon must be secondary to the text.
- **Do NOT add any text that is not explicitly provided above.**
- **Do NOT omit any text.**

Generate the image based on these strict instructions.
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
