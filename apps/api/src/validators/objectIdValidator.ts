import { objectIdSchema } from "@repo/shared/schemas/scaffolding";
import { validator } from "hono/validator";
import z from "zod";
import { invalidSchemaResponse } from "../utility/httpResponse.ts";

const paramsWithIdSchema = z.object({
  id: objectIdSchema,
});

export const objectIdValidator = validator('param', (value, c) => {
  const result = paramsWithIdSchema.safeParse(value);
  if (!result.success) {
    return invalidSchemaResponse(c, "response", result.error, 400);
  }

  return result.data;
});
