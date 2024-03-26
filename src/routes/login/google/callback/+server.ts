import { auth, google } from '$lib/server/auth';
import { db } from '$lib/server/db/client';
import { OAuth2RequestError } from 'arctic';
import { decodeJwt } from 'jose';
import { generateId } from 'lucia';

import { users } from '$lib/server/db/schema';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('code_verifier');
	if (!code || !state || !codeVerifier || !storedState || state !== storedState) {
		console.info('fucky wucky');
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const profileInfo = decodeJwt<{ picture: string; email: string }>(tokens.idToken);
		// Not huge about this
		const existingUser = await db.query.users.findFirst({
			where({ username }, { eq }) {
				return eq(username, profileInfo.email);
			}
		});

		if (existingUser) {
			const session = await auth.createSession(existingUser.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);
			console.info('cookie attributes', sessionCookie.attributes);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				...sessionCookie.attributes,
				path: '/'
			});
		} else {
			const userId = generateId(15);
			await db.insert(users).values({
				id: userId,
				username: profileInfo.email
			});

			const session = await auth.createSession(userId, {});
			const sessionCookie = auth.createSessionCookie(session.id);

			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/admin'
			}
		});
	} catch (e) {
		console.error(e);
		if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	id: string;
	login: string;
}
