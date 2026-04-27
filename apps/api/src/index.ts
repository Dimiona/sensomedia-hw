import { serve } from '@hono/node-server';
import dotenv from "dotenv";
import path from "path";

import app from './routes/web.ts';
import { connectToMongoDB, disconnectMongoDB } from './services/database.ts';

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

process.on('unhandledRejection', (reason) => {
  // Must handled in PRODUCTION!
  console.error('An unhandled rejection was caught.', reason);
});

process.on('uncaughtException', (err) => {
  // Must handled in PRODUCTION!
  console.error('An uncaught exception was caught.', err);
});

process.on('SIGTERM', async (err) => {
  console.info('A SIGTERM signal is received.. Trying to gracefully shutdown the active MongoDB connection.');
  await disconnectMongoDB();
});

try {
  await connectToMongoDB({
    host: process.env.MONGO_HOST ?? 'localhost',
    port: (process.env.MONGO_PORT_HOST ? parseInt(process.env.MONGO_PORT_HOST) : null) ?? 27017,
    databaseName: process.env.MONGO_INITDB_DATABASE ?? 'db',
    username: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
  });
}
catch (e) {
  console.error('Failed to connect to MongoDB. Please review the corresponding .env file for its correctness.');
  process.exit(1);
}

serve({
  fetch: app.fetch,
  port: 3090
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
