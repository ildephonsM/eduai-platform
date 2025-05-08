# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
import hashlib
import logging
from datetime import datetime
import re
from functools import wraps

# Enhanced logging configuration
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Load configuration
class Config:
    SQLALCHEMY_DATABASE_URI = (
        'mssql+pyodbc:///?odbc_connect=' +
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=DESKTOP-VDSHPJH\\SQLEXPRESS;'  # Update with your server/instance
        'DATABASE=EducAI;'  # Update with your database name
        'Trusted_Connection=yes;'
    )
    SECRET_KEY = '3ff4cfa9a5cc2102b457dd13e087e6fe0b47ec7922900449b50f6353eed43dc4'  # For session management
    
app.config.from_object(Config)
CORS(app)

# Database connection management
class DatabaseConnection:
    @staticmethod
    def get_connection():
        try:
            conn_str = app.config['SQLALCHEMY_DATABASE_URI'][len('mssql+pyodbc:///?odbc_connect='):]
            return pyodbc.connect(conn_str)
        except Exception as e:
            logger.error(f"Database connection error: {str(e)}")
            raise

# Utility functions
def hash_password(password):
    """Hash password using SHA-256"""
    if not isinstance(password, str):
        raise ValueError("Password must be a string")
    return hashlib.sha256(password.encode()).hexdigest()

# Validation functions
class Validator:
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    @staticmethod
    def validate_phone(phone):
        """Validate phone number (9 digits)"""
        return bool(re.match(r'^\d{9}$', phone))

    @staticmethod
    def validate_name(name):
        """Validate name (letters and spaces only)"""
        return bool(re.match(r'^[A-Za-z\s]+$', name))

    @staticmethod
    def validate_country_code(code):
        """Validate country code"""
        return bool(re.match(r'^[A-Z]{2}$', code))

def validate_registration_data(data):
    """Validate all registration data"""
    if not data:
        return False, "No data provided"

    required_fields = {
        'Name': Validator.validate_name,
        'Surname': Validator.validate_name,
        'Email': Validator.validate_email,
        'CountryCode': Validator.validate_country_code,
        'Cellphone': Validator.validate_phone,
        'Country': Validator.validate_name,
        'Password': lambda x: len(x) >= 8  # Password length validation
    }

    # Check for missing fields
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"

    # Validate each field
    for field, validator in required_fields.items():
        if not data[field]:
            return False, f"{field} cannot be empty"
        if not validator(data[field]):
            return False, f"Invalid {field} format"

    return True, None

# Decorator for database operations
def with_db_connection(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        conn = None
        try:
            conn = DatabaseConnection.get_connection()
            return f(conn, *args, **kwargs)
        except Exception as e:
            logger.error(f"Database operation error: {str(e)}")
            raise
        finally:
            if conn:
                conn.close()
    return decorated_function

# Routes
@app.route('/register', methods=['POST'])
@with_db_connection
def register(conn):
    """Handle user registration"""
    try:
        data = request.json
        logger.info(f"Received registration request for email: {data.get('Email', 'No email provided')}")

        # Normalize data
        data['Email'] = data['Email'].lower().strip()
        data['Name'] = data['Name'].strip()
        data['Surname'] = data['Surname'].strip()
        data['Cellphone'] = data['Cellphone'].strip()

        logger.debug(f"Checking for existing email: {data['Email']}")

        cursor = conn.cursor()

        # Check if email already exists
        try:
            cursor.execute("SELECT Email FROM Users WHERE Email = ?", (data['Email'],))
            existing_email = cursor.fetchone()
        except Exception as e:
            logger.error(f"Error checking for existing email: {str(e)}")
            return jsonify({"error": "An error occurred while checking for existing email"}), 500

        if existing_email:
            logger.warning(f"Registration failed: Email already exists - {data['Email']}")
            return jsonify({"error": "Email already exists"}), 409

        # Insert new user
        insert_query = """
            INSERT INTO Users (
                Name, 
                Surname, 
                Email, 
                CountryCode, 
                Cellphone, 
                Country, 
                Password,
                CreatedAt,
                UpdatedAt,
                IsActive
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        current_time = datetime.utcnow()
        insert_values = (
            data['Name'],
            data['Surname'],
            data['Email'],
            data['CountryCode'],
            data['Cellphone'],
            data['Country'],
            hash_password(data['Password']),
            current_time,
            current_time,
            True  # IsActive flag
        )

        logger.debug("Executing user insertion")
        cursor.execute(insert_query, insert_values)
        conn.commit()

        logger.info(f"User registered successfully: {data['Email']}")
        return jsonify({
            "message": "User registered successfully",
            "email": data['Email']
        }), 201

    except ValueError as e:
        logger.error(f"Value error during registration: {str(e)}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/login', methods=['POST'])
@with_db_connection
def login(conn):
    """Handle user login"""
    try:
        data = request.json
        logger.info(f"Received login attempt for email: {data.get('Email', 'No email provided')}")

        # Validate login data
        # if not data or 'Email' not in data or 'Password' not in data:
        #     return jsonify({"error": "Email and Password are required"}), 400

        # Normalize email
        email = data['Email'].lower().strip()

        cursor = conn.cursor()
        
        # Query user with active status check
        cursor.execute(""" 
            SELECT Id, Name, Email, IsActive 
            FROM Users 
            WHERE Email = ? AND Password = ? AND IsActive = 1
        """, (email, hash_password(data['Password'])))
        
        user = cursor.fetchone()
        
        if user:
            logger.info(f"Successful login for user: {email}")
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user.Id,
                    "name": user.Name,
                    "email": user.Email
                }
            }), 200
        else:
            logger.warning(f"Failed login attempt for user: {email}")
            return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
