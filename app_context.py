from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import database.database_configs as database_configs

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{database_configs.DB_USER}:{database_configs.DB_PASSWORD}@localhost/{database_configs.DB_NAME}'
db = SQLAlchemy(app)
