// apps/web/src/routes/admin/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (!locals.user) redirect(302, '/login');
  if (locals.user.role !== 'admin') redirect(302, '/');

  return {
    user: locals.user,
  };
};
