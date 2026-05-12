from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GoalCreate(BaseModel):
    title: str
    description: str | None = None
    category: str
    target_date: datetime | None = None
    progress: int = Field(default=0, ge=0, le=100)
    completed: bool = False


class GoalUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    target_date: datetime | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    completed: bool | None = None


class GoalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    category: str
    target_date: datetime | None
    progress: int
    completed: bool
    created_at: datetime
    updated_at: datetime

# Made with Bob