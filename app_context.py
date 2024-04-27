from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import database.database_variables as database_variables

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{database_variables.DB_USER}:{database_variables.DB_PASSWORD}@localhost/{database_variables.DB_NAME}'
db = SQLAlchemy(app)
