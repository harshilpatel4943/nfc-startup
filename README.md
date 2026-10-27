# NFC Restaurant Menu

Customer-facing restaurant pages and a protected restaurant admin workspace. Restaurant profile, menu, table links, drafts, guest requests, and feedback are stored in Supabase.

## Run locally

1. Copy `.env.example` to `.env.local` and set the Supabase project URL, publishable key, and restaurant slug.
2. Install dependencies with `npm ci`.
3. Start the dev server with `npm run dev`.

The customer page opens at `/`. Add `?table=1` (or another active table number) for an NFC or QR link. The admin workspace is at `/admin`.

## Deploy to Vercel

- Set the build command to `npm run build` and the output directory to `dist`.
- Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_RESTAURANT_SLUG` in Vercel's project environment variables for each deployment environment.
- The publishable key is intended for browser use. Never put a Supabase secret or service-role key in a `VITE_` variable.
- The Supabase Edge Function `upload-restaurant-image` is used for authenticated image uploads. Set its `ALLOWED_ORIGINS` secret to the exact Vercel production origin and any preview origin you use (comma-separated origins, including `https://`).
- The app expects the restaurant slug `the-cave` unless `VITE_RESTAURANT_SLUG` is set.

## Supabase setup

- SQL migrations in `supabase/migrations/` are the schema source of truth. They are already applied to the connected pilot project; apply them in order when setting up another project.
- `supabase/the-cave-menu.sql` and `supabase/pilot-operations.sql` are setup scripts for manual SQL Editor setup. Avoid running these on a project that already has the migrations applied.
- `supabase/grant-restaurant-admin.sql` assigns an existing Auth user to a restaurant. Replace the example email before running it.
- Restaurant images are stored in the public `restaurant-assets` bucket. Uploads require an authenticated restaurant admin and are limited to JPEG, PNG, or WebP files up to 5 MB.

## Project layout

- `src/pages/` contains customer pages.
- `src/features/admin/` contains the restaurant admin workspace.
- `src/components/` contains shared UI and guest interactions.
- `src/data/` contains default/demo content and shared data types.
- `src/lib/` contains Supabase client and restaurant cloud operations.
- `supabase/migrations/` contains ordered database changes.
- `supabase/functions/` contains the image upload Edge Function.

## Commands

- `npm run dev` starts the local development server.
- `npm run build` type-checks and builds the frontend into `dist/`.
- `npm run preview` previews the production build locally.
