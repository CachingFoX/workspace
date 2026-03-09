from backend.database import get_db
from backend.dependencies import get_settings, get_version
from backend.settings import ApiSettings
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.exc import DatabaseError
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="")


@router.get("/")
async def read_root(
    settings: ApiSettings = Depends(get_settings),
    version: str = Depends(get_version),
    db: Session = Depends(get_db),
):
    integrity_check_result = False
    try:
        result = db.execute(text("PRAGMA integrity_check;")).scalar()
        integrity_check_result = True if result == "ok" else False
    except DatabaseError:
        integrity_check_result = False

    if integrity_check_result:
        logger.info(f"PRAGMA integrity_check: {integrity_check_result}")
    else:
        logger.error(f"PRAGMA integrity_check: {integrity_check_result}")

    return {
        "api": {
            "version": version,
            "name": settings.short_name,
            "upload_path": settings.upload_path,
        },
        "database": {
            "url": settings.database_url,
            "integrity": integrity_check_result,
        },
        # obsolete
        "version": version,
        "short_name": settings.short_name,
        "database_url": settings.database_url,
        "upload_path": settings.upload_path,
    }
