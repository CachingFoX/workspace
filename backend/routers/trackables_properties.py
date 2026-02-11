from fastapi import APIRouter
from backend.crud.property import (
    _read_all_properties,
    _patch,
    _attach_new_property,
    _delete_trackable_property,
)
from fastapi import Depends
from backend.schemas import (
    schemaTrackableProperty,
    schemaTrackablePropertyResolved,
    transformItems,
    schemaTrackablePropertyNew,
    schemaTrackablePropertyUpdate,
)
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.crud.trackable import _get_trackable_by_internal_id as exists_trackable

router = APIRouter(
    prefix="/trackables/{trackable_id}/properties",
    tags=["Trackables Properties"],
)


@router.post("", response_model=schemaTrackableProperty)
def create_trackableproperty(
    newProperty: schemaTrackablePropertyNew,
    trackable_id: int,
    db: Session = Depends(get_db),
):
    exists_trackable(trackable_id, db)
    return _attach_new_property(trackable_id, newProperty, db)


@router.get("", response_model=list[schemaTrackableProperty])
def read_all_trackable_properites(trackable_id: int, db: Session = Depends(get_db)):
    properties = _read_all_properties(trackable_id, db)
    return transformItems(schemaTrackableProperty, properties)


@router.patch(
    "/{trackable_property_id}", response_model=schemaTrackablePropertyResolved
)
def update_trackable_property(
    udpateProperty: schemaTrackablePropertyUpdate,
    trackable_id: int,
    trackable_property_id: int,
    db: Session = Depends(get_db),
):
    trackableProperty = _patch(
        trackable_id, trackable_property_id, udpateProperty.property_value, db
    )
    return schemaTrackablePropertyResolved.from_orm(trackableProperty)


@router.delete("/{trackable_property_id}", status_code=204)
def delete_trackable_property(
    trackable_id: int,
    trackable_property_id: int,
    db: Session = Depends(get_db),
):
    _delete_trackable_property(trackable_id, trackable_property_id, db)
