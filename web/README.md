# Bifrost — web frontend

Next.js (App Router, static export) frontend for **Bifrost**, the MCP gateway.
Built from the exported design in `../scratch/bifrost/` — see `DESIGN-HANDOFF.md`
there for the visual contract (tokens, responsive matrix, interactions).

## Local dev

```bash
npm install
npm run dev   # http://localhost:3000
```

The page is a single snap-viewport screen: sections switch on scroll wheel,
↑/↓/PageUp/PageDown/Home/End keys, touch swipe, or the nav. The active tab
persists in `localStorage` under `bifrost.tab`.

## Production build

```bash
npm run build   # emits static HTML/CSS/JS to out/
```

`next.config.ts` uses `output: "export"`, `trailingSlash: true`, and
`images.unoptimized` — there is no Node server at runtime.

## Docker

From the **repo root** (build context is the root, mirroring the nyaya
monorepo strategy):

```bash
docker build -t bifrost-web .
docker run -p 8080:8080 bifrost-web

# or, with hardening (read-only root, dropped caps) + health check:
docker compose up --build
```

Two stages: `node:20-alpine` runs `npm run build` (static export → `/web/out/`),
then `nginxinc/nginx-unprivileged:alpine` serves `out/` on port **8080**
(non-root) with immutable caching for `/_next/static/`. `GET /` doubles as the
container health check.

## Deploy

Single-container deploy — the same pattern as
[nyaya](https://github.com/paragmraw/nyaya): one image, one origin, health
check on `GET /`. Railway config is defined in the root
[`.railway/railway.ts`](../.railway/railway.ts) (Railway IaC — the old
`railway.toml` was removed; CaC is deprecated). The IaC file declares the
`GET /` healthcheck (timeout 60s), the GitHub deploy source, 1 replica, and
the `bifrost.parag.tech` domain; the restart policy remains
dashboard-managed. On Railway, connect the repo (autodeploy from
`main`) or run `railway up` from the repo root; no environment variables are
required. Config changes are manual local steps — `railway config plan` /
`railway config apply`; CI stays deploy-free and only typechecks the IaC
file. See the root [README](../README.md#deploy-to-railway).