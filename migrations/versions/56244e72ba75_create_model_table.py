"""create_model_table

Revision ID: 56244e72ba75
Revises: 
Create Date: 2024-04-27 12:47:30.641170

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '56244e72ba75'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'models',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('source_url', sa.String(), nullable=False),
        sa.Column('checksum', sa.String(), nullable=False),
        sa.Column('platform', sa.String(50), nullable=False),
        sa.Column('descriptions', sa.String(), nullable=False, default=""),
        sa.Column('activation_words', sa.String(), nullable=False, default=""),
        sa.Column('custom_activation_words', sa.String())
    )



def downgrade() -> None:
    op.drop_table('models')
