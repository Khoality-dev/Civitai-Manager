from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Model(Base):
    __tablename__ = "models"

    id = Column("id", Integer, primary_key=True)
    model_id = Column("model_id", String(50))
    name = Column("name", String(100))
    type = Column("type", String(50))
    platform = Column("platform", String(50))
    request_url = Column("request_url", String())
    blob = Column("blob", String())


class Version(Base):
    __tablename__ = "versions"

    id = Column("id", Integer, primary_key=True)
    model_id = Column("model_id", Integer, ForeignKey(Model.id))
    version_id = Column("version_id", String(50))
    name = Column("name", String(100))
    type = Column("type", String(50))
    file_checksum = Column("file_checksum", String())
    description = Column("description", String(), default="")
    activation_words = Column("activation_words", String())
    custom_activation_words = Column("custom_activation_words", String())
    blob = Column("blob", String())
