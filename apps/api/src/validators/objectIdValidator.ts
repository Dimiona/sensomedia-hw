import { objectIdSchema } from "@repo/shared/schemas/scaffolding";
import { validator } from "hono/validator";
import z from "zod";

const paramsWithIdSchema = z.object({
  id: objectIdSchema,
});

export const objectIdValidator = validator('param', (value, c) => {
  const result = paramsWithIdSchema.safeParse(value);
  if (!result.success) {
    return c.json({ error: `Invalid response schema: ${z.treeifyError(result.error).errors.join('\n')}` }, 400);
  }

  return result.data;
});
