---
name: FireboxTechStudios project setup
description: Key decisions about how the frontend and API are wired together in dev
---

# FireboxTechStudios Setup Notes

## API wiring
- Frontend sets `setBaseUrl('')` in `main.tsx` (empty string, NOT `/api`)
- The generated hooks already include `/api` in their paths (e.g. `/api/services/public`), so setting it to `/api` causes double-prefixing → `/api/api/services/public` → 404
- Vite dev server proxies `/api` → `http://localhost:8080` (where the API server runs)
- API server mounts router at `/api` via `app.use("/api", router)` in `app.ts`

**Why:** `setBaseUrl` prepends to whatever path the generated hook already has. Since the OpenAPI spec paths already start with `/api/`, the base must be empty.

**How to apply:** Keep `setBaseUrl('')` in `main.tsx`. If the proxy target changes, update only `vite.config.ts`.

## Custom CSS classes in Tailwind v4
- Tailwind v4 does NOT allow `@apply` with one custom `@layer utilities` class inside another
- `.glass-panel-glow` had `@apply glass-panel` which caused a build error — was fixed by inlining the `glass-panel` styles
- Plain CSS keyframe-based animation classes (`.animate-shimmer`, etc.) cannot be `@apply`-ed inside `@layer utilities` — write the `animation:` property inline instead

**Why:** Tailwind v4 strictly validates `@apply` targets as registered utilities.

## Missing pages created manually
Five admin pages were missing and created manually:
`TutorialsManage`, `NewsletterManage`, `TeamManage`, `FaqManage`, `JobsManage`
All follow the same CRUD modal pattern as `BlogManage.tsx`.

## Port conflicts
The managed `artifacts/api-server: API Server` workflow fails with EADDRINUSE because the legacy `API Server` workflow already holds port 8080. The legacy workflow is kept running; the managed one is unused. If the legacy workflow is removed, the managed one will work fine.
