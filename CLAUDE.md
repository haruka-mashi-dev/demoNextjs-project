# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Run ESLint

# Testing (Jest)
npx jest                          # Run all tests
npx jest path/to/file.test.ts     # Run a single test file
npx jest --watch                  # Watch mode
```

## Architecture

This is a **Next.js 16 App Router** project with TypeScript — a hands-on learning project for a baby care recording app (育児記録アプリ). Currently only the sleep recording feature is implemented.

**Tech stack:** Next.js · TypeScript · Tailwind CSS v4 · shadcn/ui · Zod · Supabase · Jest

### Data flow

Pages are **Server Components** that fetch directly from Supabase, then pass data down to Client Components. Mutations use **Next.js Server Actions** (`"use server"`) which call Supabase and then `revalidatePath()` to refresh data.

```
src/app/sleep/page.tsx          ← Server Component: fetches sleep_records from Supabase
  └─ _components/sleep-form.tsx ← Client Component: calls Server Action on submit
  └─ _components/sleep-list.tsx ← Client Component: displays records
src/app/sleep/_actions/         ← Server Actions (create-sleep.ts, delete-sleep.ts)
src/app/sleep/_schema.ts        ← Zod validation schemas shared between form + actions
```

### Key conventions

- **Co-location**: page-specific components live in `_components/`, server actions in `_actions/`, and Zod schemas in `_schema.ts` — all under the route folder.
- **Shared UI**: Generic shadcn/ui primitives live in `src/components/ui/`.
- **Utilities**: Pure logic functions (e.g., `calcSleepMinutes`, `formatMinutes`) live in `src/utils/sleep.ts` and are the primary target for unit tests.
- **Types**: Shared TypeScript types in `src/types/` (e.g., `SleepRecord`).
- **Supabase client**: Single shared client at `src/lib/supabase.ts` using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars.

### Supabase table mapping

The `sleep_records` table uses snake_case columns, mapped to camelCase in TypeScript:
- `bed_time` → `bedTime`
- `wake_up_time` → `wakeUpTime`
- `type`: `"night"` | `"ohirune"`

### Planned but not yet implemented

食事 (meals), 日記 (diary), 病院 (hospital) — stubs exist on the TOP page linking to `#`.
