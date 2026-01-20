from fastapi import APIRouter, Depends
from backend.dependencies import get_settings, get_version
from backend.settings import ApiSettings


router = APIRouter(prefix="")


@router.get("/")
async def read_root(
    settings: ApiSettings = Depends(get_settings), version: str = Depends(get_version)
):
    return {
        "version": version,
        "database_url": settings.database_url,
        "upload_path": settings.upload_path,
    }
