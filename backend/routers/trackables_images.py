import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends
from backend.models import modelImage
from backend.schemas import schemaImageEmbbed
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.settings import ApiSettings
from backend.dependencies import get_settings
from backend.crud.trackable import (
    _get_trackable_by_internal_id,
)
from backend.crud.image import (
    _delete_trackable_image,
)


router = APIRouter(
    prefix="/trackables/{trackable_id}/images",
    tags=["Trackables-Image Relation"],
)


@router.get(
    "/",
    response_model=list[schemaImageEmbbed],
)
def read_images(trackable_id: str, db: Session = Depends(get_db)):
    trackable = _get_trackable_by_internal_id(trackable_id, db)
    return trackable.images


@router.post(
    "/",
    response_model=list[schemaImageEmbbed],
)
async def upload_images(
    trackable_id: str,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    settings: ApiSettings = Depends(get_settings),
):
    trackable = _get_trackable_by_internal_id(trackable_id, db)

    uploaded_files = []
    for file in files:
        # UUID für Datei
        file_id = str(uuid.uuid4()).lower()
        extension = os.path.splitext(file.filename)[1].lower()  # z.B. ".png"
        file_path = os.path.join(settings.upload_path, file_id + extension)

        # Datei speichern
        with open(file_path, "wb") as f:
            f.write(await file.read())

        image = modelImage(
            trackable_id=trackable.id,
            filename=file_id + extension,
            comment="",
            gallery=False,
        )
        db.add(image)
        db.commit()
        db.refresh(image)

        uploaded_files.append(image)

    return uploaded_files


@router.delete("/{trackable_image_id}", status_code=204)
def delete_trackable_property(
    trackable_id: int,
    trackable_image_id: int,
    db: Session = Depends(get_db),
):
    _delete_trackable_image(trackable_id, trackable_image_id, db)
