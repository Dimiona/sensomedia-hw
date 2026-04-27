import z from "zod";
import type { ObjectId } from "bson";

export const bookingCreateSchema = z.strictObject({
  eventId: z.custom<ObjectId>(),
  customerName: z.string().min(1),
  customerEmail: z.email(),
  quantity: z.number().int().min(1),
  status: z.enum([ 'pending', 'confirmed', 'cancelled' ]),
});

export const bookingResponseSchema = bookingCreateSchema.extend({
  _id: z.custom<ObjectId>(),
});
