from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.schemas.trackable import (
    TrackableRead as schemaTrackableRead,
)
from backend.schemas import list_of_items_from_orm, schemaOwner
from backend.crud.owner import _get_trackable_by_owner, _get_all_owners
from backend.database import get_db

router = APIRouter(
    prefix="/owners",
    tags=["Owners"],
)


@router.get("/", response_model=list[schemaOwner])
def read_all_owners(db: Session = Depends(get_db)):
    owners = _get_all_owners(db)
    return list_of_items_from_orm(schemaOwner, owners)


@router.get("/{owner}/trackables", response_model=list[schemaTrackableRead])
def read_trackable(owner: str, db: Session = Depends(get_db)):
    trackable = _get_trackable_by_owner(owner, db)
    return list_of_items_from_orm(schemaTrackableRead, trackable)
