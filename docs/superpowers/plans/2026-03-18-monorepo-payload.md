# Monorepo + Payload CMS Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Salabridge SvelteKit app into a Turborepo + pnpm workspaces monorepo with Payload CMS as a standalone content/auth backend consumed via the Local API.

**Architecture:** The monorepo has four packages: `apps/web` (SvelteKit, Vercel), `apps/cms-server` (Express + Payload, persistent Node host), `packages/cms` (Payload config + Local API exports), `packages/ui` (shared Svelte components). `packages/cms` is the only place Payload collections are defined. Both apps import from it; `apps/web` uses the Local API (no HTTP), `apps/cms-server` also binds Payload to Express to serve the Admin UI.

**Tech Stack:** pnpm workspaces, Turborepo, Payload CMS v2, `@payloadcms/db-postgres`, Express, SvelteKit, `jose` (JWT verification), Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-03-18-monorepo-payload-design.md`

---

## File Map

### Created
| Path | Responsibility |
|------|---------------|
| `pnpm-workspace.yaml` | Declares workspace members |
| `turbo.json` | Build pipeline |
| `packages/cms/package.json` | `@salabridge/cms` package |
| `packages/cms/tsconfig.json` | TS config for cms package |
| `packages/cms/src/collections/Users.ts` | Users collection config |
| `packages/cms/src/collections/Ingredients.ts` | Ingredients collection config |
| `packages/cms/src/collections/Tags.ts` | Tags collection config |
| `packages/cms/src/collections/Media.ts` | Media upload collection config |
| `packages/cms/src/collections/Recipes.ts` | Recipes collection config |
| `packages/cms/src/collections/index.ts` | Re-exports all collections |
| `packages/cms/src/payload.config.ts` | Payload configuration |
| `packages/cms/src/lib/getPayload.ts` | Memoized Local API initializer |
| `packages/cms/src/index.ts` | Public package exports |
| `packages/cms/src/__tests__/getPayload.test.ts` | Unit tests for getPayload() |
| `packages/ui/package.json` | `@salabridge/ui` package |
| `packages/ui/src/index.ts` | Barrel export for all components |
| `apps/cms-server/package.json` | `@salabridge/cms-server` package |
| `apps/cms-server/tsconfig.json` | TS config |
| `apps/cms-server/src/server.ts` | Express + Payload server entry |
| `apps/cms-server/.env.example` | Required env vars |
| `apps/web/.env.example` | Required env vars for SvelteKit |

### Moved (git mv)
| From | To |
|------|----|
| `src/` | `apps/web/src/` |
| `static/` | `apps/web/static/` |
| `tests/` | `apps/web/tests/` |
| `svelte.config.js` | `apps/web/svelte.config.js` |
| `vite.config.ts` | `apps/web/vite.config.ts` |
| `tsconfig.json` | `apps/web/tsconfig.json` |
| `playwright.config.ts` | `apps/web/playwright.config.ts` |
| `postcss.config.js` | `apps/web/postcss.config.js` |
| `tailwind.config.js` | `apps/web/tailwind.config.js` |
| `src/lib/components/*` | `packages/ui/src/components/*` |

### Modified
| Path | Change |
|------|--------|
| `package.json` | Become workspace root: remove all app deps, add `turbo` devDep, update scripts |
| `apps/web/package.json` | New package.json: add `@salabridge/cms`, `@salabridge/ui`, remove Lucia/Drizzle |
| `apps/web/src/app.d.ts` | Replace Lucia types with Payload `User` type |
| `apps/web/src/hooks.server.ts` | Replace Lucia session check with Payload JWT verification |
| `apps/web/src/routes/login/+page.server.ts` | Implement Payload login action |
| `apps/web/src/routes/login/+page.svelte` | Change `username` field to `email` |
| `apps/web/src/routes/logout/+page.server.ts` | Replace Lucia logout with cookie delete |
| `apps/web/src/routes/admin/+page.server.ts` | Add `role` check (`admin` only) |
| `apps/web/src/routes/recipes/+page.svelte` | Replace hardcoded data with Payload query |
| `apps/web/vite.config.ts` | Add `ssr.noExternal: ['@salabridge/ui']` |
| `apps/web/tests/test.ts` | Replace stale SvelteKit placeholder test |
| `apps/web/playwright.config.ts` | Update `webServer` command for monorepo |
| `docker-compose.yml` | Move to repo root (already there, no change needed) |

### Deleted
| Path | Reason |
|------|--------|
| `src/lib/server/auth.ts` | Lucia auth — replaced by Payload |
| `src/lib/server/db/` | Entire Drizzle schema — replaced by Payload |
| `src/routes/login/google/` | Google OAuth — deferred |
| `drizzle.config.ts` | Drizzle config — replaced by Payload migrations |
| `packages/db/` | Old empty stub |

---

## Task 1: Monorepo Scaffolding

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Modify: `package.json`

- [ ] **Step 1: Create `pnpm-workspace.yaml`**

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Step 2: Create `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".svelte-kit/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "check": {
      "dependsOn": ["^build"]
    }
  }
}
```

- [ ] **Step 3: Update root `package.json`**

Replace the current root `package.json` with a workspace root (scripts only — no application deps):

```json
{
  "name": "salabridge",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "check": "turbo check"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

- [ ] **Step 4: Install turbo at root**

```bash
pnpm install
```

Expected: `node_modules/.bin/turbo` exists.

- [ ] **Step 5: Commit**

```bash
git add pnpm-workspace.yaml turbo.json package.json pnpm-lock.yaml
git commit -m "chore: add monorepo scaffolding (turbo + pnpm workspaces)"
```

---

## Task 2: Move SvelteKit App to `apps/web`

**Files:**
- Create dir: `apps/web/`
- git mv: all app source files (see File Map above)

- [ ] **Step 1: Create `apps/web` directory and move source**

```bash
mkdir -p apps/web
git mv src apps/web/src
git mv static apps/web/static
git mv tests apps/web/tests
git mv svelte.config.js apps/web/svelte.config.js
git mv vite.config.ts apps/web/vite.config.ts
git mv tsconfig.json apps/web/tsconfig.json
git mv playwright.config.ts apps/web/playwright.config.ts
git mv postcss.config.js apps/web/postcss.config.js
git mv tailwind.config.js apps/web/tailwind.config.js
```

- [ ] **Step 2: Delete files that don't belong in `apps/web`**

```bash
git rm drizzle.config.ts
```

- [ ] **Step 3: Create `apps/web/package.json`**

Copy the app-level dependencies from the old root `package.json`. Keep everything except `drizzle-kit`, `drizzle-orm`, `pg`, `@types/pg`, `lucia`, `arctic`, `@lucia-auth/*`, `oslo`, `dotenv`. Keep `jose`.

```json
{
  "name": "@salabridge/web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "test:integration": "playwright test",
    "test:unit": "vitest"
  },
  "devDependencies": {
    "@playwright/test": "^1.28.1",
    "@sveltejs/adapter-vercel": "^4.0.3",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.28.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-svelte": "^2.30.0",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "prettier-plugin-svelte": "^3.1.2",
    "svelte": "^5.0.0-next.1",
    "svelte-check": "^3.6.0",
    "tailwindcss": "^3.4.0",
    "tslib": "^2.4.1",
    "typescript": "^5.0.0",
    "vite": "^5.0.3",
    "vitest": "^1.0.0"
  },
  "type": "module",
  "dependencies": {
    "@jhecht/arktype-utils": "^0.1.0",
    "@salabridge/cms": "workspace:*",
    "@salabridge/ui": "workspace:*",
    "arktype": "1.0.28-alpha",
    "class-variance-authority": "^0.7.0",
    "jose": "^5.2.3",
    "lucide-svelte": "^0.302.0"
  }
}
```

- [ ] **Step 4: Update `apps/web/playwright.config.ts` webServer command**

```ts
// apps/web/playwright.config.ts
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm build && pnpm preview',
    port: 4173
  },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
```

- [ ] **Step 5: Install deps in apps/web**

```bash
pnpm install
```

- [ ] **Step 6: Verify type-check still runs (will have errors — expected)**

```bash
cd apps/web && pnpm check 2>&1 | head -30
```

Expected: Errors about missing `lucia` and `$lib/server/auth` — this is expected. We'll fix these in Task 9.

- [ ] **Step 7: Commit**

```bash
git add apps/web package.json pnpm-lock.yaml
git commit -m "chore: move SvelteKit app into apps/web"
```

---

## Task 3: Create `packages/ui`

**Files:**
- Create: `packages/ui/package.json`
- git mv: `apps/web/src/lib/components/*` → `packages/ui/src/components/*`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: Create `packages/ui` structure**

```bash
mkdir -p packages/ui/src/components
```

- [ ] **Step 2: Move components**

```bash
git mv apps/web/src/lib/components/button packages/ui/src/components/button
git mv apps/web/src/lib/components/input packages/ui/src/components/input
git mv apps/web/src/lib/components/toggle packages/ui/src/components/toggle
git mv apps/web/src/lib/components/header packages/ui/src/components/header
git mv apps/web/src/lib/components/navbar.svelte packages/ui/src/components/navbar.svelte
```

- [ ] **Step 3: Create `packages/ui/src/index.ts`**

```ts
// packages/ui/src/index.ts
export { default as Button } from './components/button/button.svelte';
export { default as Input } from './components/input/input.svelte';
export { default as Toggle } from './components/toggle/toggle.svelte';
export { default as Header } from './components/header/header.svelte';
export { default as Navbar } from './components/navbar.svelte';
```

- [ ] **Step 4: Create `packages/ui/package.json`**

```json
{
  "name": "@salabridge/ui",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "svelte": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "main": "./src/index.ts",
  "svelte": "./src/index.ts",
  "scripts": {
    "lint": "eslint ."
  },
  "devDependencies": {
    "svelte": "^5.0.0-next.1",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "svelte": "^4.0.0 || ^5.0.0-next.1"
  }
}
```

- [ ] **Step 5: Update `apps/web/vite.config.ts` to add `ssr.noExternal`**

```ts
// apps/web/vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['@salabridge/ui']
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
```

- [ ] **Step 6: Install packages/ui**

```bash
pnpm install
```

- [ ] **Step 7: Commit**

```bash
git add packages/ui apps/web/src/lib/components apps/web/vite.config.ts pnpm-lock.yaml
git commit -m "feat: extract shared UI components into packages/ui"
```

---

## Task 4: Scaffold `packages/cms`

**Files:**
- Create: `packages/cms/package.json`
- Create: `packages/cms/tsconfig.json`
- Create: `packages/cms/src/index.ts` (stub)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p packages/cms/src/collections packages/cms/src/lib packages/cms/src/__tests__
```

- [ ] **Step 2: Create `packages/cms/package.json`**

```json
{
  "name": "@salabridge/cms",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./payload.config": {
      "import": "./dist/payload.config.js",
      "types": "./dist/payload.config.d.ts"
    }
  },
  "scripts": {
    "build": "payload generate:types && tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "payload": "^2.0.0",
    "@payloadcms/db-postgres": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] **Step 3: Create `packages/cms/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "src/__tests__"]
}
```

- [ ] **Step 4: Create stub `packages/cms/src/index.ts`**

```ts
// packages/cms/src/index.ts
// Exports populated in Tasks 5-7
export {};
```

- [ ] **Step 5: Install packages/cms deps**

```bash
pnpm install
```

- [ ] **Step 6: Commit**

```bash
git add packages/cms pnpm-lock.yaml
git commit -m "chore: scaffold packages/cms"
```

---

## Task 5: Define Payload Collections (Users, Tags, Ingredients, Media)

**Files:**
- Create: `packages/cms/src/collections/Users.ts`
- Create: `packages/cms/src/collections/Tags.ts`
- Create: `packages/cms/src/collections/Ingredients.ts`
- Create: `packages/cms/src/collections/Media.ts`
- Create: `packages/cms/src/collections/index.ts`

- [ ] **Step 1: Create `Users.ts`**

```ts
// packages/cms/src/collections/Users.ts
import type { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
      ],
      defaultValue: 'member',
      required: true,
    },
  ],
};
```

- [ ] **Step 2: Create `Tags.ts`**

```ts
// packages/cms/src/collections/Tags.ts
import type { CollectionConfig } from 'payload/types';

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier, e.g. "chicken"',
      },
    },
  ],
};
```

- [ ] **Step 3: Create `Ingredients.ts`**

```ts
// packages/cms/src/collections/Ingredients.ts
import type { CollectionConfig } from 'payload/types';

export const Ingredients: CollectionConfig = {
  slug: 'ingredients',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'unit',
      type: 'select',
      required: true,
      options: [
        { label: 'Grams (g)', value: 'g' },
        { label: 'Kilograms (kg)', value: 'kg' },
        { label: 'Ounces (oz)', value: 'oz' },
        { label: 'Pounds (lb)', value: 'lb' },
        { label: 'Milliliters (ml)', value: 'ml' },
        { label: 'Liters (l)', value: 'l' },
        { label: 'Teaspoon (tsp)', value: 'tsp' },
        { label: 'Tablespoon (tbsp)', value: 'tbsp' },
        { label: 'Cup', value: 'cup' },
        { label: 'Piece', value: 'piece' },
        { label: 'Pinch', value: 'pinch' },
        { label: 'To taste', value: 'to taste' },
      ],
    },
  ],
};
```

- [ ] **Step 4: Create `Media.ts`**

```ts
// packages/cms/src/collections/Media.ts
import type { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
};
```

- [ ] **Step 5: Create `packages/cms/src/collections/index.ts` (without Recipes — added in Task 6)**

```ts
// packages/cms/src/collections/index.ts
export { Users } from './Users';
export { Tags } from './Tags';
export { Ingredients } from './Ingredients';
export { Media } from './Media';
```

- [ ] **Step 6: Commit**

```bash
git add packages/cms/src/collections
git commit -m "feat: add Users, Tags, Ingredients, Media Payload collections"
```

---

## Task 6: Define Payload Recipes Collection

**Files:**
- Create: `packages/cms/src/collections/Recipes.ts`

- [ ] **Step 1: Create `Recipes.ts`**

```ts
// packages/cms/src/collections/Recipes.ts
import type { CollectionConfig } from 'payload/types';

export const Recipes: CollectionConfig = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-populated from title. URL-friendly, e.g. "chicken-bacon-ranch"',
      },
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'prepTime',
      type: 'number',
      admin: { description: 'Prep time in minutes' },
    },
    {
      name: 'cookTime',
      type: 'number',
      admin: { description: 'Cook time in minutes' },
    },
    {
      name: 'ingredients',
      type: 'array',
      fields: [
        {
          name: 'ingredient',
          type: 'relationship',
          relationTo: 'ingredients',
          required: true,
        },
        {
          name: 'quantity',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "1 lb", "2 cups"' },
        },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        {
          name: 'instruction',
          type: 'richText',
          required: true,
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'stepTime',
          type: 'number',
          admin: { description: 'Time for this step in minutes' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
  ],
};
```

- [ ] **Step 2: Add Recipes export to `packages/cms/src/collections/index.ts`**

```ts
// packages/cms/src/collections/index.ts
export { Users } from './Users';
export { Tags } from './Tags';
export { Ingredients } from './Ingredients';
export { Media } from './Media';
export { Recipes } from './Recipes';
```

- [ ] **Step 3: Commit**

```bash
git add packages/cms/src/collections/Recipes.ts packages/cms/src/collections/index.ts
git commit -m "feat: add Recipes Payload collection"
```

---

## Task 7: Create `payload.config.ts` and `getPayload()` Helper

**Files:**
- Create: `packages/cms/src/payload.config.ts`
- Create: `packages/cms/src/lib/getPayload.ts`
- Create: `packages/cms/src/__tests__/getPayload.test.ts`
- Modify: `packages/cms/src/index.ts`

- [ ] **Step 1: Write the failing test for `getPayload()`**

```ts
// packages/cms/src/__tests__/getPayload.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock payload so we don't need a real DB in unit tests
vi.mock('payload', () => ({
  default: {
    init: vi.fn().mockResolvedValue(undefined),
    find: vi.fn(),
    findByID: vi.fn(),
  },
}));

describe('getPayload()', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns the payload instance after initialization', async () => {
    const { getPayload } = await import('../lib/getPayload');
    const payload = await getPayload();
    expect(payload).toBeDefined();
  });

  it('returns the same instance on subsequent calls (memoized)', async () => {
    const { getPayload } = await import('../lib/getPayload');
    const first = await getPayload();
    const second = await getPayload();
    expect(first).toBe(second);
  });

  it('handles concurrent calls without double-initializing', async () => {
    const payload = await import('payload');
    const { getPayload } = await import('../lib/getPayload');
    await Promise.all([getPayload(), getPayload(), getPayload()]);
    expect(payload.default.init).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
cd packages/cms && pnpm exec vitest run src/__tests__/getPayload.test.ts
```

Expected: FAIL — `getPayload` module not found.

- [ ] **Step 3: Create `packages/cms/src/payload.config.ts`**

```ts
// packages/cms/src/payload.config.ts
import { buildConfig } from 'payload/config';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { Users, Tags, Ingredients, Media, Recipes } from './collections';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  collections: [Users, Tags, Ingredients, Media, Recipes],
  admin: {
    user: Users.slug,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: {
    outputFile: 'dist/payload-types.ts',
  },
});
```

- [ ] **Step 4: Create `packages/cms/src/lib/getPayload.ts`**

```ts
// packages/cms/src/lib/getPayload.ts
import payload from 'payload';
import config from '../payload.config';

// Memoize the Promise (not the resolved value) so concurrent
// cold-start invocations await the same initialization.
let payloadPromise: Promise<typeof payload> | null = null;

export async function getPayload(): Promise<typeof payload> {
  if (!payloadPromise) {
    payloadPromise = payload
      .init({
        // No `express` arg = Local API only (no HTTP server, no port binding).
        // Payload v2: omitting `express` initializes DB connection only.
        config,
        secret: process.env.PAYLOAD_SECRET!,
        local: true,
      })
      .then(() => payload);
  }
  return payloadPromise;
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
cd packages/cms && pnpm exec vitest run src/__tests__/getPayload.test.ts
```

Expected: All 3 tests PASS.

- [ ] **Step 6: Update `packages/cms/src/index.ts`**

```ts
// packages/cms/src/index.ts
export { getPayload } from './lib/getPayload';
export { default as payloadConfig } from './payload.config';
export type { Config } from 'payload/config';
```

Note: Generated types (`User`, `Recipe`, etc.) are in `dist/payload-types.ts` after build — they cannot be exported from `src/index.ts` since `tsconfig.json` excludes `dist/`. Consumers import them directly:
```ts
import type { User } from '@salabridge/cms/payload-types'; // after build
```

Add a `"./payload-types"` entry to `packages/cms/package.json` exports alongside `"."` and `"./payload.config"`:
```json
"./payload-types": {
  "import": "./dist/payload-types.js",
  "types": "./dist/payload-types.d.ts"
}
```

- [ ] **Step 7: Create typed query helpers in `packages/cms/src/lib/queries.ts`**

```ts
// packages/cms/src/lib/queries.ts
import { getPayload } from './getPayload';

export async function getPublishedRecipes() {
  const cms = await getPayload();
  return cms.find({
    collection: 'recipes',
    where: { status: { equals: 'published' } },
    depth: 2, // resolve ingredient and tag relationships
  });
}

export async function getRecipeBySlug(slug: string) {
  const cms = await getPayload();
  const result = await cms.find({
    collection: 'recipes',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  });
  return result.docs[0] ?? null;
}
```

Add to `packages/cms/src/index.ts`:
```ts
export { getPublishedRecipes, getRecipeBySlug } from './lib/queries';
```

- [ ] **Step 8: Build `packages/cms` and verify output**

```bash
cd packages/cms && pnpm build
```

Expected: `dist/` folder created with `index.js`, `index.d.ts`, and `payload-types.ts`.

If `payload generate:types` is not yet available (Payload not connected to DB), run `tsc` only: `pnpm exec tsc`.

- [ ] **Step 9: Commit**

```bash
git add packages/cms/src
git commit -m "feat: add payload.config.ts and getPayload() Local API helper"
```

---

## Task 8: Create `apps/cms-server`

**Files:**
- Create: `apps/cms-server/package.json`
- Create: `apps/cms-server/tsconfig.json`
- Create: `apps/cms-server/src/server.ts`
- Create: `apps/cms-server/.env.example`

- [ ] **Step 1: Create directory**

```bash
mkdir -p apps/cms-server/src
```

- [ ] **Step 2: Create `apps/cms-server/package.json`**

```json
{
  "name": "@salabridge/cms-server",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@salabridge/cms": "workspace:*",
    "express": "^4.18.0",
    "payload": "^2.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 3: Create `apps/cms-server/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 4: Create `apps/cms-server/src/server.ts`**

```ts
// apps/cms-server/src/server.ts
import express from 'express';
import payload from 'payload';
// Import config via the declared exports entry (not a deep path into src/)
import config from '@salabridge/cms/payload.config';

const app = express();

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    config,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    payload.logger.info(`Server listening on port ${port}`);
  });
};

start().catch(console.error);
```

- [ ] **Step 5: Create `apps/cms-server/.env.example`**

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/salabridge
PAYLOAD_SECRET=change-me-in-production
PAYLOAD_CONFIG_PATH=../../packages/cms/dist/payload.config.js
PORT=3000
```

- [ ] **Step 6: Create `apps/web/.env.example`**

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/salabridge
PAYLOAD_SECRET=change-me-in-production
PUBLIC_CMS_URL=http://localhost:3000
```

Note: `PAYLOAD_SECRET` must match the value in `apps/cms-server/.env`.

- [ ] **Step 7: Install apps/cms-server deps**

```bash
pnpm install
```

- [ ] **Step 8: Verify `apps/cms-server` starts (requires Postgres running)**

Start Postgres via docker-compose first:
```bash
docker-compose up -d
```

Then:
```bash
cp apps/cms-server/.env.example apps/cms-server/.env
cd apps/cms-server && pnpm dev
```

Expected: `Payload Admin URL: http://localhost:3000/admin` in logs.

- [ ] **Step 9: Commit**

```bash
git add apps/cms-server pnpm-lock.yaml apps/web/.env.example
git commit -m "feat: add apps/cms-server (Express + Payload CMS)"
```

---

## Task 9: Remove Lucia/Drizzle from `apps/web`

**Files:**
- Delete: `apps/web/src/lib/server/auth.ts`
- Delete: `apps/web/src/lib/server/db/` (entire directory)
- Delete: `apps/web/src/routes/login/google/` (entire directory)
- Modify: `apps/web/src/app.d.ts`
- Modify: `apps/web/src/lib/index.ts`

- [ ] **Step 1: Delete Lucia and Drizzle source files**

```bash
git rm -r apps/web/src/lib/server/auth.ts
git rm -r apps/web/src/lib/server/db/
git rm -r apps/web/src/routes/login/google/
```

- [ ] **Step 2: Replace `apps/web/src/app.d.ts`**

```ts
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
```

- [ ] **Step 3: Run type-check to see what still references deleted code**

```bash
cd apps/web && pnpm check 2>&1 | grep -E "error|Error"
```

Expected: Errors in `hooks.server.ts`, `routes/login/`, `routes/logout/`, and `routes/admin/`. These are fixed in Tasks 10-11.

- [ ] **Step 4: Commit deletions**

```bash
git add apps/web/src/app.d.ts apps/web/src/lib/server apps/web/src/routes/login/google
git commit -m "chore: remove Lucia auth and Drizzle ORM from apps/web"
```

---

## Task 10: Implement Payload Auth in `apps/web`

**Files:**
- Modify: `apps/web/src/hooks.server.ts`
- Create: `apps/web/src/lib/server/__tests__/auth.test.ts`

- [ ] **Step 1: Write the failing test for the auth hook**

```ts
// apps/web/src/lib/server/__tests__/auth.test.ts
import { describe, it, expect, vi } from 'vitest';
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
    if (typeof payload.id !== 'string') return null;
    return { userId: payload.id };
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
    // Wait for expiry
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
```

- [ ] **Step 2: Run tests to validate auth logic**

```bash
cd apps/web && pnpm exec vitest run src/lib/server/__tests__/auth.test.ts
```

These tests define `verifyPayloadToken` inline — they validate the JWT logic before it's wired into `hooks.server.ts`.

Expected: 4 PASS.

- [ ] **Step 3: Replace `apps/web/src/hooks.server.ts`**

```ts
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
```

- [ ] **Step 4: Run type-check on hooks.server.ts**

```bash
cd apps/web && pnpm check 2>&1 | grep -E "hooks"
```

Expected: No errors on `hooks.server.ts`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/hooks.server.ts apps/web/src/lib/server/__tests__
git commit -m "feat: replace Lucia session hook with Payload JWT verification"
```

---

## Task 11: Implement Login and Logout Routes

**Files:**
- Modify: `apps/web/src/routes/login/+page.server.ts`
- Modify: `apps/web/src/routes/login/+page.svelte`
- Modify: `apps/web/src/routes/logout/+page.server.ts`
- Modify: `apps/web/src/routes/admin/+page.server.ts`
- Create: `apps/web/tests/auth.spec.ts`

- [ ] **Step 1: Write the failing Playwright auth tests**

```ts
// apps/web/tests/auth.spec.ts
import { expect, test } from '@playwright/test';

test('unauthenticated user is redirected to /login from /admin', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/login/);
});

test('login form has email and password fields', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});
```

Note: These tests require the app to be running. They will fail at this stage — expected. They will pass after Tasks 11 and 12 are complete.

- [ ] **Step 2: Replace `apps/web/src/routes/login/+page.server.ts`**

```ts
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
      const { token } = await cms.login({
        collection: 'users',
        data: { email, password },
      });

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
```

- [ ] **Step 3: Replace `apps/web/src/routes/login/+page.svelte`**

Update the form to use `email` instead of `username`, and add labels:

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();
</script>

<div class="container mx-auto pt-5 max-w-sm">
  <h1 class="text-2xl font-bold mb-6">Sign in</h1>

  {#if form?.message}
    <p class="text-red-500 mb-4">{form.message}</p>
  {/if}

  <form method="post" action="?/login" use:enhance>
    <div class="flex flex-col gap-1 mb-4">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        class="text-zinc-800 px-2 py-1 rounded border"
        required
      />
    </div>
    <div class="flex flex-col gap-1 mb-6">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        class="text-zinc-800 px-2 py-1 rounded border"
        required
      />
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded w-full">
      Sign in
    </button>
  </form>
</div>
```

- [ ] **Step 4: Replace `apps/web/src/routes/logout/+page.server.ts`**

```ts
// apps/web/src/routes/logout/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies }) => {
    cookies.delete('payload-token', { path: '/' });
    redirect(302, '/login');
  },
};
```

- [ ] **Step 5: Update `apps/web/src/routes/admin/+page.server.ts`**

Add role check:

```ts
// apps/web/src/routes/admin/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
  if (!locals.user) redirect(302, '/login');
  if (locals.user.role !== 'admin') redirect(302, '/');

  return {
    user: locals.user,
  };
};
```

- [ ] **Step 6: Run type-check — verify no remaining auth errors**

```bash
cd apps/web && pnpm check 2>&1 | grep -v "packages/cms" | grep -E "error|Error"
```

Expected: No errors in `routes/login/`, `routes/logout/`, `routes/admin/`, or `hooks.server.ts`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/routes/login apps/web/src/routes/logout apps/web/src/routes/admin apps/web/tests/auth.spec.ts
git commit -m "feat: implement Payload-based login/logout in apps/web"
```

---

## Task 12: Update `apps/web` Component Imports and Recipe Route

**Files:**
- Modify: `apps/web/src/routes/recipes/+page.svelte`
- Modify: all `.svelte` files that import from `$lib/components`
- Modify: `apps/web/tests/test.ts` (update stale Playwright test)

- [ ] **Step 1: Find all component imports to update**

```bash
grep -r "from '\$lib/components" apps/web/src --include="*.svelte" --include="*.ts" -l
```

- [ ] **Step 2: Update each file to import from `@salabridge/ui`**

For each file found, replace:
```ts
import Foo from '$lib/components/foo/foo.svelte';
```
with:
```ts
import { Foo } from '@salabridge/ui';
```

Example — `apps/web/src/routes/recipes/+page.svelte` uses `Header` and `Toggle`:
```svelte
<script lang="ts">
  import { Header, Toggle } from '@salabridge/ui';
  import { BookmarkIcon, CameraOffIcon, CameraIcon } from 'lucide-svelte';
  // ... rest of script
</script>
```

Also update `apps/web/src/routes/+layout.svelte` (imports Navbar) and any other files using components.

- [ ] **Step 3: Update `apps/web/tests/test.ts`**

Replace the stale SvelteKit starter test:

```ts
// apps/web/tests/test.ts
import { expect, test } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
  await expect(page.locator('body')).toBeVisible();
});
```

- [ ] **Step 4: Run type-check**

```bash
cd apps/web && pnpm check
```

Expected: No errors (or only warnings about Payload types not yet generated).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src apps/web/tests/test.ts
git commit -m "feat: update apps/web to import from @salabridge/ui"
```

---

## Task 13: Remove `packages/db` Stub

**Files:**
- Delete: `packages/db/` (entire directory)

- [ ] **Step 1: Remove the old `packages/db` stub**

```bash
git rm -r packages/db
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove packages/db stub (replaced by packages/cms)"
```

---

## Task 14: Database Migration

**Files:** No code changes — operational steps to drop old tables and initialize Payload schema.

- [ ] **Step 1: Ensure Postgres is running**

```bash
docker-compose up -d
```

- [ ] **Step 2: Drop old Drizzle tables (in FK order)**

Connect to the database and run:
```sql
DROP TABLE IF EXISTS public.recipe_ingredients;
DROP TABLE IF EXISTS public.recipes;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.keys;
DROP TABLE IF EXISTS public.ingredients;
DROP TABLE IF EXISTS auth.users;
DROP SCHEMA IF EXISTS auth CASCADE;
```

Using psql:
```bash
psql $DATABASE_URL -c "
  DROP TABLE IF EXISTS public.recipe_ingredients;
  DROP TABLE IF EXISTS public.recipes;
  DROP TABLE IF EXISTS public.tags;
  DROP TABLE IF EXISTS auth.sessions;
  DROP TABLE IF EXISTS auth.keys;
  DROP TABLE IF EXISTS public.ingredients;
  DROP TABLE IF EXISTS auth.users;
  DROP SCHEMA IF EXISTS auth CASCADE;
"
```

- [ ] **Step 3: Run Payload migrations**

```bash
cp apps/cms-server/.env.example apps/cms-server/.env
# Edit .env with real DATABASE_URL and PAYLOAD_SECRET
cd apps/cms-server && pnpm dev
```

On first start, Payload will automatically create its schema. Watch logs for:
```
[info]: Connected to Postgres successfully
[info]: Migrations are up to date
```

- [ ] **Step 4: Seed admin user via Payload Admin UI**

Navigate to `http://localhost:3000/admin`. On first run, Payload prompts to create the first admin user. Create an account with:
- Email: your admin email
- Password: a strong password
- Role: `admin` (set this after initial creation via the Admin UI)

- [ ] **Step 5: Commit .env.example updates if any**

```bash
git add apps/cms-server/.env.example apps/web/.env.example
git commit -m "chore: finalize .env.example files"
```

---

## Task 15: End-to-End Verification

**Files:** No new files — verify everything works together.

- [ ] **Step 1: Build `packages/cms`**

```bash
pnpm --filter @salabridge/cms build
```

Expected: `packages/cms/dist/` contains `index.js`, `index.d.ts`, `payload-types.ts`.

- [ ] **Step 2: Type-check `apps/web`**

```bash
pnpm --filter @salabridge/web check
```

Expected: No TypeScript errors.

- [ ] **Step 3: Run unit tests**

```bash
pnpm --filter @salabridge/cms exec vitest run
pnpm --filter @salabridge/web exec vitest run
```

Expected: All pass.

- [ ] **Step 4: Start all services and run Playwright tests**

In one terminal:
```bash
pnpm dev
```

Wait for both `apps/cms-server` (port 3000) and `apps/web` (port 5173) to be ready.

In another terminal:
```bash
pnpm --filter @salabridge/web exec playwright test
```

Expected: Auth tests pass (redirect to login, login form fields visible, logout clears session).

- [ ] **Step 5: Verify Turborepo build**

```bash
pnpm build
```

Expected: All packages build in correct order (`packages/cms` first, then apps).

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "chore: complete monorepo + Payload CMS migration"
```

---

## Troubleshooting Notes

**`payload.init()` signature in v2:** If `local: true` is not accepted, try omitting it — just passing `config`, `secret`, and `db` without an `express` argument is sufficient for Local API use.

**Generated types not found:** Run `pnpm --filter @salabridge/cms build` before starting `apps/web` dev server. Turborepo handles this automatically for `pnpm dev` and `pnpm build` but not on fresh checkout.

**Concurrent DB connections on Vercel:** If connection pool exhaustion occurs in production, configure `@payloadcms/db-postgres` pool with `max: 1, idleTimeoutMillis: 0` for Vercel serverless.

**Component import errors:** If Svelte can't find `@salabridge/ui` exports, ensure `ssr.noExternal: ['@salabridge/ui']` is in `apps/web/vite.config.ts`.
