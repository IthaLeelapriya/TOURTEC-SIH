# Multi-stage Docker build for TOURTEC Production Deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Install frontend dependencies and build
COPY frontend/package*.json ./frontend/
RUN npm --prefix frontend install
COPY frontend ./frontend
RUN npm --prefix frontend run build

# Stage 2: Production Server
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

# Copy backend source & built frontend assets
COPY backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "backend/server.js"]
