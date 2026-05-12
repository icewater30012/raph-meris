from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    priority: Mapped[str] = mapped_column(String(50), nullable=False, default="medium")
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="in-progress")
    
    # Additional project details
    target_client: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ibm_products: Mapped[str | None] = mapped_column(Text, nullable=True)
    next_action: Mapped[str | None] = mapped_column(Text, nullable=True)
    background: Mapped[str | None] = mapped_column(Text, nullable=True)
    business_partner: Mapped[str | None] = mapped_column(String(255), nullable=True)
    delivery: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    
    # Relationship to daily logs
    daily_logs: Mapped[list["DailyLog"]] = relationship(
        "DailyLog", back_populates="project", cascade="all, delete-orphan"
    )
    
    # Relationship to appreciations
    appreciations: Mapped[list["Appreciation"]] = relationship(
        "Appreciation", back_populates="project", cascade="all, delete-orphan"
    )

# Made with Bob
