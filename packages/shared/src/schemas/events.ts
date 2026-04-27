import { z } from 'zod';

export const eventsQuerySchema = z.object({
  page: z.string()
    .optional()
    .transform(v => v ? parseInt(v.toString()) : 1)
    .refine(v => !isNaN(v) && v >= 1, {
      message: '`page` must be a number and must be greater than 0.'
    }),
});
