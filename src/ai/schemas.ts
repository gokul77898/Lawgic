import {z} from 'zod';

export const ScaleConceptSchema = z.object({
  concept: z
    .string()
    .describe('The main concept for one side of the scale (2-4 words).'),
  details: z
    .array(z.string())
    .length(2, 'Must provide exactly 2 detail points (4-6 words each).'),
});
export type ScaleConcept = z.infer<typeof ScaleConceptSchema>;
