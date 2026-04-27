import { serve } from '@hono/node-server';
import app from './routes/web.ts';

serve({
  fetch: app.fetch,
  port: 3090
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
