# Stage 1: Build Studio
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
# We build the studio app specifically
RUN npm run build --workspace=apps/studio --if-present

# Stage 2: Serve via Nginx
FROM nginx:alpine AS production
COPY --from=builder /app/apps/studio/dist /usr/share/nginx/html
COPY apps/studio/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
