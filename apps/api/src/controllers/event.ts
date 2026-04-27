import { Hono } from "hono";
import eventService from "../services/events.ts"
import { eventCreateSchema, eventResponseSchema } from "@repo/shared/schemas/event";
import { ObjectId } from "mongodb";
import z from "zod";
import { objectIdValidator } from "../validators/objectIdValidator.ts";

const event = new Hono();

event.post(
  '/',
  async (c) => {
    const body = await c.req.json();

    const parsedEvent = eventCreateSchema.safeParse(body);
    if (!parsedEvent.success) {
      return c.json({ error: `Invalid event schema: ${z.treeifyError(parsedEvent.error).errors.join('\n')}` }, 500);
    }

    const event = await eventService.createEvent(parsedEvent.data);

    const parsedResponse = eventResponseSchema.safeParse(event);
    if (!parsedResponse.success) {
      return c.json({ error: `Invalid response schema: ${z.treeifyError(parsedResponse.error).errors.join('\n')}` }, 500);
    }

    return c.json(parsedResponse.data);
  }
);

event.get(
  '/:id',
  objectIdValidator,
  async (c) => {
    const { id } = c.req.valid('param');

    const event = await eventService.getEvent(new ObjectId(id));

    const parsedResponse = eventResponseSchema.safeParse(event);
    if (!parsedResponse.success) {
      return c.json({ error: `Invalid response schema: ${z.treeifyError(parsedResponse.error).errors.join('\n')}` }, 500);
    }

    return c.json(parsedResponse.data);
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
      return c.json({ error: `Invalid event schema: ${z.treeifyError(parsedEvent.error).errors.join('\n')}` }, 500);
    }

    const event = await eventService.updateEvent(new ObjectId(id), parsedEvent.data);

    const parsedResponse = eventResponseSchema.safeParse(event);
    if (!parsedResponse.success) {
      return c.json({ error: `Invalid response schema: ${z.treeifyError(parsedResponse.error).errors.join('\n')}` }, 500);
    }

    return c.json(parsedResponse.data);
  }
);

event.delete(
  '/:id',
  objectIdValidator,
  async (c) => {
    const { id } = c.req.valid('param');

    const { data, error } = await eventService.deleteEvent(new ObjectId(id));
    if (error) {
      return c.json({ error: error.message }, 500);
    }

    const parsedResponse = eventResponseSchema.safeParse(data);
    if (!parsedResponse.success) {
      return c.json({ error: `Invalid response schema: ${z.treeifyError(parsedResponse.error).errors.join('\n')}` }, 500);
    }

    return c.json(parsedResponse.data);
  }
);

export default event;
