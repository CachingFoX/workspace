from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse

from backend.settings import ApiSettings
from backend.dependencies import get_settings, get_only_basename
import os

router = APIRouter(
    prefix="/images",
    tags=["images"],
)


# CRUD
@router.get("/{filename}")
async def get_image(
    safe_filename: str = Depends(get_only_basename("filename")),
    settings: ApiSettings = Depends(get_settings),
):
    file_path = os.path.join(settings.upload_path, safe_filename)

    # Prüfen, ob die Datei existiert
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=f"File {safe_filename} not found")

    # Datei zurückgeben
    return FileResponse(file_path)
