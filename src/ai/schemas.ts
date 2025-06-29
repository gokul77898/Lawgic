import {z} from 'zod';

export const KeyConceptSchema = z.object({
  concept: z
    .string()
    .describe('A short, descriptive title for the key concept.'),
  details: z
    .array(z.string())
    .length(2, 'Must provide exactly 2 detailed supporting points for the concept.'),
});
export type KeyConcept = z.infer<typeof KeyConceptSchema>;
