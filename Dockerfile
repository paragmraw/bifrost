# syntax=docker/dockerfile:1.7
#
# Multi-stage Dockerfile for the Bifrost frontend: builds the Next.js static
# export in a Node stage, then serves it from an unprivileged nginx runtime.
# Build context is the repo root. (Pattern follows the nyaya monorepo
# Dockerfile: static-export SPA built in node:20-alpine, served by a minimal
# runtime container — nginx here since Bifrost is frontend-only.)

# --- Stage 1: build the SPA (static export -> /web/out) -----------------------
FROM node:20-alpine AS web-builder
ENV NODE_ENV=production
WORKDIR /web
# Install deps first for layer caching. Use `npm install` (not `npm ci`) so
# platform-specific optional deps are reconciled — the committed lockfile may
# be generated on Windows and lack Linux-only entries.
COPY web/package.json web/package-lock.json ./
RUN npm install --no-audit --no-fund --include=dev
COPY web/ .
RUN npm run build
# Output: /web/out/ (static HTML/CSS/JS + assets)

# --- Stage 2: runtime ---------------------------------------------------------
# Unprivileged nginx (non-root, port 8080) to match nyaya's non-root posture.
FROM nginxinc/nginx-unprivileged:alpine AS runtime

COPY --from=web-builder /web/out/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

STOPSIGNAL SIGTERM

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]