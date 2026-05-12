# raph-meris

Raphael’s Meritavus Speculo: From daily order to annual impact.

## Overview

raph-meris is a personal work intelligence web application focused on turning daily work records into structured project context, performance-ready achievements, and annual reflection assets.

Its core philosophy is:

- prioritize work clearly
- filter for core contributions
- record achievements continuously
- support annual reflection and feedback

The first version is designed for personal use, with an emphasis on:

- daily work logging
- project organization
- monthly report drafting
- yearly report drafting

Bob will be embedded into the product as an assistant that helps organize records, suggest structure, and draft reports. Bob will not write final structured data without user confirmation.

## Product Direction

The first version of raph-meris aims to support this workflow:

1. write daily work notes in free text
2. let Bob suggest structured fields from the note
3. review and confirm the structured result
4. organize records under projects
5. generate monthly and yearly performance-oriented report drafts
6. identify collaborators who helped and may deserve Blue Point recognition

The reporting style for v1 is performance-oriented, with focus on:

- completed work
- impact
- outcomes
- project contribution

## Tech Stack

### Frontend
- React
- Next.js
- TypeScript

### Backend
- Python
- FastAPI

### Database
- PostgreSQL

### Planned Later
- pgvector for semantic retrieval
- IBM Vault for production-grade secret management

## v1 Scope

The first implementation phase will focus on the minimum product skeleton:

- frontend application skeleton
- backend application skeleton
- PostgreSQL connection from day one
- minimal schema with `projects` and `daily_logs`
- dashboard page
- logs page
- projects page
- minimal APIs for health check, projects, and daily logs

Not in the first implementation step:

- multi-user collaboration
- advanced AI agent autonomy
- pgvector integration
- production Vault integration
- complex authorization
- Blue Point automation workflow

## Initial Data Model Direction

The first database schema will start small.

### projects
Expected initial fields:
- id
- name
- description
- priority
- status
- created_at
- updated_at

### daily_logs
Expected initial fields:
- id
- log_date
- raw_text
- project_id
- created_at
- updated_at

Future models such as `work_entries`, `collaborators`, `collaboration_events`, and `report_snapshots` will be added after the core flow is stable.

## Planned Project Structure

```text
raph-meris/
  frontend/
  backend/
  infra/
  docs/
```

Planned responsibilities:

- `frontend/`: Next.js + TypeScript application
- `backend/`: FastAPI application
- `infra/`: local development infrastructure such as PostgreSQL
- `docs/`: architecture and data model documentation

## Implementation Approach

The project will be built step by step.

Planned order:

1. update root documentation
2. define environment variable examples
3. create local PostgreSQL infrastructure
4. create backend application skeleton
5. create minimal schema and APIs
6. create frontend application skeleton
7. create dashboard, logs, and projects pages
8. expand documentation as implementation grows

## Principles

- start with product structure, not a throwaway demo
- connect PostgreSQL from the beginning, but keep schema minimal
- preserve free-text work logging as the primary input
- let Bob suggest, but require user confirmation for final structured data
- keep the first version small and stable before expanding AI capability

## Status

Current phase: **v1 Implementation Complete** ✅

Completed features:
- ✅ Backend API with FastAPI
- ✅ PostgreSQL database integration
- ✅ Alembic database migrations
- ✅ Frontend with Next.js and TypeScript
- ✅ Projects management (create, list)
- ✅ Daily logs management (create, list)
- ✅ CORS configuration
- ✅ Development environment setup

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- Docker and Docker Compose

### Start Development Environment

```bash
# Make scripts executable (first time only)
chmod +x scripts/*.sh

# Start all services
./scripts/start-dev.sh

# Stop all services
./scripts/stop-dev.sh
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

For detailed setup instructions, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

## Next Steps

Future enhancements planned:
- Bob AI assistant integration for log structuring
- Monthly and yearly report generation
- Blue Point collaborator recognition
- Advanced search and filtering
- Performance analytics dashboard

