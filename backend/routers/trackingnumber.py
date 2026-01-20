from fastapi import APIRouter, Depends
from backend.schemas import trackable as schemaTrackable
from crud.trackable import _get_trackable_by_tracking_number
from sqlalchemy.orm import Session

# from dependencies import DbSession
from backend.database import get_db

router = APIRouter(
    prefix="/trackingnumber",
    tags=["Tracking Number"],
)


@router.get("/{tracking_number}", response_model=schemaTrackable.TrackableRead)
async def read_trackable_by_tracking_number(
    tracking_number: str, db: Session = Depends(get_db)
):
    return _get_trackable_by_tracking_number(tracking_number, db)
