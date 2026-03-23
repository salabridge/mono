// apps/web/src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { getPayload } from '@salabridge/cms';
import type { Actions } from './$types';

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      return fail(400, { message: 'Email and password are required.' });
    }

    try {
      const cms = await getPayload();
      const result = await cms.login({
        collection: 'users',
        data: { email, password },
      });

      const token = result.token;
      if (!token) return fail(401, { message: 'Invalid credentials.' });

      cookies.set('payload-token', token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } catch {
      return fail(401, { message: 'Invalid email or password.' });
    }

    redirect(302, '/');
  },
};
