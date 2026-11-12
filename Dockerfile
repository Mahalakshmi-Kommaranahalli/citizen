# ==============================================================================
# Multi-stage Dockerfile for NagarSeva Full-Stack Citizen Grievance Portal
# ==============================================================================

# Stage 1: Build Client Frontend
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Copy server application
WORKDIR /app
COPY server/ ./server/

# Copy built frontend from Stage 1 into client/dist
COPY --from=client-builder /app/client/dist ./client/dist

# Ensure uploads and data directories exist
RUN mkdir -p /app/server/uploads /app/server/data

# Environment configuration
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Start the unified server
CMD ["node", "server/src/server.js"]

