from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
import hashlib
import logging
from config import Config  # Import the Config class

logging.basicConfig(level=logging.DEBUG)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)  # Load config settings
CORS(app)  # Allow CORS for cross-origin requests

# SQL Server connection using the SQLALCHEMY_DATABASE_URI from the config
conn = pyodbc.connect(app.config['SQLALCHEMY_DATABASE_URI'][len('mssql+pyodbc:///?odbc_connect='):])

# Utility function to hash passwords
def hash_password(Password):
    return hashlib.sha256(Password.encode()).hexdigest()

# Route to register a user
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    logging.debug("Received data: %s", data)  # Log incoming data

    # Validate input data
    if not all(key in data for key in ['Name', 'Surname', 'Email', 'CountryCode', 'Cellphone', 'Country', 'Password']):
        return jsonify({"error": "All fields are required."}), 400

    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO Users (Name, Surname, Email, CountryCode, Cellphone, Country, Password)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            data['Name'], data['Surname'], data['Email'], data['CountryCode'],
            data['Cellphone'], data['Country'], hash_password(data['Password'])  # Include hashed password
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        # Print error for debugging
        logging.error("Error occurred: %s", e)
        return jsonify({"error": str(e)}), 500
    
# Route to login a user
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Check if data is not None and contains required keys
    if data is None or not all(key in data for key in ['Email', 'Password']):
        return jsonify({"error": "Email and Password are required."}), 400

    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM Users WHERE Email=? AND Password=?",
            data['Email'], hash_password(data['Password'])
        )
        user = cursor.fetchone()

        if user:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        logging.error("Error occurred during login: %s", e)
        return jsonify({"error": "An error occurred during login."}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
