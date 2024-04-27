import psycopg2
from psycopg2 import OperationalError
import database.database_variables as database_variables

def create_database(dbname, user, password, host="localhost", port="5432"):
    connection = None
    try:
        # Connect to the default PostgreSQL database
        connection = psycopg2.connect(
            dbname="postgres",
            user=user,
            password=password,
            host=host,
            port=port
        )
        connection.autocommit = True
        cursor = connection.cursor()

        # Create the new database
        cursor.execute(f"CREATE DATABASE {dbname};")
        print(f"Database '{dbname}' created successfully!")

    except OperationalError as e:
        print(f"Error: {e}")
    finally:
        # Close the connection
        if connection:
            cursor.close()
            connection.close()

# Database configuration
dbname = database_variables.DB_NAME
user = database_variables.DB_USER
password = database_variables.DB_PASSWORD

# Create the database
create_database(dbname, user, password)