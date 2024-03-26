import { dev } from '$app/environment';
import { pg } from '@lucia-auth/adapter-postgresql';
import { lucia } from 'lucia';
import { google } from '@lucia-auth/oauth/providers';
import { sveltekit } from 'lucia/middleware';
import { pool } from './db/client';
import { GAUTH_CLIENT_ID, GAUTH_SECRET } from '$env/static/private';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: pg(pool, {
		user: `"auth"."users"`,
		key: `"auth"."key"`,
		session: `"auth"."sessions"`
	}),
	getUserAttributes: (data) => {
		return {
			username: data.username,
			metadata: data.raw_user_metadata
		};
	}
});

export const googleAuth = google(
  auth, {
    clientId: GAUTH_CLIENT_ID,
    clientSecret: GAUTH_SECRET,
    redirectUri: 'http://localhost:5173/auth/callback/google',
    scope: ['email']
  }
);

export type Auth = typeof auth;
