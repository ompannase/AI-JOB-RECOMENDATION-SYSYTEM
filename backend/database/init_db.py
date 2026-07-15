# backend/database/init_db.py
from db import Base, engine
import models

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized: jobs table created.")

if __name__ == "__main__":
    init_db()
