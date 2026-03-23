// apps/web/src/app.d.ts
// User type comes from Payload's generated types (built from packages/cms).
// Run `pnpm --filter @salabridge/cms build` first if this import errors.

declare global {
  namespace App {
    interface Locals {
      user: import('@salabridge/cms/payload-types').User | null;
    }
  }
}

export {};
