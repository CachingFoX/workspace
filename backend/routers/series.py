from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.schemas.trackable import (
    TrackableRead as schemaTrackableRead,
)
from backend.schemas import list_of_items_from_orm, schemaSeries
from backend.crud.series import _get_trackable_by_series, _get_all_series
from backend.database import get_db

router = APIRouter(
    prefix="/series",
    tags=["Series"],
)


@router.get("/", response_model=list[schemaSeries])
def read_all_series(db: Session = Depends(get_db)):
    owners = _get_all_series(db)
    return list_of_items_from_orm(schemaSeries, owners)


@router.get("/{series}/trackables", response_model=list[schemaTrackableRead])
def read_trackable(series: str, db: Session = Depends(get_db)):
    trackable = _get_trackable_by_series(series, db)
    return list_of_items_from_orm(schemaTrackableRead, trackable)
