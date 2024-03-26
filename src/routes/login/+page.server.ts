import { auth } from '$lib/server/auth.js';
import { validateFormData } from '@jhecht/arktype-utils';
import { error } from '@sveltejs/kit';
import { type } from 'arktype';

// export const actions = {
// 	login: async ({ request, locals }) => {
// 		const formData = validateFormData(
// 			await request.formData(),
// 			type({
// 				username: 'string>=2',
// 				password: 'string>=2'
// 			})
// 		);

// 		try {
// 			// Get the key
// 			const key = await auth.useKey('username', formData.username.toLowerCase(), formData.password);
// 			// Invalidate the other user sessions cause fuck-em
// 			await auth.invalidateAllUserSessions(key.userId);

// 			// Create new session
// 			const session = await auth.createSession({
// 				userId: key.userId,
// 				attributes: {}
// 			});

// 			locals.auth.setSession(session);

// 			// Return the session to the user.
// 			return {
// 				session
// 			};
// 		} catch (e) {
// 			console.error(e);
// 			if (e instanceof LuciaError) error(400, e.message);
// 			error(400);
// 		}
// 	}
// };
