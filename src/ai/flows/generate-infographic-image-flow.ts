
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
  structure: z.string().describe("A description of the suggested infographic flowchart/diagram structure."),
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

    const prompt = `You are an image generation service. Your ONLY task is to create a clean, simple flowchart or diagram based on the exact instructions provided.

**CRITICAL INSTRUCTION: PRIORITIZE TEXT ACCURACY AND LEGIBILITY ABOVE ALL ELSE.**
The most important part of this task is that every single word of text is rendered perfectly, with no spelling errors, no omissions, and no graphical distortion. If the text is not 100% legible and complete, the image is a failure.

**VISUAL STRUCTURE (FOLLOW THIS EXACTLY):**
${structure}

**TEXT CONTENT (RENDER THIS EXACTLY AS SPECIFIED IN THE STRUCTURE):**
- **Summary:** ${summary}
- **Key Concepts:**
${conceptsList}
- **Relationships:**
${relationshipsList}

**VISUAL STYLE (NON-NEGOTIABLE):**
- **Layout:** Use the provided flowchart/diagram layout. Keep the design simple and uncluttered.
- **Style:** Minimalist vector art. High contrast color scheme.
- **Font:** Use a clean, bold, standard sans-serif font like Helvetica or Arial. Do not use decorative or script fonts.

**FINAL CHECK:** Before generating, confirm that every word in your planned image matches the text provided above and that the structure matches the description. Do not add any text that is not provided here. Do not omit any text. Do not change the layout.
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
