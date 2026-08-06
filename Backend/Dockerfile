# Backend Dockerfile
# ─────────────────────────────────────────────

# Stage 1: Base - Install all dependencies
FROM node:20-slim AS base
# Install wget for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends wget && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Development - Source code for hot-reloading
FROM base AS development
COPY . .
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# Stage 3: Production - Lean and secure
FROM node:20-slim AS production
RUN apt-get update && apt-get install -y --no-install-recommends wget && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install only production deps
COPY --chown=node:node package*.json ./
RUN npm install --only=production --legacy-peer-deps && \
    npm cache clean --force

# Copy required files
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY . .

# Security and hygiene
RUN mkdir -p src/logs uploads/receipts && \
    chown -R node:node src/logs uploads
USER node
EXPOSE 5000

HEALTHCHECK --interval=20s --timeout=10s --retries=5 --start-period=15s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
