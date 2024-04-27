from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Model(Base):
    __tablename__ = "models"
    
    id = Column("id", Integer, primary_key=True)
    name = Column("name", String(100))
    type = Column("type", String(50))
    source_url = Column("source_url", String())
    checksum = Column("checksum", String())
    platform = Column("platform", String(50))
    description = Column("description", String(), default="")
    activation_words = Column("activation_words", String())
    custom_activation_words = Column("custom_activation_words", String())
    blob = Column("blob", String())
