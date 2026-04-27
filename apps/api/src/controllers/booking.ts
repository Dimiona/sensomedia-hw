import { bookingCreateSchema, bookingResponseSchema } from "@repo/shared/schemas/booking";
import { Hono } from "hono";
import bookingService from "../services/booking.ts"
import { invalidSchemaResponse } from "../utility/httpResponse.ts";

const booking = new Hono();

booking.post(
  '/',
  async (c) => {
    const body = await c.req.json();

    const parsedEvent = bookingCreateSchema.safeParse(body);
    if (!parsedEvent.success) {
      return invalidSchemaResponse(c, 'event', parsedEvent.error);
    }

    const event = await bookingService.createBooking(parsedEvent.data);

    const parsedResponse = bookingResponseSchema.safeParse(event);
    if (!parsedResponse.success) {
      return invalidSchemaResponse(c, 'response', parsedResponse.error, 500);
    }

    return c.json(parsedResponse.data);
  }
);

export default booking;
