"""add appreciations table

Revision ID: 007
Revises: 006
Create Date: 2026-05-11 18:49:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '007'
down_revision: Union[str, None] = '006'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create appreciations table
    op.create_table(
        'appreciations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('person_name', sa.String(length=255), nullable=False),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('appreciation_date', sa.Date(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_appreciations_id'), 'appreciations', ['id'], unique=False)


def downgrade() -> None:
    # Drop appreciations table
    op.drop_index(op.f('ix_appreciations_id'), table_name='appreciations')
    op.drop_table('appreciations')

# Made with Bob