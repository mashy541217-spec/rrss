# Stage 1: Build the Monorepo
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
# Build the DAG (composite: true ensures SDKs build first, then API)
RUN npm run build --workspaces --if-present

# Stage 2: Production Image
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

# Copy built API dist
COPY --from=builder /app/apps/api/dist ./dist
# Copy root package.json and API package.json
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api/package*.json ./apps/api/

# Copy built SDKs/Plugins needed at runtime
# In a real monorepo, we'd use a tool like turbo prune or npm workspace isolation
COPY --from=builder /app/packages ./packages

RUN npm ci --only=production

EXPOSE 3000
CMD ["node", "dist/main.js"]
