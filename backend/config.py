# config.py
import os
from dotenv import load_dotenv

# Move up one level to the root folder and load the .env file
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)  # Load the .env file

class Config:
    """Configuration class for Flask app."""
    
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # SQLAlchemy URI for connecting to SQL Server with pyodbc
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'mssql+pyodbc:///?odbc_connect=' +
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-VDSHPJH\\SQLEXPRESS;'  # Update with your server/instance
        'DATABASE=EducAI;'  # Update with your database name
        'Trusted_Connection=yes;'
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = '3ff4cfa9a5cc2102b457dd13e087e6fe0b47ec7922900449b50f6353eed43dc4'  # For session management
