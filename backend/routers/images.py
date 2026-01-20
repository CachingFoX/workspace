from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
import os
from settings import ApiSettings
from dependencies import get_settings

router = APIRouter(
    prefix="/images",
    tags=["images"],
)


# CRUD


@router.get("/{filename}")
async def get_image(filename: str, settings: ApiSettings = Depends(get_settings)):
    # Nur den Basisnamen nehmen, um Pfadmanipulation zu verhindern
    safe_filename = os.path.basename(filename)

    file_path = os.path.join(settings.upload_path, safe_filename)

    file_path = file_path.lower()

    # Prüfen, ob die Datei existiert
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Datei zurückgeben
    return FileResponse(file_path)
