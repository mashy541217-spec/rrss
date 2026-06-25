# Stage 1: Build the Monorepo
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --workspaces --if-present

# Stage 2: Production Worker Image
# Using a heavier base image if Playwright/Puppeteer is needed
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS production

WORKDIR /app
ENV NODE_ENV=production

# Copy built Worker dist (assuming worker logic resides in apps/api or a separate apps/worker)
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/packages ./packages

RUN npm ci --only=production

# Workers pull from queue, so no exposed ports needed
CMD ["node", "dist/worker.js"]
