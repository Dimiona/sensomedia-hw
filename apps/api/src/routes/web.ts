import dotenv from "dotenv";
import path from "path";
import { Hono } from "hono";
import { cors } from "hono/cors";
import event from "../controllers/event.ts";
import events from "../controllers/events.ts";
import booking from "../controllers/booking.ts";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: process.env.APP_URL ?? "http://localhost:3000",
    allowHeaders: [ "Content-Type", "Idempotency-Key" ],
    allowMethods: [ "POST", "GET", "PUT", "DELETE", "OPTIONS" ],
  })
);

app.route("/event", event);
app.route("/events", events);
app.route("/booking", booking);

export default app;
