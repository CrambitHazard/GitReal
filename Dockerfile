# ============================================================================
# RealLifeGit Docker Configuration
# Multi-stage build for optimal production image
# ============================================================================

# ============================================================================
# STAGE 1: Dependencies
# ============================================================================
FROM node:18-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci --frozen-lockfile

# ============================================================================
# STAGE 2: Build
# ============================================================================
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================================================
# STAGE 3: Production Dependencies
# ============================================================================
FROM node:18-alpine AS production-deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --frozen-lockfile --production && npm cache clean --force

# ============================================================================
# STAGE 4: Production Image
# ============================================================================
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reallifegit -u 1001

WORKDIR /app

# Copy production dependencies
COPY --from=production-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/frontend/dist ./public

# Copy necessary files
COPY package*.json ./

# Change ownership to non-root user
RUN chown -R reallifegit:nodejs /app
USER reallifegit

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/backend/health-check.js || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

# ============================================================================
# DEVELOPMENT IMAGE (Alternative)
# ============================================================================
FROM node:18-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose ports for development
EXPOSE 3000 5173

# Start development servers
CMD ["npm", "run", "dev"]

# ============================================================================
# Build Instructions:
#
# Production build:
#   docker build -t reallifegit:latest .
#
# Development build:
#   docker build --target development -t reallifegit:dev .
#
# Run production:
#   docker run -p 3000:3000 reallifegit:latest
#
# Run development:
#   docker run -p 3000:3000 -p 5173:5173 -v $(pwd):/app reallifegit:dev
#
# ============================================================================
