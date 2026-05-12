# Development Guide

This guide will help you set up and run the raph-meris application locally.

## Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL 16+
- Docker and Docker Compose (recommended for database)

## Quick Start

### 1. Clone and Setup Environment

```bash
# Clone the repository
git clone <repository-url>
cd raph-meris

# Copy environment variables
cp .env.example .env

# Edit .env with your local settings if needed
```

### 2. Start PostgreSQL Database

Using Docker Compose (recommended):

```bash
cd infra
docker-compose up -d
cd ..
```

Or use your local PostgreSQL installation and update the `.env` file accordingly.

### 3. Setup Backend

```bash
cd backend

# Install dependencies using uv (recommended)
uv pip install -e .

# Or using pip
pip install -e .

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at http://localhost:8000

### 4. Setup Frontend

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:3000

## Project Structure

```
raph-meris/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── core/     # Core configuration
│   │   ├── models/   # SQLAlchemy models
│   │   └── schemas/  # Pydantic schemas
│   ├── alembic/      # Database migrations
│   └── pyproject.toml
├── frontend/         # Next.js frontend
│   ├── app/         # App router pages
│   └── lib/         # Utilities and API client
├── infra/           # Infrastructure (Docker)
└── docs/            # Documentation
```

## Database Migrations

### Create a new migration

```bash
cd backend
alembic revision --autogenerate -m "description of changes"
```

### Apply migrations

```bash
cd backend
alembic upgrade head
```

### Rollback migrations

```bash
cd backend
alembic downgrade -1  # Rollback one migration
```

## API Documentation

Once the backend is running, you can access:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Common Tasks

### Reset Database

```bash
cd backend
alembic downgrade base
alembic upgrade head
```

### Check Backend Health

```bash
curl http://localhost:8000/health
```

### Run Backend Tests

```bash
cd backend
pytest
```

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running:
   ```bash
   docker-compose ps
   ```

2. Check database credentials in `.env`

3. Test connection:
   ```bash
   psql -h localhost -U raph_meris -d raph_meris
   ```

### Port Already in Use

If port 8000 or 3000 is already in use:

```bash
# Find process using the port
lsof -i :8000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Frontend Can't Connect to Backend

1. Ensure backend is running on port 8000
2. Check CORS settings in `backend/app/main.py`
3. Verify `NEXT_PUBLIC_API_BASE_URL` in `.env`

## Development Workflow

1. Create a new branch for your feature
2. Make changes to backend and/or frontend
3. Test locally
4. Create database migrations if needed
5. Commit and push changes
6. Create a pull request

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `DATABASE_URL`: PostgreSQL connection string
- `BACKEND_HOST`: Backend host (default: 0.0.0.0)
- `BACKEND_PORT`: Backend port (default: 8000)
- `BACKEND_CORS_ORIGINS`: Allowed CORS origins
- `NEXT_PUBLIC_API_BASE_URL`: Frontend API base URL

## Next Steps

- Read the [README.md](../README.md) for project overview
- Check the API documentation at http://localhost:8000/docs
- Explore the codebase and start contributing!