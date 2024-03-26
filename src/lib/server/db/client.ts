import Pg from 'pg';
import { dev } from '$app/environment';
import { DB_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '$lib/server/db/schema';

export const pool = new Pg.Pool({
	connectionString: `${DB_URL}${dev ? '' : '?sslmode=require'}`
});

await pool.connect();

export const db = drizzle(pool, { schema, logger: true });
