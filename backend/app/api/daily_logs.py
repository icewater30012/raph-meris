from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.daily_log import DailyLog
from app.schemas.daily_log import DailyLogCreate, DailyLogRead, DailyLogUpdate

router = APIRouter(prefix="/api/daily-logs", tags=["daily-logs"])


@router.get("", response_model=list[DailyLogRead])
def list_daily_logs(
    project_id: int | None = None,
    sort_order: str = "desc",
    db: Session = Depends(get_db),
) -> list[DailyLogRead]:
    query = db.query(DailyLog)
    
    # Filter by project_id if provided
    if project_id is not None:
        query = query.filter(DailyLog.project_id == project_id)
    
    # Apply sorting
    if sort_order == "asc":
        query = query.order_by(DailyLog.log_date.asc())
    else:
        query = query.order_by(DailyLog.log_date.desc())
    
    daily_logs = query.all()
    return [DailyLogRead.model_validate(log) for log in daily_logs]


@router.get("/{log_id}", response_model=DailyLogRead)
def get_daily_log(log_id: int, db: Session = Depends(get_db)) -> DailyLogRead:
    daily_log = db.query(DailyLog).filter(DailyLog.id == log_id).first()
    if not daily_log:
        raise HTTPException(status_code=404, detail="Daily log not found")
    return DailyLogRead.model_validate(daily_log)


@router.post("", response_model=DailyLogRead, status_code=status.HTTP_201_CREATED)
def create_daily_log(
    payload: DailyLogCreate,
    db: Session = Depends(get_db),
) -> DailyLogRead:
    daily_log = DailyLog(
        log_date=payload.log_date,
        raw_text=payload.raw_text,
        project_id=payload.project_id,
    )
    db.add(daily_log)
    db.commit()
    db.refresh(daily_log)
    return DailyLogRead.model_validate(daily_log)


@router.put("/{log_id}", response_model=DailyLogRead)
def update_daily_log(
    log_id: int,
    payload: DailyLogUpdate,
    db: Session = Depends(get_db),
) -> DailyLogRead:
    daily_log = db.query(DailyLog).filter(DailyLog.id == log_id).first()
    if not daily_log:
        raise HTTPException(status_code=404, detail="Daily log not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(daily_log, field, value)
    
    db.commit()
    db.refresh(daily_log)
    return DailyLogRead.model_validate(daily_log)


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_daily_log(log_id: int, db: Session = Depends(get_db)) -> None:
    daily_log = db.query(DailyLog).filter(DailyLog.id == log_id).first()
    if not daily_log:
        raise HTTPException(status_code=404, detail="Daily log not found")
    
    db.delete(daily_log)
    db.commit()

# Made with Bob
