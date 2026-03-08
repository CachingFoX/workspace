from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.models import modelImage
from backend.crud.trackable import (
    _get_trackable_by_internal_id,
)
from sqlalchemy.exc import IntegrityError

def _delete_trackable_image(trackable_id: int, image_id: int, db: Session):
    # check if trackable_id exists
    trackable = _get_trackable_by_internal_id(trackable_id, db)

    # check if image_id exists
    image = _get_image_by_internal_id(image_id, db)

    if image.trackable_id != trackable.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trackable {trackable_id} has no image {image_id}.",
        )  

    db.delete(image)
    db.commit()

def _update_image(trackable_id, image_id, update, db):
    # check if trackable_id exists
    trackable = _get_trackable_by_internal_id(trackable_id, db)

    # check if image_id exists
    image = _get_image_by_internal_id(image_id, db)

    # check if image_id is associated with trackable_id
    if image.trackable_id != trackable.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trackable {trackable_id} has no image {image_id}.",
        )        
    try:
        image.rank = update.rank
        db.commit()
        db.refresh(image)
        return
    except ValueError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"{e}"
        )  # TODO status and detail



def _get_image_by_internal_id(image_id: int, db: Session) -> modelImage:
    """
    Returns an image data record referenced his internal database id

    :param image_id: Description
    :type image_id: int
    :param db: Description
    :type db: Session
    """
    image = db.get(modelImage, image_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with internal id '{image_id}' not found.",
        )
    return image