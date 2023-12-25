import { dev } from "$app/environment";
import { pg } from '@lucia-auth/adapter-postgresql';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { pool } from './db/client';

export const auth = lucia({
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),
  adapter: pg(pool, {
    user: `"auth"."users"`,
    key: `"auth"."key"`,
    session: `"auth"."sessions"`,
  }),
  getUserAttributes: data => {
    return {
      username: data.username,
      metadata: data.raw_user_metadata,
    }
  }
});
