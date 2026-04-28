import type z from "zod";
import type { idempotencyCreateSchema, idempotencyResponseSchema } from "@repo/shared/schemas/idempotency";

export type TIdempotencyCreateSchema = z.infer<typeof idempotencyCreateSchema>;
export type TIdempotencyResponseSchema = z.infer<typeof idempotencyResponseSchema>;
