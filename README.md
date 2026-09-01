# Next + Convex + Vercel scaffold

Starter for a full-stack app: Next.js (App Router) + Tailwind v4 + shadcn on
the front, Convex on the back, Google sign-in via Convex Auth, typed forms
with react-hook-form + zod, Biome, Bun workspaces. Deploys to Vercel with
`convex deploy` in the build step.

## Using the scaffold

1. Clone, then search and replace `@scaffold/` with your package scope and
   `next-convex-vercel-scaffold` with your project name (`package.json`, imports,
   `components.json`, `tsconfig` paths).
2. Edit `apps/web/src/lib/brand.ts` (name and tagline) and `apps/web/src/app/icon.svg`.
3. Follow "Local setup" below.

## Repository layout

Bun workspaces monorepo. The Convex functions live at the repo root; the Convex
CLI runs from `apps/web` (its `convex.json` points at `../../convex`) so the
Next.js app's `.env.local` is the single env file.

- `convex/` — Convex schema, queries, mutations and auth (shared backend)
- `packages/core/` — `@scaffold/core`: Convex API re-exports, zod form-schema
  helpers and other React-free shared code; React hooks under `@scaffold/core/hooks`
- `packages/ui/` — `@scaffold/ui`: shadcn components, `cn`, Tailwind theme
- `packages/forms/` — `@scaffold/forms`: typed react-hook-form fields
- `apps/web/` — the Next.js app

Root scripts: `bun run dev` (web + convex), `bun run build`, `bun run lint`
(biome + typecheck of every package), `bun test`. Tests are colocated
(`*.test.ts` next to the code). See `CLAUDE.md` for the coding conventions.

## Local setup

1. `bun install`
2. `cd apps/web && bunx convex dev` once — it creates a local (anonymous)
   deployment and writes `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` into
   `apps/web/.env.local` (see `.env.example`).
3. Initialize Convex Auth keys (one-time, sets `JWT_PRIVATE_KEY`, `JWKS`,
   `SITE_URL` on the dev deployment):

   ```sh
   cd apps/web && bunx @convex-dev/auth
   ```

4. Set up Google OAuth ([Convex Auth docs](https://labs.convex.dev/auth/config/oauth/google)):
   - In Google Cloud Console create an OAuth client (web application) with
     authorized redirect URI `<convex site url>/api/auth/callback/google`
     (`http://127.0.0.1:3211/api/auth/callback/google` for a local deployment).
   - `bunx convex env set AUTH_GOOGLE_ID <client-id>`
   - `bunx convex env set AUTH_GOOGLE_SECRET <client-secret>`
5. `bun run dev` — Next.js on :3000 and `convex dev` side by side.

## Dev sign-in without Google

A local deployment can offer a shortcut on the sign-in page:

```sh
cd apps/web && bunx convex env set DEV_SIGN_IN_AS you@example.com   # or "first" for the first user
```

The user is created if it does not exist yet. The provider only activates when
the deployment's site URL is a loopback address, so the variable is harmless
on cloud deployments — still, do not set it there.

## Deploying to Vercel

Create the Vercel project with **Root Directory = `apps/web`** (keep "Include
source files outside of the Root Directory" enabled). `apps/web/vercel.json`
builds with `bunx convex deploy --cmd 'bun run build'`, which deploys the
Convex functions to prod and passes the prod URL to the Next.js build as
`NEXT_PUBLIC_CONVEX_URL`.

On Vercel set:

- `CONVEX_DEPLOY_KEY` — production deploy key from the Convex dashboard.

On the **production** Convex deployment set (dashboard or `bunx convex env set --prod`):

- `SITE_URL` — the Vercel app URL (OAuth redirects back to it)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
- Auth keys: `bunx @convex-dev/auth --prod` once.

Add the prod redirect URI to the Google OAuth client:
`https://<prod-deployment-name>.convex.site/api/auth/callback/google`.

Note: Vercel's Hobby plan is for non-commercial use only.
