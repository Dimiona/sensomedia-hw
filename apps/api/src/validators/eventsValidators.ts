import { validator } from "hono/validator";
import { eventsQuerySchema } from "@repo/shared/schemas/events";
import z from "zod";

export const eventsQueryValidator = validator('query', (value, c) => {
  const result = eventsQuerySchema.safeParse(value);
  if (!result.success) {
    return c.json({ error: `Invalid response schema: ${z.treeifyError(result.error).errors.join('\n')}` }, 400);
  }

  return result.data;
});
