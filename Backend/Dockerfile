# Backend Dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
# Install all dependencies (including devDependencies if needed for build scripts)
RUN npm ci

COPY . .

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
# Install only production dependencies
RUN npm ci --only=production

# Copy source code from builder (or local if no build step needed for JS)
# For strictness, we copy from builder to ensure clean state, 
# but for raw JS backend, copying src is fine. 
# If using TypeScript or Babel, we would copy dist/build folder.
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/server.js ./
COPY --from=builder /usr/src/app/app.js ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000

CMD ["node", "server.js"]
