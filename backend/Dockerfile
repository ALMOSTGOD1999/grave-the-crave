# Grave the Crave API — AdonisJS 7 production image (requires Node >= 24)
FROM node:24-slim AS build

# Native build tools for better-sqlite3 (local-dev dependency compiled at image build)
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
# --include=dev: Coolify injects NODE_ENV=production as a build arg, which
# would make npm skip devDependencies — but `node ace build` needs typescript
# and @adonisjs/assembler from devDeps.
RUN npm ci --include=dev
COPY . .
RUN node ace build
# Strip dev-only packages (tsc, eslint, japa, ...) before shipping node_modules
RUN npm prune --omit=dev

# --- Production runner: compiled output + pruned node_modules ---
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3333

COPY --from=build /app/build ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3333

# Run pending migrations + idempotent seeders, then start the server.
CMD ["sh", "-c", "node ace migration:run --force && node ace db:seed && node bin/server.js"]
