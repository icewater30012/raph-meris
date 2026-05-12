from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
def get_tasks(
    category: str | None = None,
    completed: bool | None = None,
    db: Session = Depends(get_db),
):
    """Get all tasks with optional filters"""
    query = db.query(Task)
    
    if category:
        query = query.filter(Task.category == category)
    if completed is not None:
        query = query.filter(Task.completed == completed)
    
    tasks = query.order_by(Task.due_date.asc().nullslast(), Task.created_at.desc()).all()
    return tasks


@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get a specific task by ID"""
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task


@router.post("", response_model=TaskRead, status_code=201)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task"""
    task = Task(**task_data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)
):
    """Update an existing task"""
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()

# Made with Bob