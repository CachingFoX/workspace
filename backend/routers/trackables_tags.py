from fastapi import APIRouter, HTTPException, Depends
from backend.models import modelTag, modelTrackableTag
from backend.schemas import (
    schemaTrackableTagOut,
    schemaTagId,
    schemaAttachedTag,
    transformAttachedTags,
)
from sqlalchemy import and_
from sqlalchemy.orm import Session
from backend.crud.trackable import _get_trackable_by_internal_id
from backend.crud.tag import _exists_tag
from backend.database import get_db

router = APIRouter(
    prefix="/trackables/{trackable_id}/tags",
    tags=["Trackables-Tags relation"],
)


@router.post("/", response_model=schemaTrackableTagOut)
def attach_tag(
    newTag: schemaTagId,
    trackable_id: int,
    db: Session = Depends(get_db),
):
    trackable = _get_trackable_by_internal_id(trackable_id, db)

    # prüfen ob Tag existiert
    # TODO stimmt das so - prüfe ich hier wirklicho b der tag schon existiert oder noch nicht existiert
    # TODO stimmt das so - newTag.id odr newTag.tag_id  und if not tag oder if tag
    tag = db.get(modelTag, newTag.id)
    if not tag:
        raise HTTPException(status_code=404, detail=f"Tag '{newTag.tag_id}' not found")

    """
    # prüfen, ob Relation schon existiert
    existing = db.get(modelTrackableTag, (newTag.trackable_id, newTag.tag_id))
    if existing:
        raise HTTPException(status_code=400, detail="Relation already exists")
    """

    link = modelTrackableTag(trackable_id=trackable.id, tag_id=newTag.id, hidden=False)
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


@router.get("/", response_model=list[schemaAttachedTag])
def read_all_tags(trackable_id: int, db: Session = Depends(get_db)):
    trackable = _get_trackable_by_internal_id(trackable_id, db)
    return transformAttachedTags(trackable.tags, True)


@router.delete("/{tag_id}", status_code=204)
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
