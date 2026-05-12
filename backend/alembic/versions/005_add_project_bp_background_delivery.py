"""add project bp background delivery

Revision ID: 005
Revises: 004
Create Date: 2026-05-11 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '005'
down_revision: Union[str, None] = '004'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new columns to projects table
    op.add_column('projects', sa.Column('background', sa.Text(), nullable=True))
    op.add_column('projects', sa.Column('business_partner', sa.String(length=255), nullable=True))
    op.add_column('projects', sa.Column('delivery', sa.String(length=255), nullable=True))


def downgrade() -> None:
    # Remove columns in reverse order
    op.drop_column('projects', 'delivery')
    op.drop_column('projects', 'business_partner')
    op.drop_column('projects', 'background')

# Made with Bob