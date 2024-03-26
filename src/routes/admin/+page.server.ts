import { redirect } from '@sveltejs/kit';
import { asc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');

	return {
		user: locals.user
	};
};
