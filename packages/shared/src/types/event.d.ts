import type z from "zod";
import { eventCreateSchema, eventResponseSchema, eventsResponseSchema } from "@repo/shared/schemas/event";

export type TEventCreateSchema = z.infer<typeof eventCreateSchema>;
export type TEventResponseSchema = z.infer<typeof eventResponseSchema>;
export type TEventsResponseSchema = z.infer<typeof eventsResponseSchema>;
