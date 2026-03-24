// apps/web/src/routes/logout/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies }) => {
    cookies.delete('payload-token', { path: '/' });
    redirect(302, '/login');
  },
};
