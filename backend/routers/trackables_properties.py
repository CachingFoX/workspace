from fastapi import APIRouter
from backend.crud.property import _read_all_properties, _patch, _attach_new_property
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

router = APIRouter(
    prefix="/trackables/{trackable_id}/properties",
    tags=["Trackables Properties"],
)


@router.post("/", response_model=schemaTrackableProperty)
def create_property(
    newProperty: schemaTrackablePropertyNew,
    trackable_id: int,
    db: Session = Depends(get_db),
):
    result = _attach_new_property(trackable_id, newProperty, db)
    return result


@router.get("/", response_model=list[schemaTrackableProperty])
def read_all_properites(trackable_id: int, db: Session = Depends(get_db)):
    properties = _read_all_properties(trackable_id, db)
    return transformItems(schemaTrackableProperty, properties)


@router.patch(
    "/{trackable_property_id}", response_model=schemaTrackablePropertyResolved
)
def update_property(
    udpateProperty: schemaTrackablePropertyUpdate,
    trackable_id: int,
    trackable_property_id: int,
    db: Session = Depends(get_db),
):
    trackableProperty = _patch(trackable_property_id, udpateProperty.property_value, db)
    return schemaTrackablePropertyResolved.from_orm(trackableProperty)


"""
@router.delete("/{trackable_property_id}", status_code=204)
def dettach_tag(
    trackable_id: str,
    tag_id: int,
    db: Session = Depends(get_db),
):
    # check if trackable exists
    trackable = _get_trackable_by_internal_id(
        trackable_id, db
    )  # TODO gibt es nicht inzwischen eine bessere funktion dafür

    # TODO check if tag exists
    tag = _exists_tag(tag_id, db)

    relation = (
        db.query(modelTrackableTag)
        .filter(
            and_(
                modelTrackableTag.trackable_id == trackable_id,
                modelTrackableTag.tag_id == tag_id,
            )
        )
        .first()
    )

    if not relation:
        raise HTTPException(
            status_code=404,
            detail="Tag '{tag_id}' is not attached to '{trackable_id}'.",
        )

    db.delete(relation)
    db.commit()
"""
