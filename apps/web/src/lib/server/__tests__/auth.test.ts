// apps/web/src/lib/server/__tests__/auth.test.ts
import { describe, it, expect } from 'vitest';
import * as jose from 'jose';

// The auth logic we're extracting from hooks.server.ts
async function verifyPayloadToken(
  token: string | undefined,
  secret: string
): Promise<{ userId: string } | null> {
  if (!token) return null;
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, secretKey);
    if (typeof payload['id'] !== 'string') return null;
    return { userId: payload['id'] };
  } catch {
    return null;
  }
}

describe('verifyPayloadToken()', () => {
  const secret = 'test-secret';

  it('returns null for missing token', async () => {
    expect(await verifyPayloadToken(undefined, secret)).toBeNull();
  });

  it('returns null for invalid token', async () => {
    expect(await verifyPayloadToken('not-a-jwt', secret)).toBeNull();
  });

  it('returns null for expired token', async () => {
    const secretKey = new TextEncoder().encode(secret);
    const token = await new jose.SignJWT({ id: 'user-123' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1s')
      .sign(secretKey);
    await new Promise((r) => setTimeout(r, 1100));
    expect(await verifyPayloadToken(token, secret)).toBeNull();
  });

  it('returns userId for valid token', async () => {
    const secretKey = new TextEncoder().encode(secret);
    const token = await new jose.SignJWT({ id: 'user-456' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secretKey);
    expect(await verifyPayloadToken(token, secret)).toEqual({ userId: 'user-456' });
  });
});
