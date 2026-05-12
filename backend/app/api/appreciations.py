from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.appreciation import Appreciation
from app.schemas.appreciation import AppreciationCreate, AppreciationRead, AppreciationUpdate

router = APIRouter(prefix="/api/appreciations", tags=["appreciations"])


@router.get("", response_model=list[AppreciationRead])
def list_appreciations(
    project_id: int | None = None,
    sort_order: str = "desc",
    db: Session = Depends(get_db),
) -> list[AppreciationRead]:
    query = db.query(Appreciation)
    
    # Filter by project_id if provided
    if project_id is not None:
        query = query.filter(Appreciation.project_id == project_id)
    
    # Apply sorting
    if sort_order == "asc":
        query = query.order_by(Appreciation.appreciation_date.asc())
    else:
        query = query.order_by(Appreciation.appreciation_date.desc())
    
    appreciations = query.all()
    return [AppreciationRead.model_validate(appreciation) for appreciation in appreciations]


@router.get("/{appreciation_id}", response_model=AppreciationRead)
def get_appreciation(appreciation_id: int, db: Session = Depends(get_db)) -> AppreciationRead:
    appreciation = db.query(Appreciation).filter(Appreciation.id == appreciation_id).first()
    if not appreciation:
        raise HTTPException(status_code=404, detail="Appreciation not found")
    return AppreciationRead.model_validate(appreciation)


@router.post("", response_model=AppreciationRead, status_code=status.HTTP_201_CREATED)
def create_appreciation(
    payload: AppreciationCreate,
    db: Session = Depends(get_db),
) -> AppreciationRead:
    appreciation = Appreciation(
        person_name=payload.person_name,
        reason=payload.reason,
        appreciation_date=payload.appreciation_date,
        project_id=payload.project_id,
    )
    db.add(appreciation)
    db.commit()
    db.refresh(appreciation)
    return AppreciationRead.model_validate(appreciation)


@router.put("/{appreciation_id}", response_model=AppreciationRead)
def update_appreciation(
    appreciation_id: int,
    payload: AppreciationUpdate,
    db: Session = Depends(get_db),
) -> AppreciationRead:
    appreciation = db.query(Appreciation).filter(Appreciation.id == appreciation_id).first()
    if not appreciation:
        raise HTTPException(status_code=404, detail="Appreciation not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appreciation, field, value)
    
    db.commit()
    db.refresh(appreciation)
    return AppreciationRead.model_validate(appreciation)


@router.delete("/{appreciation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appreciation(appreciation_id: int, db: Session = Depends(get_db)) -> None:
    appreciation = db.query(Appreciation).filter(Appreciation.id == appreciation_id).first()
    if not appreciation:
        raise HTTPException(status_code=404, detail="Appreciation not found")
    
    db.delete(appreciation)
    db.commit()

# Made with Bob