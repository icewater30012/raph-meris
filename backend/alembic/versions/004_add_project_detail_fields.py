"""add project detail fields

Revision ID: 004
Revises: 003
Create Date: 2026-05-08 09:24:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '004'
down_revision: Union[str, None] = '003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new columns to projects table
    op.add_column('projects', sa.Column('target_client', sa.String(length=255), nullable=True))
    op.add_column('projects', sa.Column('ibm_products', sa.Text(), nullable=True))
    op.add_column('projects', sa.Column('next_action', sa.Text(), nullable=True))


def downgrade() -> None:
    # Remove columns
    op.drop_column('projects', 'next_action')
    op.drop_column('projects', 'ibm_products')
    op.drop_column('projects', 'target_client')

# Made with Bob