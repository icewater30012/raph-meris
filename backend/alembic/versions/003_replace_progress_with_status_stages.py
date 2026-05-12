"""Replace progress with status stages

Revision ID: 003
Revises: 002
Create Date: 2026-05-08 16:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Update status column to use new values
    # First, update existing values to new status stages
    op.execute("""
        UPDATE projects 
        SET status = CASE 
            WHEN status = 'active' THEN 'in-progress'
            WHEN status = 'completed' THEN 'completed'
            WHEN status = 'on-hold' THEN 'pending'
            ELSE 'in-progress'
        END
    """)
    
    # Remove progress-related columns
    op.drop_column('projects', 'progress_percentage')
    op.drop_column('projects', 'current_phase')
    op.drop_column('projects', 'next_action')


def downgrade() -> None:
    # Add back progress-related columns
    op.add_column('projects', sa.Column('progress_percentage', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('projects', sa.Column('current_phase', sa.String(255), nullable=True))
    op.add_column('projects', sa.Column('next_action', sa.Text(), nullable=True))
    
    # Revert status values
    op.execute("""
        UPDATE projects 
        SET status = CASE 
            WHEN status = 'in-progress' THEN 'active'
            WHEN status = 'completed' THEN 'completed'
            WHEN status = 'pending' THEN 'on-hold'
            WHEN status = 'business-development' THEN 'active'
            WHEN status = 'future-plan' THEN 'on-hold'
            ELSE 'active'
        END
    """)

# Made with Bob