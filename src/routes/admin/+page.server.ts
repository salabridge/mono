import { db } from '$lib/server/db/client.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  const session = await locals.auth.validate();
  if(!session) redirect(302, '/login');

  const bob = await db.query.users.findFirst({
    with: {
      recipes: true
    }
  });
  return {
    session,
  };
};