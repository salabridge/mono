import Pg from 'pg';
import { DB_URL } from '$env/static/private';
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '$lib/server/db/schema';

export const client = new Pg.Client({
  connectionString: DB_URL
});

export const pool = new Pg.Pool({
  connectionString: DB_URL,
})

await client.connect();
await pool.connect();

export const db = drizzle(client, { schema, logger: true });
