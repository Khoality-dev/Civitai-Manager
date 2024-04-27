from app_context import db

class Model(db.Model):
    __tablename__ = 'models'
    
    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(100), nullable=False)
    source_url = db.Column("source_url", db.String(-1), nullable=False)
    checksum = db.Column("checksum", db.String(-1), nullable=False)
    platform = db.Column("platform", db.String(50), nullable=False)
    descriptions = db.Column('descriptions', db.String(-1), nullable=False, default="")
    activation_words = db.Column('activation_words', db.String(-1), nullable=False, default="")
    custom_activation_words = db.Column('custom_activation_words', db.String(-1))