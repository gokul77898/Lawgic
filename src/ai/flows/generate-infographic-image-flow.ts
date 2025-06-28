
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

    const prompt = `You are an expert graphic designer and information visualization specialist. Your mission is to transform the provided legal analysis into a visually stunning, professional, and easy-to-understand infographic.

**Your #1 Priority is Text Clarity & Accuracy:**
- Every single word provided in the content section MUST be rendered on the image. Do not omit any text.
- All text must be perfectly legible, spelled correctly, and complete. Use a clean, bold, sans-serif font like Helvetica or Arial.
- The text is the most important part of the infographic. Visuals should support the text, not obscure it.

**Content to Visualize:**
- **Main Title:** ${summary}
- **Key Concepts:**
${conceptsList}
- **Key Relationships:**
${relationshipsList}

**Visual Style Guide (Follow these instructions):**
- **Theme:** Create a modern, professional, and clean design. Use a sophisticated color palette with good contrast. For example, a palette of blues, grays, and a single accent color.
- **Layout:** Move beyond a simple list. Arrange the content in a visually engaging way. You could use a central element with radiating points for concepts, or distinct, stylishly designed cards for each section. Be creative but maintain clarity and a logical flow.
- **Iconography:** For each "Key Concept", generate a simple, high-quality, relevant icon to visually represent it. The icon should be clean and immediately understandable. Place it next to the concept text.
- **Visual Elements:** Use subtle design elements like background shapes, separators, and containers to organize the information clearly. Avoid overly complex illustrations or 3D effects. The style should be flat and modern.
- **Proofread:** Before finalizing, double-check that all text is present, correct, and perfectly readable. This is critical.

Generate an infographic based on these precise instructions. Do not generate a simple flowchart or a list. Create a real, professional infographic.
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
