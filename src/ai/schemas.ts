/**
 * @fileOverview Defines the data schemas used across the application's AI flows.
 */

import { z } from 'zod';

/**
 * Defines the structure for a single point in the generated infographic.
 */
export const InfographicPointSchema = z.object({
  title: z.string().describe('A short, catchy title for the key point.'),
  description: z.string().describe('A one-sentence explanation of the key point.'),
  illustration_prompt: z
    .string()
    .describe(
      'A simple, concise prompt for an AI to generate an illustration for this point.'
    ),
});

export type InfographicPoint = z.infer<typeof InfographicPointSchema>;
