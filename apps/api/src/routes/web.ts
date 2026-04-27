import { Hono } from "hono";
import event from "../controllers/event.ts";
import events from "../controllers/events.ts";
import booking from "../controllers/booking.ts";

const app = new Hono();

app.route("/event", event);
app.route("/events", events);
app.route("/booking", booking);

export default app;
