"""remove name length limit

Revision ID: aa4906365aa3
Revises: d8b0bd8ca3cf
Create Date: 2024-05-17 21:40:43.489870

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa4906365aa3'
down_revision: Union[str, None] = 'd8b0bd8ca3cf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
