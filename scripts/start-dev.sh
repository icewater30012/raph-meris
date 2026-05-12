#!/bin/bash

# raph-meris Development Startup Script
# This script starts all services needed for local development

set -e

echo "🚀 Starting raph-meris development environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file. Please review and update if needed.${NC}"
fi

# Start PostgreSQL with Docker Compose
echo -e "\n${BLUE}📦 Starting PostgreSQL database...${NC}"
cd infra
docker-compose up -d
cd ..

# Wait for PostgreSQL to be ready
echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Check if database is ready
until docker exec raph-meris-postgres pg_isready -U raph_meris > /dev/null 2>&1; do
    echo -e "${YELLOW}Waiting for database...${NC}"
    sleep 2
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Run database migrations
echo -e "\n${BLUE}🔄 Running database migrations...${NC}"
cd backend
alembic upgrade head
cd ..
echo -e "${GREEN}✓ Database migrations completed${NC}"

# Start backend in background
echo -e "\n${BLUE}🐍 Starting backend server...${NC}"
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -e "${BLUE}⏳ Waiting for backend to be ready...${NC}"
sleep 3
until curl -s http://localhost:8000/health > /dev/null 2>&1; do
    echo -e "${YELLOW}Waiting for backend...${NC}"
    sleep 2
done
echo -e "${GREEN}✓ Backend is ready${NC}"

# Start frontend in background
echo -e "\n${BLUE}⚛️  Starting frontend server...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Save PIDs for cleanup
mkdir -p .dev
echo $BACKEND_PID > .dev/backend.pid
echo $FRONTEND_PID > .dev/frontend.pid

echo -e "\n${GREEN}✅ All services started successfully!${NC}"
echo -e "\n📍 Services:"
echo -e "   Frontend:  ${BLUE}http://localhost:3000${NC}"
echo -e "   Backend:   ${BLUE}http://localhost:8000${NC}"
echo -e "   API Docs:  ${BLUE}http://localhost:8000/docs${NC}"
echo -e "   Database:  ${BLUE}localhost:5432${NC}"
echo -e "\n📝 Logs:"
echo -e "   Backend:   ${BLUE}tail -f logs/backend.log${NC}"
echo -e "   Frontend:  ${BLUE}tail -f logs/frontend.log${NC}"
echo -e "\n🛑 To stop all services, run: ${BLUE}./scripts/stop-dev.sh${NC}"

# Made with Bob
