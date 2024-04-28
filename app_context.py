from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import database.database_configs as database_configs

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{database_configs.DB_USER}:{database_configs.DB_PASSWORD}@localhost/{database_configs.DB_NAME}'
db = SQLAlchemy(app)
