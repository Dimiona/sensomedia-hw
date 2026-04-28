import { Db, MongoClient } from "mongodb";
import z from "zod";

export type TDatabaseConnectionInfo = {
  host: string,
  port: number,
  databaseName: string,
  username?: string,
  password?: string,
};

let client: MongoClient | null = null;
let db: Db | null = null;

const MongoDBConnectionSchema = z.object({
  host: z.string().min(1).default('localhost'),
  port: z.number().int().default(27017),
  databaseName: z.string().min(1),
  username: z.string().optional(),
  password: z.string().optional(),
});

const connectToMongoDB = async (connectionInfo: TDatabaseConnectionInfo) => {
  const result = MongoDBConnectionSchema.safeParse(connectionInfo);
  if (!result.success) {
    throw new Error("An invalid connection info was trying to passed to MongoClient.");
  }

  let credentials: string = '';
  if (
    typeof result.data.username === 'string'
    && result.data.username.length > 0
    && typeof result.data.password === 'string'
    && result.data.password.length > 0
  ) {
    credentials = `${result.data.username}:${result.data.password}@`;
  }

  const url = `mongodb://${credentials}${result.data.host}:${result.data.port}`;
  client = new MongoClient(url);

  await client.connect();

  console.log(`Successfully connected to MongoDB server${(process.env.NODE_ENV !== 'production' ? ` via [${url}]` : '')}.`);

  db = client.db(result.data.databaseName);
};

const disconnectMongoDB = async () => {
  if (client === null) {
    return;
  }

  await client.close();
};

const getClient = () => {
  if (!(client instanceof MongoClient)) {
    throw new Error("There is no MongoClient yet. Try connect first.");
  }

  return client;
};

const getDatabase = () => {
  if (!(db instanceof Db)) {
    throw new Error("There is no active database connection yet. Try connect first.");
  }

  return db;
};

export {
  connectToMongoDB,
  disconnectMongoDB,
  getClient,
  getDatabase,
};
