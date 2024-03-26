import { dev } from '$app/environment';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { db } from './db/client';
import { Google, Yahoo } from 'arctic';
import { GAUTH_CLIENT_ID, GAUTH_SECRET, YAHOO_CLIENT_ID, YAHOO_SECRET } from '$env/static/private';
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

export type Auth = typeof auth;

// Need to generify it
export const google = new Google(
	GAUTH_CLIENT_ID,
	GAUTH_SECRET,
	'http://localhost:5173/login/google/callback'
);

// Fuck you
export const yahoo = new Yahoo(
	YAHOO_CLIENT_ID,
	YAHOO_SECRET,
	'http://localhost:5173/login/yahoo/callback'
);
