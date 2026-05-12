from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class AppreciationCreate(BaseModel):
    person_name: str
    reason: str
    appreciation_date: date
    project_id: int | None = None


class AppreciationUpdate(BaseModel):
    person_name: str | None = None
    reason: str | None = None
    appreciation_date: date | None = None
    project_id: int | None = None


class AppreciationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    person_name: str
    reason: str
    appreciation_date: date
    project_id: int | None
    created_at: datetime
    updated_at: datetime

# Made with Bob