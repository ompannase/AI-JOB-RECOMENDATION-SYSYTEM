# backend/database/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .db import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    adzuna_id = Column(String, unique=True, index=True)  # unique job id from Adzuna
    title = Column(String, nullable=False)
    company = Column(String)
    location = Column(String)
    category = Column(String)
    salary_min = Column(Float)
    salary_max = Column(Float)
    contract_type = Column(String)
    url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
