import { auth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { Cookie } from 'lucia';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(auth.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSession(sessionId);
	let sessionCookie: Cookie | null = null;
	if (session && session.fresh) {
		sessionCookie = auth.createSessionCookie(session.id);
	}
	if (!session) {
		sessionCookie = auth.createBlankSessionCookie();
	}

	if (sessionCookie)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
