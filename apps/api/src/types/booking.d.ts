import type z from "zod";
import type { bookingCreateSchema, bookingResponseSchema } from "@repo/shared/schemas/booking";

export type TBookingCreateSchema = z.infer<typeof bookingCreateSchema>;
export type TBookingResponseSchema = z.infer<typeof bookingResponseSchema>;
