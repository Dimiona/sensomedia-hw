import { Hono } from "hono";
import { eventsQueryValidator } from "../validators/eventsValidators.ts";
import eventService from "../services/events.ts"
import { eventsResponseSchema } from "@repo/shared/schemas/events";
import { invalidSchemaResponse, successResponse } from "../utility/httpResponse.ts";

const events = new Hono();

events.get(
  '/',
  eventsQueryValidator,
  async (c) => {
    const { page, perpage } = c.req.valid('query');

    const { data } = await eventService.list(page, perpage);

    const paginatedResponse = {
      metadata: {
        page,
        perpage: perpage,
      },
      items: data,
    };

    const parsedResponse = eventsResponseSchema.safeParse(paginatedResponse);
    if (!parsedResponse.success) {
      return invalidSchemaResponse(c, 'response', parsedResponse.error, 500);
    }

    return successResponse(c, parsedResponse.data);
  }
);

export default events;
