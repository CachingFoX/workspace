from sqlalchemy.orm import Session
from fastapi import HTTPException
from backend.models import modelImage

'''
def _read_all_properties(trackable_id: int, db: Session):
    exists_trackable(trackable_id, db)

    stmt = (
        select(
            modelTrackableProperty.id,
            modelTrackableProperty.text.label("PropertyValue"),
            modelProperty.id.label("PropertyId"),
            modelProperty.name.label("PropertyName"),
            modelProperty.type.label("PropertyType"),
        )
        .select_from(
            outerjoin(
                modelProperty,
                modelTrackableProperty,
                and_(
                    modelTrackableProperty.property_id == modelProperty.id,
                    modelTrackableProperty.trackable_id == bindparam("trackable_id"),
                ),
            )
        )
        .order_by(modelProperty.id)  # .nulls_last()
    )

    return db.execute(stmt, {"trackable_id": trackable_id}).mappings()  # , .all()


def _patch(
    trackable_id: int, trackable_property_id: int, value: str, db: Session
) -> modelTrackableProperty:
    trackable_property = db.get(modelTrackableProperty, trackable_property_id)
    if not trackable_property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trackable Property with id '{trackable_property_id}' not found.",
        )

    try:
        trackable_property.text = value

        db.commit()
        db.refresh(trackable_property)
        return trackable_property
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


def _attach_new_property(
    trackable_id: int, newProperty: schemaTrackablePropertyNew, db: Session
) -> schemaTrackableProperty:
    trackable = _get_trackable_by_internal_id(trackable_id, db)

    # prüfen ob Property existiert
    # TODO stimmt das so - prüfe ich hier wirklich ob der tag schon existiert oder noch nicht existiert
    property = db.get(modelProperty, newProperty.property_id)
    if not property:
        raise HTTPException(
            status_code=404, detail=f"Property '{newProperty.property_id}' not found"
        )

    """
    # TODO
    # prüfen, ob Relation schon existiert
    existing = db.get(modelTrackableTag, (newTag.trackable_id, newTag.tag_id))
    if existing:
        raise HTTPException(status_code=400, detail="Relation already exists")
    """

    # TODO prüfen ob die property zu trackable gehört

    trackableProperty = modelTrackableProperty(
        trackable_id=trackable.id,
        property_id=newProperty.property_id,
        text=newProperty.property_value,
    )
    db.add(trackableProperty)
    db.commit()
    db.refresh(trackableProperty)
    return trackableProperty
'''


def _delete_trackable_image(trackable_id: int, trackable_image_id: int, db: Session):
    trackable_image = db.get(modelImage, trackable_image_id)
    if not trackable_image:
        raise HTTPException(
            status_code=404,
            detail=f"Trackable property with id {trackable_image_id} does not exist.",
        )
    # TODO prüfen ob das image zu trackable gehört
    # TODO delete file from filesystem
    db.delete(trackable_image)
    db.commit()
