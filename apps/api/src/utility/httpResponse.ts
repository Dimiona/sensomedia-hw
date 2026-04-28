import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import z from "zod";
import type { $ZodError } from "zod/v4/core";

export function successResponse<C extends Context>(c: C, responseData: any, statusCode: ContentfulStatusCode | undefined = 200) {
  return c.json(responseData, statusCode);
};

export function errorResponse<C extends Context>(c: C, errors: string | string[], statusCode: ContentfulStatusCode | undefined = 500) {
  return c.json({ error: Array.isArray(errors) ? errors.join("\n") : errors }, statusCode);
};

export function badRequestResponse<C extends Context>(c: C, errors: string | string[]) {
  return c.json({ error: Array.isArray(errors) ? errors.join("\n") : errors }, 400);
};

export function invalidSchemaResponse<C extends Context, E extends $ZodError<unknown>>(c: C, schemaName: string, errors: E, statusCode: ContentfulStatusCode | undefined = 400) {
  return c.json({ error: `Invalid ${schemaName} schema: ${z.treeifyError(errors).errors.join('\n')}` }, statusCode);
};
