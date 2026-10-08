from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DATABASE_URL = "sqlite:///./careerlens.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ─── MODELS ───────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String(100), nullable=False)
    email        = Column(String(100), unique=True, index=True, nullable=False)
    password     = Column(String(255), nullable=False)
    target_role  = Column(String(100), nullable=True)
    location     = Column(String(100), nullable=True)
    experience   = Column(Float, nullable=True)
    skills       = Column(Text, nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)
    last_login   = Column(DateTime, nullable=True)


class SavedAnalysis(Base):
    __tablename__ = "saved_analyses"

    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, nullable=False)
    type         = Column(String(50), nullable=False)  # resume, salary, career
    title        = Column(String(200), nullable=True)
    content      = Column(Text, nullable=False)
    created_at   = Column(DateTime, default=datetime.utcnow)


class SalaryPrediction(Base):
    __tablename__ = "salary_predictions"

    id               = Column(Integer, primary_key=True, index=True)
    user_id          = Column(Integer, nullable=False)
    role             = Column(String(100), nullable=False)
    experience       = Column(Float, nullable=False)
    predicted_salary = Column(Float, nullable=False)
    city             = Column(String(100), nullable=True)
    created_at       = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)