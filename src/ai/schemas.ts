import {z} from 'zod';

export const InfographicPointSchema = z.object({
  title: z.string().describe('A short, descriptive title for the key point.'),
  description: z
    .string()
    .describe('A detailed, one-sentence explanation of the key point.'),
});
export type InfographicPoint = z.infer<typeof InfographicPointSchema>;
