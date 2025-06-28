import {z} from 'zod';

export const KeyConceptSchema = z.object({
  concept: z
    .string()
    .describe('A short, punchy title for the key concept (2-4 words).'),
  description: z
    .string()
    .describe('A single, clear sentence explaining the concept.'),
  icon: z
    .string()
    .describe(
      "A simple, one or two-word name for a line-art icon that visually represents the concept (e.g., 'Gavel', 'Contract', 'Scales of Justice', 'Magnifying Glass')."
    ),
});
export type KeyConcept = z.infer<typeof KeyConceptSchema>;
