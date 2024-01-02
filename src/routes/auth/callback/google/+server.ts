import { auth, googleAuth } from '$lib/server/auth';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { VALID_EMAILS } from '$env/static/private';

const validEmails = new Set(VALID_EMAILS.split(','));

export const GET = async ({ cookies, url, locals, fetch }) => {
  const storedState = cookies.get('google_oauth_state');
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400
    });
  }


  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);

    if(!googleUser.email || !validEmails.has(googleUser.email)) {
      throw new Error('Invalid user');
    }

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      
      const user = await createUser({
        attributes: {
          username: googleUser.email || '',
          raw_user_metadata: {
            avatar_url: googleUser.picture,
          }
        }
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    });
    locals.auth.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
}