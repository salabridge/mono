import { dev } from '$app/environment';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { db } from './db/client';
import { Google, Yahoo } from 'arctic';
import { GAUTH_CLIENT_ID, GAUTH_SECRET } from '$env/static/private';
import { sessions, users } from './db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes(attributes) {
		return {
			username: attributes.username,
			metadata: attributes.raw_user_metadata
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

// Need to generify it
export const google = new Google(
	GAUTH_CLIENT_ID,
	GAUTH_SECRET,
	'http://localhost:5173/login/google/callback'
);
