import { validator } from "hono/validator";
import { eventsQuerySchema } from "@repo/shared/schemas/events";

export const eventsQueryValidator = validator('query', (value, c) => {
  const result = eventsQuerySchema.safeParse(value);
  if (!result.success) {
    return c.json(result.error.flatten(), 400);
  }

  return result.data;
});
