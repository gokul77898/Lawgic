import {z} from 'zod';

export const ScaleConceptSchema = z.object({
  concept: z
    .string()
    .describe('The main concept for one side of the scale.'),
  details: z
    .array(z.string())
    .length(2, 'Must provide exactly 2 detailed supporting points.'),
});
export type ScaleConcept = z.infer<typeof ScaleConceptSchema>;
