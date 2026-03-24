// packages/cms/src/lib/getPayload.ts
import { getPayload as payloadGetPayload } from 'payload';
import config from '../payload.config.js';

// Memoize the Promise so concurrent cold-start invocations
// await the same initialization (prevents duplicate DB connections).
let payloadPromise: ReturnType<typeof payloadGetPayload> | null = null;

export async function getPayload() {
  if (!payloadPromise) {
    payloadPromise = payloadGetPayload({ config });
  }
  return payloadPromise;
}
