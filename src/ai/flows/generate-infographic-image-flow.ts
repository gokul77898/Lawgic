
'use server';
/**
 * @fileOverview Flow to generate an infographic image from legal analysis data.
 *
 * - generateInfographicImage - A function that handles the generation of the infographic image.
 * - GenerateInfographicImageInput - The input type for the generateInfographicImage function.
 * - GenerateInfographicImageOutput - The return type for the generateInfographicImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateInfographicImageInputSchema = z.object({
  summary: z.string().describe("A 2-3 sentence summary of the legal text."),
  keyPoints: z.array(z.string()).describe("A list of the most important points from the text."),
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
  async ({ summary, keyPoints }) => {
    const keyPointsList = keyPoints.map(p => `- ${p}`).join('\n');

    const prompt = `You are an expert graphic designer tasked with creating a professional and visually engaging infographic. **This is not a flowchart.** Your goal is to present complex information in a beautiful, easy-to-digest format.

**Your absolute #1 priority is text legibility.** All text must be rendered perfectly, with no spelling errors, and must be 100% complete. Use a clean, bold, sans-serif font.

**Content for the Infographic:**

*   **Main Title:** (Use the provided summary as the main title for the infographic)
    > ${summary}

*   **Key Points:** (These are the core pieces of information. Each should have its own section or card in the infographic)
${keyPointsList}

**Design and Layout Instructions (CRITICAL):**

1.  **Layout:** Create a visually appealing layout. **Do NOT just make a vertical list.** Arrange the key points in stylishly designed content blocks or cards. You could use a two-column grid, a hub-and-spoke design, or another creative but clear arrangement.
2.  **Iconography:** For each "Key Point", create a simple, modern, relevant icon to visually represent the idea. Place the icon clearly next to or above its corresponding text.
3.  **Theme & Style:** Use a modern, clean, and professional theme. The color palette should be sophisticated (e.g., shades of blue, grey, with one strong accent color). Use background shapes and subtle dividers to create a polished look. The style must be flat and modern, not 3D.
4.  **Final Check:** Before outputting the image, double-check that every single word from the "Content" section is present on the infographic, is perfectly readable, and correctly spelled.

Produce a high-quality, high-resolution infographic based on these exact specifications.
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
