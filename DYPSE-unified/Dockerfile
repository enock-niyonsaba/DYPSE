# Multi-stage build for DYPSE unified application
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/client/package*.json ./apps/client/
COPY apps/server/package*.json ./apps/server/
COPY packages/*/package*.json ./packages/*/

# Install dependencies
RUN npm ci --only=production

# Build stage for client
FROM base AS client-builder
WORKDIR /app/apps/client
COPY apps/client/ ./
RUN npm run build

# Build stage for server
FROM base AS server-builder
WORKDIR /app/apps/server
COPY apps/server/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S dypse -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/client/package*.json ./apps/client/
COPY apps/server/package*.json ./apps/server/

# Install production dependencies
RUN npm ci --only=production

# Copy built applications
COPY --from=client-builder --chown=dypse:nodejs /app/apps/client/dist ./apps/client/dist
COPY --from=server-builder --chown=dypse:nodejs /app/apps/server/dist ./apps/server/dist

# Copy source files for server
COPY --from=server-builder --chown=dypse:nodejs /app/apps/server/src ./apps/server/src
COPY --from=server-builder --chown=dypse:nodejs /app/apps/server/prisma ./apps/server/prisma

# Copy shared packages
COPY --chown=dypse:nodejs packages ./packages

# Create uploads directory
RUN mkdir -p uploads && chown dypse:nodejs uploads

# Switch to non-root user
USER dypse

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
