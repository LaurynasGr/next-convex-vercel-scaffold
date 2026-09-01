# Next + Convex + Vercel scaffold

Starter for a full-stack app.
Bun workspaces monorepo, Next.js (App Router) + Tailwind v4 + shadcn, Convex backend with Google sign-in via Convex Auth.

## Layout

- `convex/` — Convex schema, functions and auth (shared backend, lives at the repo root; `apps/web/convex.json` points here)
- `packages/core/` — `@scaffold/core`: Convex API re-exports, zod schema helpers and other React-free shared code; React hooks under `@scaffold/core/hooks`. Pure helpers used by Convex functions live here too, since every file under `convex/` is pushed as a module.
- `packages/ui/` — `@scaffold/ui`: shadcn components (`@scaffold/ui/components/*`), `cn`, the Tailwind theme (`src/styles/globals.css`)
- `packages/forms/` — `@scaffold/forms`: react-hook-form field components (InputField, SelectField, DateField, …) built on `@scaffold/ui`
- `apps/web/` — the Next.js app; Convex CLI commands run from here

## File layout rules

- File names are kebab-case (`number-field.tsx`, `dev-sign-in.ts`); exported symbols stay PascalCase/camelCase.
- A component lives in its own directory with everything that belongs only to it: `number-field/number-field.tsx`, `number-field/number-input.ts`, `number-field/number-input.test.ts`.
- Tests are colocated next to what they test (`*.test.ts`, run by `bun test` from the root). Compile-time fixtures use `*.typecheck.tsx` and are only picked up by `tsc`.
- Package-private helpers go in that package's `src/utils/<name>.ts`; helpers shared by several packages go to `packages/utils` (create it when first needed).
- In `apps/web`, `src/components/` is only for components reused across routes. One-off UI is inlined into the page or, when large, colocated in the route directory (`app/login/content.tsx`). Client components are split into their own `'use client'` files under a `partials/` directory next to the server file that renders them (`app/login/partials/sign-in-buttons.tsx`, `app/(app)/partials/user-menu.tsx`); keep pages and layouts server components.

## Conventions

- Bun everywhere: `bun install`, `bun run <script>`, `bunx <pkg>`, `bun test`.
- Biome formats and lints (4 spaces, single quotes, no semicolons, 120 cols). Run `bun run lint` before finishing; `bun run lint:fix` auto-formats.
- Forms: zod schema in `packages/core`, `useForm<z.input<typeof S>, unknown, z.output<typeof S>>({ resolver: zodResolver(S), mode: 'onTouched', defaultValues })`, fields from `@scaffold/forms` bound with `control`. Field `name`s are constrained to paths of the matching value type: `InputField`/`TextareaField`/`SelectField`/`DateField`/`TimeField` → `string`, `NumberField` → `number | null`, `CheckboxField` → `boolean`.
- Form state never holds `undefined` (react-hook-form resets such a field to its default value). Empty text is `''`, empty number is `null`; schemas use `optionalString` / `optionalNumber` / `requiredNumber` from `@scaffold/core` so the parsed output has clean `undefined`s. Always give every field a default value.
- Add shadcn components from `apps/web` with `bunx shadcn add <name>`; they land in `packages/ui/src/components`.
- Third-party API calls run server-side only (Convex actions); API tokens never reach the browser.
- Never set `DEV_SIGN_IN_AS` on the production deployment.
