from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.daily_log import DailyLog
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate, ProjectWithStats

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=list[ProjectWithStats])
def list_projects(
    status_filter: str | None = Query(None, description="Filter by status"),
    priority_filter: str | None = Query(None, description="Filter by priority"),
    sort_by: str | None = Query(None, description="Sort by field (name, priority, status, created_at)"),
    sort_order: str | None = Query("asc", description="Sort order (asc or desc)"),
    db: Session = Depends(get_db),
) -> list[ProjectWithStats]:
    query = db.query(Project)
    
    if status_filter:
        query = query.filter(Project.status == status_filter)
    if priority_filter:
        query = query.filter(Project.priority == priority_filter)
    
    # Apply sorting
    if sort_by == "priority":
        # Custom priority sorting: high > medium > low
        priority_order = case(
            (Project.priority == "high", 1),
            (Project.priority == "medium", 2),
            (Project.priority == "low", 3),
            else_=4
        )
        if sort_order == "desc":
            query = query.order_by(priority_order.desc())
        else:
            query = query.order_by(priority_order.asc())
    elif sort_by:
        sort_column = getattr(Project, sort_by, None)
        if sort_column is not None:
            if sort_order == "desc":
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())
        else:
            # Default sort by created_at desc if invalid sort_by
            query = query.order_by(Project.created_at.desc())
    else:
        # Default sort by created_at desc
        query = query.order_by(Project.created_at.desc())
    
    projects = query.all()
    
    # Add statistics for each project
    result = []
    for project in projects:
        # Count total logs for this project
        total_logs = db.query(func.count(DailyLog.id)).filter(
            DailyLog.project_id == project.id
        ).scalar() or 0
        
        # Get most recent log date
        recent_activity = db.query(func.max(DailyLog.log_date)).filter(
            DailyLog.project_id == project.id
        ).scalar()
        
        project_dict = ProjectRead.model_validate(project).model_dump()
        project_dict["total_logs"] = total_logs
        project_dict["recent_activity"] = recent_activity
        result.append(ProjectWithStats(**project_dict))
    
    return result


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)) -> ProjectRead:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectRead.model_validate(project)


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
) -> ProjectRead:
    project = Project(
        name=payload.name,
        description=payload.description,
        priority=payload.priority,
        status=payload.status,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return ProjectRead.model_validate(project)


@router.put("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
) -> ProjectRead:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    return ProjectRead.model_validate(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> None:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()

# Made with Bob
