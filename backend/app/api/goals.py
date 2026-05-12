from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalRead, GoalUpdate

router = APIRouter(prefix="/api/goals", tags=["goals"])


@router.get("", response_model=list[GoalRead])
def get_goals(
    category: str | None = None,
    completed: bool | None = None,
    db: Session = Depends(get_db),
):
    """Get all goals with optional filters"""
    query = db.query(Goal)
    
    if category:
        query = query.filter(Goal.category == category)
    if completed is not None:
        query = query.filter(Goal.completed == completed)
    
    goals = query.order_by(Goal.target_date.asc().nullslast(), Goal.created_at.desc()).all()
    return goals


@router.get("/{goal_id}", response_model=GoalRead)
def get_goal(goal_id: int, db: Session = Depends(get_db)):
    """Get a specific goal by ID"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    return goal


@router.post("", response_model=GoalRead, status_code=201)
def create_goal(goal_data: GoalCreate, db: Session = Depends(get_db)):
    """Create a new goal"""
    goal = Goal(**goal_data.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.put("/{goal_id}", response_model=GoalRead)
def update_goal(
    goal_id: int, goal_data: GoalUpdate, db: Session = Depends(get_db)
):
    """Update an existing goal"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = goal_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
    
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=204)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    """Delete a goal"""
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(goal)
    db.commit()

# Made with Bob