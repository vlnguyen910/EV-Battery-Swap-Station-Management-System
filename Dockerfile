# Multi-stage build for the entire application

# Stage 1: Build backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ .
RUN npm run build

# Stage 2: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine

# Install PostgreSQL client tools
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma
COPY backend/.env.example ./backend/.env

# Copy frontend dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000 5173

ENTRYPOINT ["/docker-entrypoint.sh"]
