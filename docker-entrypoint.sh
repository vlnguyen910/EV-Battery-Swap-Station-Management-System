#!/bin/sh

set -e

echo "Starting AI Station application..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until pg_isready -h db -p 5432 -U ${DB_USER:-postgres}; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing migrations"

# Navigate to backend directory
cd /app/backend

# Run Prisma migrations
npx prisma migrate deploy

# Seed database if needed
if [ "$SEED_DATABASE" = "true" ]; then
  echo "Seeding database..."
  npx prisma db seed || true
fi

# Start backend in background
echo "Starting backend server..."
node dist/main.js &
BACKEND_PID=$!

# Give backend time to start
sleep 3

# Start a simple HTTP server for frontend
echo "Starting frontend server..."
cd /app/frontend
npx serve -s dist -l 5173 &
FRONTEND_PID=$!

# Keep containers running
wait
