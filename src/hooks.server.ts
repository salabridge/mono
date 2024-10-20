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

  // validate the session
	const { session, user } = await auth.validateSession(sessionId);

	let sessionCookie: Cookie | null = null;
  // if there is a session, and a fresh cookie, create a new session cookie
	if (session && session.fresh) {
		sessionCookie = auth.createSessionCookie(session.id);
	}
  // otherwise, create a blank session
	if (!session) {
		sessionCookie = auth.createBlankSessionCookie();
	}

  // If we have a session cookie, set the name and value.
	if (sessionCookie)
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

  // add these onto the locals for usage later.
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
