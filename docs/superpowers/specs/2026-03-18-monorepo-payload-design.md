# Monorepo + Payload CMS Migration Design

**Date:** 2026-03-18
**Project:** Salabridge Family Recipes
**Status:** Approved

## Overview

Convert the existing single SvelteKit app into a Turborepo + pnpm workspaces monorepo. Add Payload CMS as a standalone Node/Express app that owns all content and authentication. The SvelteKit frontend consumes Payload exclusively via the Local API through a shared `packages/cms` package.

## Monorepo Structure

```
salabridge/
├── pnpm-workspace.yaml
├── turbo.json
├── package.json                ← root (scripts only, no deps)
│
├── apps/
│   ├── web/                    ← SvelteKit frontend (@salabridge/web)
│   │   └── src/...
│   │
│   └── cms/                    ← Payload + Express server (@salabridge/cms-server)
│       └── src/
│           └── server.ts
│
└── packages/
    ├── cms/                    ← Payload config + Local API (@salabridge/cms)
    │   └── src/
    │       ├── payload.config.ts
    │       ├── collections/
    │       └── index.ts
    │
    └── ui/                     ← Shared Svelte components (@salabridge/ui)
        └── src/
            └── components/
```

The existing `packages/db` stub is removed. All current SvelteKit source moves into `apps/web`.

## Package Responsibilities

### `packages/cms` (@salabridge/cms)

The authoritative Payload configuration package. Exports:
- `getPayload()` — memoized singleton returning the Payload Local API instance
- All collection config objects (consumed by `apps/cms` at boot)
- Generated TypeScript types: `Recipe`, `Ingredient`, `Tag`, `User`, `Media`
- Typed query helpers: `getRecipes()`, `getRecipeBySlug(slug)`, etc.

Both apps depend on this package. It is the only place collections are defined.

### `packages/ui` (@salabridge/ui)

Moves existing components out of `apps/web/src/lib/components`. Built with `@sveltejs/package`. Exports: Button, Input, Toggle, Header, Navbar. No business logic — purely presentational.

### `apps/cms` (@salabridge/cms-server)

A thin Express server. Calls `payload.init({ express: app })` and starts listening on port `3000`. Serves Payload's built-in Admin UI at `/admin`. Deployed independently from `apps/web`.

### `apps/web` (@salabridge/web)

The SvelteKit frontend. Drops Lucia, arctic, Drizzle, and all associated packages. Imports components from `@salabridge/ui` and data/auth helpers from `@salabridge/cms`. Deploys to Vercel (retains `adapter-vercel`).

## Payload Collections & Data Model

### Users
Payload's built-in auth collection. Fields: `name`, `email` (built-in), `role` (`admin` | `member`). Replaces Lucia's `users`, `sessions`, and `keys` tables plus the custom `auth` Postgres schema.

### Recipes
Core content collection. Fields:
- `title` (text)
- `slug` (text, auto-generated, indexed)
- `tagline` (text)
- `heroImage` (upload → Media)
- `prepTime`, `cookTime` (number, minutes)
- `ingredients` (array: `{ ingredient: relationship → Ingredients, quantity: text }`)
- `tags` (relationship → Tags, hasMany)
- `steps` (array: `{ instruction: richText, photo: upload, stepTime: number }`)
- `status` (`draft` | `published`)

### Ingredients
Lookup collection. Fields: `name` (text), `unit` (text, e.g. "lb", "oz", "cup").

### Tags
Lookup collection. Fields: `name` (text), `slug` (text).

### Media
Payload's built-in upload collection for hero images and step photos. Local storage in dev; S3-swappable in production.

## Turborepo Pipeline

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".svelte-kit/**", "dist/**"] },
    "dev":   { "cache": false, "persistent": true },
    "lint":  { "dependsOn": ["^build"] },
    "check": { "dependsOn": ["^build"] }
  }
}
```

`pnpm dev` from root starts all three concurrently:
- `apps/cms` → Express + Payload on port `3000`
- `apps/web` → SvelteKit on port `5173`

Both share one Postgres database in dev. Payload manages its own schema migrations. Build caching applies to `build` and `check`; `dev` is never cached. Changing a collection in `packages/cms` invalidates downstream app builds.

**Root `package.json` scripts:**
```json
{
  "dev":   "turbo dev",
  "build": "turbo build",
  "lint":  "turbo lint",
  "check": "turbo check"
}
```

## Auth Flow (Replacing Lucia)

Payload's built-in auth (email/password, HTTP-only cookie sessions) replaces the entire Lucia stack.

**Login:** `/login` in `apps/web` submits to a `+page.server.ts` form action. The action calls `payload.login({ collection: 'users', data: { email, password } })` via the Local API. The returned token is set as an HTTP-only `payload-token` cookie.

**Session validation:** `hooks.server.ts` replaces the Lucia session check. On every request it reads the `payload-token` cookie and calls `payload.verifyToken({ token })` to hydrate `event.locals.user`. Invalid/missing token → `locals.user` is null.

**Protected routes:** `/admin` in `apps/web` checks `locals.user?.role === 'admin'`. Same guard pattern as before, sourced from Payload.

**Logout:** `/logout` action clears the `payload-token` cookie.

**Payload Admin UI** at `apps/cms` (port 3000) has its own independent auth for content editors. Only admins receive that URL.

## Packages Removed from `apps/web`

- `lucia`
- `arctic`
- `@lucia-auth/adapter-drizzle`
- `@lucia-auth/adapter-postgresql`
- `oslo`
- `jose`
- `drizzle-orm`
- `drizzle-kit`
- `pg`
- `@types/pg`
- `dotenv` (env handled by each app individually)

## Packages Removed from Root

- `packages/db` (replaced by `packages/cms`)

## Out of Scope

- Google OAuth (was partially wired in — deferred; Payload has a plugin for this later)
- S3 media storage (local storage for now)
- Any UI changes beyond moving components to `packages/ui`
