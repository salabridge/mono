// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/auth').Auth;

		type DatabaseUserAttributes = {
			username: string;
			raw_user_metadata: Record<string, unknown>;
		};
		// eslint-disable-next-line @typescript-eslint/ban-types
		type DatabaseSessionAttributes = {};
	}
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof import('$lib/server/auth').auth;
		DatabaseUserAttributes: Lucia.DatabaseUserAttributes;
	}
}

export {};
