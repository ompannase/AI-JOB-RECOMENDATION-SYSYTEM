# backend/utils/config.py
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Adzuna credentials
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

# API endpoint
ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs"

# Database (optional for later)
DB_CONFIG = {
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "3306"),
    "database": os.getenv("DB_NAME", "job_recommender"),
}
