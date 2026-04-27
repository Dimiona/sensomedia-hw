import { ObjectId } from "mongodb";
import { validator } from "hono/validator";
import z from "zod";

export const objectIdSchema = z.string().refine(
  (v) => ObjectId.isValid(v) && new ObjectId(v).toString() === v,
  { message: "Invalid MongoDB ObjectId was as given." }
);

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
