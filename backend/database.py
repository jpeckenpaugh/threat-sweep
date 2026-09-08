import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

DB_PATH = os.getenv("THREAT_SWEEP_DB", str(Path(__file__).with_name("threat_sweep.db")))
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def initialize_database():
    Base.metadata.create_all(engine)
