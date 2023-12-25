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
    type DatabaseUserAttributes = {
      username: string;
      raw_user_metadata: Record<string, unknown>;
    };
  }
}

export {};
