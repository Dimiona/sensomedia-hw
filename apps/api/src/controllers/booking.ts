import { Hono } from "hono";
import { bookingCreateSchema, bookingResponseSchema } from "@repo/shared/schemas/booking";
import bookingService from "../services/booking.ts";
import eventService from "../services/events.ts";
import idempotencyService from "../services/idempotency.ts";
import { errorResponse, invalidSchemaResponse, successResponse } from "../utility/httpResponse.ts";
import { idempotencyValidator } from "../validators/idempotencyValidator.ts";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ObjectId } from "mongodb";

const booking = new Hono();

booking.post(
  '/',
  idempotencyValidator,
  async (c) => {
    const { idempotencyKey } = c.req.valid('header');

    const existing = await idempotencyService.getIdempotency(idempotencyKey);
    if (existing.data) {
      return successResponse(c, existing.data.response, existing.data!.statusCode as ContentfulStatusCode);
    }

    const body = await c.req.json();

    const parsedBooking = bookingCreateSchema.safeParse(body);
    if (!parsedBooking.success) {
      return invalidSchemaResponse(c, 'booking', parsedBooking.error);
    }

    const event = await eventService.getEvent(new ObjectId(parsedBooking.data.eventId.toString()));
    if (!event.data && !event.error) {
      await idempotencyService.createIdempotency({
        key: idempotencyKey,
        response: null,
        statusCode: 404,
      });

      return successResponse(c, null, 404);
    }

    const booking = await bookingService.createBooking(parsedBooking.data, event.data!.capacity);
    if (booking.error) {
      return errorResponse(c, booking.error.message, 400);
    }

    const parsedResponse = bookingResponseSchema.safeParse(booking.data);
    if (!parsedResponse.success) {
      return invalidSchemaResponse(c, 'response', parsedResponse.error, 500);
    }

    await idempotencyService.createIdempotency({
      key: idempotencyKey,
      response: parsedResponse.data,
      statusCode: 200,
    });

    return successResponse(c, parsedResponse.data);
  }
);

export default booking;
