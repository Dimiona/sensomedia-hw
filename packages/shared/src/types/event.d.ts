import type z from "zod";
import { eventCreateSchema, eventResponseSchema } from "@repo/shared/schemas/event";

export type TEventCreateSchema = z.infer<typeof eventCreateSchema>;
export type TEventResponseSchema = z.infer<typeof eventResponseSchema>;
