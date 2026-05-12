from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    priority: str = "medium"
    status: str = "in-progress"
    target_client: str | None = None
    ibm_products: str | None = None
    next_action: str | None = None
    background: str | None = None
    business_partner: str | None = None
    delivery: str | None = None


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    priority: str | None = None
    status: str | None = None
    target_client: str | None = None
    ibm_products: str | None = None
    next_action: str | None = None
    background: str | None = None
    business_partner: str | None = None
    delivery: str | None = None


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    priority: str
    status: str
    target_client: str | None
    ibm_products: str | None
    next_action: str | None
    background: str | None
    business_partner: str | None
    delivery: str | None
    created_at: datetime
    updated_at: datetime


class ProjectWithStats(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    priority: str
    status: str
    target_client: str | None
    ibm_products: str | None
    next_action: str | None
    background: str | None
    business_partner: str | None
    delivery: str | None
    created_at: datetime
    updated_at: datetime
    total_logs: int = 0
    recent_activity: datetime | None = None

# Made with Bob
