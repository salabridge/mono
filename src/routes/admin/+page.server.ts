import { db } from '$lib/server/db/client.js';
import { recipes } from '$lib/server/db/schema/recipes.table.js';
import { redirect } from '@sveltejs/kit';
import { asc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) redirect(302, '/login');

  return {
    session,
    recipes: db.select().from(recipes).orderBy(asc(recipes.title)),
  };
};
