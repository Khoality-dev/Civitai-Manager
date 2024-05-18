from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import JSONB
Base = declarative_base()


class Model(Base):
    __tablename__ = "models"

    id = Column("id", Integer, primary_key=True)
    model_id = Column("model_id", String(50))
    name = Column("name", String())
    type = Column("type", String(50))
    platform = Column("platform", String(50))
    request_url = Column("request_url", String())
    blob = Column("blob", JSONB)
    versions = relationship("Version", back_populates="model")

class Version(Base):
    __tablename__ = "versions"
    id = Column("id", Integer, primary_key=True)
    model_id = Column("model_id", Integer, ForeignKey(Model.id))
    version_id = Column("version_id", String(50))
    name = Column("name", String())
    type = Column("type", String(50))
    description = Column("description", String(), default="")
    positive_prompts = Column("positive_prompts", String())
    negative_prompts = Column("negative_prompts", String())
    custom_positive_prompts = Column("custom_positive_prompts", String())
    custom_negative_prompts = Column("custom_negative_prompts", String())
    blob = Column("blob", JSONB)
    model = relationship("Model", back_populates="versions")
