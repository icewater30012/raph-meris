#!/bin/bash

# raph-meris Development Shutdown Script
# This script stops all running development services

set -e

echo "🛑 Stopping raph-meris development environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Stop backend
if [ -f .dev/backend.pid ]; then
    BACKEND_PID=$(cat .dev/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${BLUE}🐍 Stopping backend server (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend process not found${NC}"
    fi
    rm .dev/backend.pid
else
    echo -e "${YELLOW}⚠️  Backend PID file not found${NC}"
fi

# Stop frontend
if [ -f .dev/frontend.pid ]; then
    FRONTEND_PID=$(cat .dev/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${BLUE}⚛️  Stopping frontend server (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend process not found${NC}"
    fi
    rm .dev/frontend.pid
else
    echo -e "${YELLOW}⚠️  Frontend PID file not found${NC}"
fi

# Stop PostgreSQL
echo -e "\n${BLUE}📦 Stopping PostgreSQL database...${NC}"
cd infra
docker-compose down
cd ..
echo -e "${GREEN}✓ PostgreSQL stopped${NC}"

# Clean up
if [ -d .dev ] && [ -z "$(ls -A .dev)" ]; then
    rmdir .dev
fi

echo -e "\n${GREEN}✅ All services stopped successfully!${NC}"

# Made with Bob
