import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import z from "zod";
import type { $ZodError } from "zod/v4/core";

export function errorResponse<C extends Context>(c: C, errors: string | string[], statusCode: number = 500) {
  return c.json({ error: Array.isArray(errors) ? errors.join("\n") : errors }, 500);
};

export function badRequestResponse<C extends Context>(c: C, errors: string | string[]) {
  return c.json({ error: Array.isArray(errors) ? errors.join("\n") : errors }, 400);
};

export function invalidSchemaResponse<C extends Context, E extends $ZodError<unknown>>(c: C, schemaName: string, errors: E, statusCode: ContentfulStatusCode | undefined = 400) {
  return c.json({ error: `Invalid ${schemaName} schema: ${z.treeifyError(errors).errors.join('\n')}` }, statusCode);
};
