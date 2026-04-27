import z from "zod";
import type { ObjectId } from "bson";

export const eventCreateSchema = z.strictObject({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.date(),
  capacity: z.number().int().min(1),
});

export const eventResponseSchema = eventCreateSchema.extend({
  _id: z.custom<ObjectId>(),
});
