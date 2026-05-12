from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class DailyLogCreate(BaseModel):
    log_date: date
    raw_text: str
    project_id: int | None = None


class DailyLogUpdate(BaseModel):
    log_date: date | None = None
    raw_text: str | None = None
    project_id: int | None = None


class DailyLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    log_date: date
    raw_text: str
    project_id: int | None
    created_at: datetime
    updated_at: datetime

# Made with Bob
