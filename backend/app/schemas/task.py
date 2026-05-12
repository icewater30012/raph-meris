from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    category: str
    priority: str = "medium"
    status: str = "pending"
    due_date: datetime | None = None
    completed: bool = False


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    priority: str | None = None
    status: str | None = None
    due_date: datetime | None = None
    completed: bool | None = None


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    category: str
    priority: str
    status: str
    due_date: datetime | None
    completed: bool
    created_at: datetime
    updated_at: datetime

# Made with Bob