import z from "zod";
import type { ObjectId } from "bson";
import { bookingResponseSchema } from "./booking.ts";

export const idempotencyCreateSchema = z.object({
  key: z.string().min(1),
  response: bookingResponseSchema.or(z.null()),
  statusCode: z.number().int().min(100).max(599),
});

export const idempotencyResponseSchema = idempotencyCreateSchema.extend({
  _id: z.custom<ObjectId>(),
});
