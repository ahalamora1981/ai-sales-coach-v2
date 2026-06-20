FROM node:18-slim AS base

# Install pnpm and openssl
RUN npm install -g pnpm@9 && \
    apt-get update && apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma* ./node_modules/
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy bcryptjs for seeding
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/@types/bcryptjs ./node_modules/@types/bcryptjs

# Copy entrypoint script
COPY --chmod=755 docker-entrypoint.sh ./

USER root

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./docker-entrypoint.sh"]
