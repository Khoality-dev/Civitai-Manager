"""add date time columns

Revision ID: 1092dc3e655b
Revises: 44a761199a9f
Create Date: 2024-06-16 11:06:01.132687

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1092dc3e655b'
down_revision: Union[str, None] = '44a761199a9f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('models', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('models', sa.Column('updated_at', sa.DateTime(), nullable=True))
    op.add_column('versions', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('versions', sa.Column('updated_at', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('versions', 'updated_at')
    op.drop_column('versions', 'created_at')
    op.drop_column('models', 'updated_at')
    op.drop_column('models', 'created_at')
    # ### end Alembic commands ###
