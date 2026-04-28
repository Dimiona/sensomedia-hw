import { z } from 'zod';
import { eventResponseSchema } from './event.ts';
import { paginatedResponseSchema } from './responses.ts';
import { PER_PAGE } from '../const.ts';

export const eventsQuerySchema = z.object({
  page: z.string()
    .optional()
    .transform(v => v ? parseInt(v.toString()) : 1)
    .refine(v => !isNaN(v) && v >= 1, {
      message: '`page` must be a number and must be greater than 0.'
    }),
  perpage: z.string()
    .optional()
    .transform(v => v ? parseInt(v.toString()) : PER_PAGE)
    .refine(v => !isNaN(v) && v >= 1, {
      message: '`perpage` must be a number and must be greater than 0.'
    }),
});

export const eventsResponseSchema = paginatedResponseSchema.extend({
  items: z.array(eventResponseSchema),
});
