# bifrost

**The MCP gateway's web frontend** — a single-screen Next.js (App Router,
static export) landing site for **Bifrost**, the MCP gateway. Sections switch
on scroll wheel, keyboard, touch swipe, or the nav; the active tab persists
in `localStorage`.

## Components

| Path | Status | Description |
|---|---|---|
| [`web/`](web/) | alpha | Next.js static-export frontend. Built in a Node 20 stage from the root [`Dockerfile`](Dockerfile) and served by an unprivileged nginx on `:8080`. Deployable to Railway via Docker. |

See [`web/README.md`](web/README.md) for the design contract and build
details (`DESIGN-HANDOFF.md` lives in `scratch/bifrost/`).

## Docker

Build context is the repo root (mirroring the nyaya monorepo strategy):

```bash
docker build -t bifrost-web .
docker run -p 8080:8080 bifrost-web
```

Or with Compose — same image, hardened runtime (read-only root, dropped
capabilities, tmpfs `/tmp`, PID/memory caps) and a `wget` health check on
`GET /`:

```bash
docker compose up --build
```

Two stages: `node:20-alpine` runs `npm run build` (static export →
`web/out/`), then `nginxinc/nginx-unprivileged:alpine` serves `out/` on port
**8080** (non-root) with immutable caching for `/_next/static/`. `GET /`
doubles as the container health check.

## Deploy to Railway

Infrastructure is defined in code: [`.railway/railway.ts`](.railway/railway.ts)
(Railway [Infrastructure as Code](https://docs.railway.com/infrastructure-as-code);
the old `railway.toml` Config as Code file was removed — CaC is deprecated and
unread after 2026-12-01). A single Railway service serves the static frontend
from one origin (root `Dockerfile`). The IaC file declares the `GET /`
healthcheck (timeout 60s), the GitHub deploy source, 1 replica in Southeast
Asia, the `bifrost.parag.tech` domain, and the live limit/egress/sleep
settings (imported with `railway config pull`); the restart policy remains
dashboard-managed.

1. No environment variables are required — the frontend is fully static.
2. Deploys: connect the GitHub repo (autodeploy from `main`) or run
   `railway up` from the repo root — it builds the root `Dockerfile`
   (Node 20 stage builds `web/out/`, nginx stage serves it on `:8080`).
3. Config changes are **manual local steps** (CI stays deploy-free and never
   touches Railway):
   - `railway config plan --detailed-exit-code` — preview drift (`0` = in
     sync, `2` = pending changes).
   - `railway config apply --yes` — apply `.railway/railway.ts`; add
     `--confirm-destructive` if the plan includes deletions.
4. Smoke checks against the deployed domain:
   - `GET /` → home renders (hero tab active).
   - `GET /logo.webp` → `200`, static media cached 7d.
   - `GET /_next/static/…` asset → `200`, `Cache-Control: immutable`.

## Local development

- **Dev (HMR)**: `cd web && npm install && npm run dev` → Next dev server on
  `:3000`.
- **Build check**: `cd web && npx eslint . && npm run build` → produces
  `web/out/`.
- **Serve the production bundle locally**: `docker compose up --build` →
  `http://localhost:8080/`, or serve `web/out/` with any static file server.

## License

MIT. See [LICENSE](LICENSE).