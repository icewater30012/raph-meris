"""add project progress fields

Revision ID: 002
Revises: 001
Create Date: 2026-05-08 16:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add progress tracking fields to projects table
    op.add_column('projects', sa.Column('progress_percentage', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('projects', sa.Column('current_phase', sa.String(length=255), nullable=True))
    op.add_column('projects', sa.Column('next_action', sa.Text(), nullable=True))


def downgrade() -> None:
    # Remove progress tracking fields from projects table
    op.drop_column('projects', 'next_action')
    op.drop_column('projects', 'current_phase')
    op.drop_column('projects', 'progress_percentage')

# Made with Bob
