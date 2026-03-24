// packages/cms/src/__tests__/getPayload.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the payload module's getPayload function
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: vi.fn(),
    findByID: vi.fn(),
    login: vi.fn(),
  }),
}));

// Also mock the config import to avoid needing a real DB
vi.mock('../payload.config.js', () => ({
  default: {},
}));

describe('getPayload()', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns the payload instance after initialization', async () => {
    const { getPayload } = await import('../lib/getPayload.js');
    const payload = await getPayload();
    expect(payload).toBeDefined();
  });

  it('returns the same instance on subsequent calls (memoized)', async () => {
    const { getPayload } = await import('../lib/getPayload.js');
    const first = await getPayload();
    const second = await getPayload();
    expect(first).toBe(second);
  });

  it('handles concurrent calls without double-initializing', async () => {
    const { getPayload } = await import('../lib/getPayload.js');
    const results = await Promise.all([getPayload(), getPayload(), getPayload()]);
    // All concurrent calls should resolve to the same memoized instance
    expect(results[0]).toBe(results[1]);
    expect(results[1]).toBe(results[2]);
  });
});
