import z from "zod";

export const paginatedResponseSchema = z.object({
  metadata: z.object({
    page: z.number().int().min(1),
    perpage: z.number().int().min(1),
  }),
  items: z.array(z.string()),
});
