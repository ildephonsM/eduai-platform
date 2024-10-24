import os

class Config:
    DEBUG = os.getenv('DEBUG', False)
    # SQLAlchemy URI for connecting to SQL Server using pyodbc
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        'mssql+pyodbc:///?odbc_connect=' + 
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-VDSHPJH\\SQLEXPRESS;'  # your server name / instance
        'DATABASE=EducAI;'  # your database name
        'Trusted_Connection=yes;'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
