from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.models import modelTrackable
from backend.schemas.trackable import (
    TrackableRead as schemaTrackableRead,
    TrackableUpdate as schemaTrackableUpdate,
    TrackableCreate as schemaTrackableCreate,
)
from backend.crud.trackable import (
    _get_trackable_by_internal_id,
    _exists_trackable_by_tracking_number,
    _patch,
    _create,
    _remove,
)
from backend.database import get_db

router = APIRouter(
    prefix="/trackables",
    tags=["Trackables"],
)


@router.post(
    "/", response_model=schemaTrackableRead, status_code=status.HTTP_201_CREATED
)
def create_trackable(trackable: schemaTrackableCreate, db: Session = Depends(get_db)):
    # verify if private tracking code already in the database
    _exists_trackable_by_tracking_number(trackable.private_code, db)

    # verify if public tracking code already in the database
    _exists_trackable_by_tracking_number(trackable.public_code, db)

    # create new trackable
    return _create(trackable, db)


def listTransformHelper(cls, xlist):
    return [cls.from_orm_with_transform(item) for item in xlist]


@router.get("/", response_model=list[schemaTrackableRead])
def read_all_trackables(db: Session = Depends(get_db)):
    trackable = db.query(modelTrackable).all()
    return listTransformHelper(schemaTrackableRead, trackable)


@router.get("/{trackable_id}", response_model=schemaTrackableRead)
def read_trackable(trackable_id: int, db: Session = Depends(get_db)):
    trackables = _get_trackable_by_internal_id(trackable_id, db)
    return schemaTrackableRead.from_orm_with_transform(trackables)


@router.patch("/{trackable_id}", response_model=schemaTrackableRead)
def update_trackable(
    trackable_id: str,
    update: schemaTrackableUpdate,
    db: Session = Depends(get_db),
):
    trackable = _patch(trackable_id, update, db)
    return schemaTrackableRead.from_orm_with_transform(trackable)


@router.delete("/{trackable_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trackable(trackable_id: int, db: Session = Depends(get_db)):
    _remove(trackable_id, db)
