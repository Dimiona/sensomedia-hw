import { validator } from "hono/validator";
import { eventsQuerySchema } from "@repo/shared/schemas/events";
import { invalidSchemaResponse } from "../utility/httpResponse.ts";

export const eventsQueryValidator = validator('query', (value, c) => {
  const result = eventsQuerySchema.safeParse(value);
  if (!result.success) {
    return invalidSchemaResponse(c, "response", result.error, 400);
  }

  return result.data;
});
