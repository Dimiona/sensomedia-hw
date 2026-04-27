import { Hono } from "hono";
import { eventsQueryValidator } from "../validators/eventsValidators.ts";
import eventService from "../services/events.ts"
import { eventsResponseSchema } from "@repo/shared/schemas/events";
import z from "zod";

const PER_PAGE: number = 10;

const events = new Hono();

events.get(
  '/',
  eventsQueryValidator,
  async (c) => {
    const { page } = c.req.valid('query');

    const { data } = await eventService.list(page, PER_PAGE);

    const paginatedResponse = {
      metadata: {
        page,
        perpage: PER_PAGE,
      },
      items: data,
    };

    const parsedResponse = eventsResponseSchema.safeParse(paginatedResponse);
    if (!parsedResponse.success) {
      return c.json({ error: `Invalid response schema: ${z.treeifyError(parsedResponse.error).errors.join('\n')}` }, 500);
    }

    return c.json(parsedResponse.data);
  }
);

export default events;
