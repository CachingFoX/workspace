from backend.models import modelTrackable
from backend.schemas import (
    schemaTrackableRead,
    schemaTrackableCreate,
)
from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError


def __get_trackable_by_tracking_number(
    tracking_number: str, db: Session
) -> modelTrackable | None:
    """
    Returns a trackable data record referenced by his private or public tracking_number

    :param trackable_number: Description
    :type trackable_number: str
    :param db: Description
    :type db: Session
    """
    trackable_number = tracking_number.upper()
    trackable = (
        db.query(modelTrackable)
        .filter(
            or_(
                modelTrackable.public_code == trackable_number,
                modelTrackable.private_code == trackable_number,
            )
        )
        .first()
    )
    return trackable


def _get_trackable_by_tracking_number(
    tracking_number: str, db: Session
) -> modelTrackable:
    """
    Returns a trackable data record referenced by his private or public tracking_number

    :param trackable_number: Description
    :type trackable_number: str
    :param db: Description
    :type db: Session
    """
    trackable = __get_trackable_by_tracking_number(tracking_number, db)
    if not trackable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trackable '{tracking_number}' not found.",
        )
    return trackable


def _exists_trackable_by_tracking_number(tracking_number: str, db: Session) -> None:
    """
    Returns a trackable data record referenced by his private or public tracking_number

    :param trackable_number: Description
    :type trackable_number: str
    :param db: Description
    :type db: Session
    """
    if __get_trackable_by_tracking_number(tracking_number, db):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A trackable with '{tracking_number}' already exists",
        )


def _get_trackable_by_internal_id(trackable_id: int, db: Session) -> modelTrackable:
    """
    Returns a trackable data record referenced his internal database id

    :param trackable_id: Description
    :type trackable_id: int
    :param db: Description
    :type db: Session
    """
    trackable = db.get(modelTrackable, trackable_id)
    if not trackable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trackable with internal id '{trackable_id}' not found.",
        )
    return trackable


def _patch(
    trackable_id: int, update: schemaTrackableRead, db: Session
) -> modelTrackable:
    trackable = _get_trackable_by_internal_id(trackable_id, db)
    try:
        update_data = update.dict(exclude_unset=True)
        for key, value in update_data.items():
            print(key, value)
            setattr(trackable, key, value)  # Dynamisch setzen

        db.commit()
        db.refresh(trackable)
        return trackable
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


def _create(trackable: schemaTrackableCreate, db: Session) -> modelTrackable:
    try:
        trackable = modelTrackable(
            private_code=trackable.private_code,
            public_code=trackable.public_code,
            title=trackable.title,
            series=trackable.series,
            owner=trackable.owner,
            activated=trackable.activated,
            icon_url=trackable.icon_url,
        )

        db.add(trackable)
        db.commit()
        db.refresh(trackable)
        return trackable
    except ValueError as e:
        # ValidationError aus @validates abfangen
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Trackable already exist.",
        )  # TODO status, detail


def _remove(trackable_id: int, db: Session) -> None:
    trackable = _get_trackable_by_internal_id(trackable_id, db)
    db.delete(trackable)
    db.commit()
