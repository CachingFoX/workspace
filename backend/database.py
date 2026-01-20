from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from backend.settings import ApiSettings
from urllib.parse import urlparse
from pathlib import Path
from backend.models import *
from backend.database2 import Base
import logging

logger = logging.getLogger(__name__)

__SessionLocal = None

logging.basicConfig(level=logging.INFO)

"""
 sqlite:///:memory: (or, sqlite://)
 sqlite:///relative/path/to/file.db
 sqlite:////absolute/path/to/file.db
"""


def create_sqlite_db_directory(database_url: str, base_dir: Path | None = None) -> Path:
    """
    Extrahiert das Verzeichnis einer SQLite-Datenbank aus einer URL.
    Unterstützt relative Pfade sowie sqlite+aiosqlite / SQLAlchemy URLs.
    """
    parsed = urlparse(database_url)

    # Scheme kann z.B. "sqlite" oder "sqlite+aiosqlite" sein
    if not parsed.scheme.startswith("sqlite"):
        raise ValueError("Nur SQLite-Datenbank-URLs werden unterstützt")

    path = parsed.path

    if path.startswith("/") and not database_url.startswith("sqlite:////"):
        path = path[1:]

    if path in ("", "/", ":memory:"):
        return database_url

    db_path = Path(path)

    # Relative Pfade auflösen
    absolute_path = db_path
    if not absolute_path.is_absolute():
        base = base_dir or Path.cwd()
        absolute_path = (base / db_path).resolve()

    if not absolute_path.parent.exists():
        absolute_path.parent.mkdir(parents=True)

    return "sqlite:///" + str(absolute_path)


def init_db(settings: ApiSettings):
    global __SessionLocal
    # create folder
    database_url = create_sqlite_db_directory(settings.database_url)

    logger.info(f"use database {database_url}")

    engine = create_engine(
        database_url,
        connect_args={"check_same_thread": False},
        poolclass=settings.poolclass,
    )

    __SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)


# Dependency
def get_db() -> Generator[Session, None, None]:
    global __SessionLocal
    db = __SessionLocal()
    try:
        yield db
    finally:
        db.close()
