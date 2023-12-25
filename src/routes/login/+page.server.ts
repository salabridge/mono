import { auth } from '$lib/server/auth.js';
import { validateFormData } from '$lib/util/validation.js';
import { type } from 'arktype';

export const actions = {
  login: async ({ request }) => {
    const formData = validateFormData(await request.formData(), type({
      username: 'string>=2',
      password: 'string>=2'
    }));

    const key = await auth.useKey('username', formData.username.toLowerCase(), formData.password);
    await auth.invalidateAllUserSessions(key.userId);

    const session = auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    return {}
  }
};
