// See https://kit.svelte.dev/docs/types#app

import type { AuthRequest } from 'lucia';
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: AuthRequest;
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

export {};
