from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.appreciations import router as appreciations_router
from app.api.daily_logs import router as daily_logs_router
from app.api.goals import router as goals_router
from app.api.health import router as health_router
from app.api.projects import router as projects_router
from app.api.tasks import router as tasks_router
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title="raph-meris API",
        version="0.1.0",
        description="Backend API for raph-meris",
    )

    # Configure CORS - must be before routes
    origins = [origin.strip() for origin in settings.backend_cors_origins.split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for development
        allow_credentials=True,
        allow_methods=["*"],  # Allow all methods
        allow_headers=["*"],  # Allow all headers
    )

    @app.get("/")
    def read_root() -> dict[str, str]:
        return {"message": "raph-meris backend is running"}

    app.include_router(health_router)
    app.include_router(projects_router)
    app.include_router(tasks_router)
    app.include_router(goals_router)
    app.include_router(daily_logs_router)
    app.include_router(appreciations_router)

    return app


app = create_app()

# Made with Bob
