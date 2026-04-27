import { Hono } from 'hono';
import { eventsQueryValidator } from '../validators/eventsValidators.ts';

const events = new Hono();

events.get(
  '/',
  eventsQueryValidator,
  (c) => {
    const { page } = c.req.valid('query');

    return c.json({});
  }
);

export default events;
