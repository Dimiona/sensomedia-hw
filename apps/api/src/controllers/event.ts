import { Hono } from "hono";
import eventService from "../services/events.ts"
import { eventCreateSchema, eventResponseSchema } from "@repo/shared/schemas/event";
import { ObjectId } from "mongodb";
import { objectIdValidator } from "../validators/objectIdValidator.ts";
import { errorResponse, invalidSchemaResponse, successResponse } from "../utility/httpResponse.ts";

const event = new Hono();

event.post(
  '/',
  async (c) => {
    const body = await c.req.json();

    const parsedEvent = eventCreateSchema.safeParse(body);
    if (!parsedEvent.success) {
      return invalidSchemaResponse(c, "event", parsedEvent.error, 500);
    }

    const event = await eventService.createEvent(parsedEvent.data);

    const parsedResponse = eventResponseSchema.safeParse(event.data);
    if (!parsedResponse.success) {
      return invalidSchemaResponse(c, "response", parsedResponse.error);
    }

    return successResponse(c, parsedResponse.data);
  }
);

event.get(
  '/:id',
  objectIdValidator,
  async (c) => {
    const { id } = c.req.valid('param');

    const event = await eventService.getEvent(new ObjectId(id));

    const parsedResponse = eventResponseSchema.safeParse(event.data);
    if (!parsedResponse.success) {
      return invalidSchemaResponse(c, "response", parsedResponse.error);
    }

    return successResponse(c, parsedResponse.data);
  }
);

event.put(
  '/:id',
  objectIdValidator,
  async (c) => {
    const { id } = c.req.valid('param');

    const body = await c.req.json();
    const parsedEvent = eventCreateSchema.safeParse(body);
    if (!parsedEvent.success) {
      return invalidSchemaResponse(c, "event", parsedEvent.error);
    }

    const event = await eventService.updateEvent(new ObjectId(id), parsedEvent.data);

    const parsedResponse = eventResponseSchema.safeParse(event.data);
    if (!parsedResponse.success) {
      return invalidSchemaResponse(c, "response", parsedResponse.error);
    }

    return successResponse(c, parsedResponse.data);
  }
);

event.delete(
  '/:id',
  objectIdValidator,
  async (c) => {
    const { id } = c.req.valid('param');

    const { data, error } = await eventService.deleteEvent(new ObjectId(id));
    if (error) {
      return errorResponse(c, error.message, 500);
    }

    const parsedResponse = eventResponseSchema.safeParse(data);
    if (!parsedResponse.success) {
      return invalidSchemaResponse(c, "response", parsedResponse.error);
    }

    return successResponse(c, parsedResponse.data);
  }
);

export default event;
