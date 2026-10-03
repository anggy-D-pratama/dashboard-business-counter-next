# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time env vars (Nuxt public vars are baked in at build time)
ARG NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Generate fully static output (no Node.js server needed at runtime)
RUN npm run generate

# Stage 2: Serve with nginx (lightweight, battle-tested static server)
FROM nginx:alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static build output from builder
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Cloud Run injects PORT at runtime; nginx listens on it via envsubst
ENV PORT=8080

EXPOSE 8080

# Use envsubst to replace $PORT in nginx config at startup
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/nginx.conf > /tmp/nginx.conf && mv /tmp/nginx.conf /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
