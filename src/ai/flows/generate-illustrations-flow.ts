
'use server';
/**
 * @fileOverview Flow to generate multiple illustrations in parallel for infographic points.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateIllustrationsInputSchema = z.object({
  prompts: z
    .array(z.string())
    .describe('An array of text prompts for the illustrations.'),
});
export type GenerateIllustrationsInput = z.infer<
  typeof GenerateIllustrationsInputSchema
>;

const GenerateIllustrationsOutputSchema = z.object({
  imageUrls: z
    .array(z.string())
    .describe('An array of data URIs for the generated images.'),
});
export type GenerateIllustrationsOutput = z.infer<
  typeof GenerateIllustrationsOutputSchema
>;

export async function generateIllustrations(
  input: GenerateIllustrationsInput
): Promise<GenerateIllustrationsOutput> {
  return generateIllustrationsFlow(input);
}

const generateSingleIllustration = async (
  prompt: string
): Promise<string> => {
  const fullPrompt = `Generate a single, simple, clear illustration for an infographic.
- The style must be a modern, professional, flat illustration style.
- The composition should be clean and uncluttered.
- The subject of the illustration is: "${prompt}"
- The illustration MUST be isolated on a plain, light beige background (#f5f1ec).
- DO NOT include any text, letters, or numbers in the image.
- The image should be square.`;

  const {media} = await ai.generate({
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    prompt: fullPrompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  if (!media?.url) {
    throw new Error(`Image generation failed for prompt: ${prompt}`);
  }
  return media.url;
};

const generateIllustrationsFlow = ai.defineFlow(
  {
    name: 'generateIllustrationsFlow',
    inputSchema: GenerateIllustrationsInputSchema,
    outputSchema: GenerateIllustrationsOutputSchema,
  },
  async ({prompts}) => {
    const illustrationPromises = prompts.map((p) =>
      generateSingleIllustration(p)
    );
    const imageUrls = await Promise.all(illustrationPromises);
    return {imageUrls};
  }
);
