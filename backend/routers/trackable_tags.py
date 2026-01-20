from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from backend.database import get_db
from backend.models import modelTag, modelTrackable, modelTrackableTag
from backend.schemas import trackable_tag as schema


router = APIRouter(prefix="/trackable-tags", tags=["TrackableTags"])


# =========================
# CREATE: TrackableTag
# =========================
@router.post("/", response_model=schema.TrackableTagOut)
def create_trackable_tag(newTag: schema.TrackableTagIn, db: Session = Depends(get_db)):
    # prüfen ob Trackable existiert
    trackable = db.get(modelTrackable, newTag.trackable_id)
    if not trackable:
        raise HTTPException(status_code=404, detail="Trackable not found")

    # prüfen ob Tag existiert
    tag = db.get(modelTag, newTag.tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    """
    # prüfen, ob Relation schon existiert
    existing = db.get(modelTrackableTag, (newTag.trackable_id, newTag.tag_id))
    if existing:
        raise HTTPException(status_code=400, detail="Relation already exists")
    """

    link = modelTrackableTag(
        trackable_id=newTag.trackable_id, tag_id=newTag.tag_id, hidden=newTag.hidden
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


# =========================
# READ: Alle TrackableTags
# =========================
@router.get("/", response_model=List[schema.TrackableTagOut])
def read_all_trackable_tags(db: Session = Depends(get_db)):
    links = db.query(modelTrackableTag).options(joinedload(modelTrackableTag.tag)).all()
    return links


# =========================
# READ: einzelne TrackableTag
# =========================
@router.get("/{trackable_id}/{tag_id}", response_model=schema.TrackableTagOut)
def read_trackable_tag(trackable_id: int, tag_id: int, db: Session = Depends(get_db)):
    link = (
        db.query(modelTrackableTag)
        .options(joinedload(modelTrackableTag.tag))
        .filter_by(trackable_id=trackable_id, tag_id=tag_id)
        .first()
    )
    if not link:
        raise HTTPException(status_code=404, detail="Relation not found")
    return link


# =========================
# UPDATE: hidden
# =========================
@router.patch("/{trackable_id}/{tag_id}", response_model=schema.TrackableTagOut)
def update_trackable_tag_hidden(
    trackable_id: int, tag_id: int, hidden: bool, db: Session = Depends(get_db)
):
    link = db.get(modelTrackableTag, (trackable_id, tag_id))
    if not link:
        raise HTTPException(status_code=404, detail="Relation not found")
    link.hidden = hidden
    db.commit()
    db.refresh(link)
    return link


# =========================
# DELETE: TrackableTag
# =========================
@router.delete("/{trackable_id}/{tag_id}", response_model=dict)
def delete_trackable_tag(trackable_id: int, tag_id: int, db: Session = Depends(get_db)):
    link = db.get(modelTrackableTag, (trackable_id, tag_id))
    if not link:
        raise HTTPException(status_code=404, detail="Relation not found")
    db.delete(link)
    db.commit()
    return {"detail": "Relation deleted successfully"}
