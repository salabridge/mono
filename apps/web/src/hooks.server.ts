// apps/web/src/hooks.server.ts
import { jwtVerify } from 'jose';
import { getPayload } from '@salabridge/cms';
import type { Handle } from '@sveltejs/kit';
import { PAYLOAD_SECRET } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('payload-token');

  if (!token) {
    event.locals.user = null;
    return resolve(event);
  }

  try {
    const secretKey = new TextEncoder().encode(PAYLOAD_SECRET);
    const { payload: jwtPayload } = await jwtVerify(token, secretKey);

    if (typeof jwtPayload['id'] !== 'string') {
      event.locals.user = null;
      return resolve(event);
    }

    const cms = await getPayload();
    const user = await cms.findByID({
      collection: 'users',
      id: jwtPayload['id'],
    });

    event.locals.user = user;
  } catch {
    event.locals.user = null;
  }

  return resolve(event);
};
