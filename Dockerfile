# Grave the Crave web — Next.js 16 (standalone output) image
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

# Optional: leave empty to use same-origin /api/* (recommended — the Next
# server proxies /api to the api container). Only set this if the API is
# deliberately on a different origin.
ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# --- Production runner: standalone server ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
# Force port 3000 even when a shared stack-level PORT=3333 (meant for the
# api service) is injected into this container — Coolify routes the site
# FQDN to container port 3000.
CMD ["sh", "-c", "PORT=3000 exec node server.js"]
