from bs4 import BeautifulSoup
from database import SessionLocal
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from models import trackable as models
from schemas import trackable as schemaTrackable
from schemas import trackable_tag as schemaTagRelation
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import or_
import httpx


router = APIRouter(
    prefix="/trackables",
    tags=["trackables"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemaTrackable.TrackableRead])
def read_trackables(db: Session = Depends(get_db)):
    return db.query(models.Trackable).all()


def _get_trackable_object(id, db: Session):
    id = id.upper()
    trackable = (
        db.query(models.Trackable)
        .filter(
            or_(models.Trackable.public_code == id, models.Trackable.private_code == id)
        )
        .first()
    )
    return trackable


@router.get("/{trackable_id}", response_model=schemaTrackable.TrackableRead)
def read_trackable_by_public_code(trackable_id: str, db: Session = Depends(get_db)):
    trackable_id = trackable_id.upper()
    trackable = _get_trackable_object(trackable_id, db)
    if not trackable:
        raise HTTPException(
            status_code=404, detail=f"Trackable '{trackable_id}' does not exist"
        )
    return trackable


@router.get(
    "/{trackable_id}/tags", response_model=list[schemaTagRelation.TrackableTagRelation]
)
def read_tags(trackable_id: str, db: Session = Depends(get_db)):
    trackable_id = trackable_id.upper()
    trackable = _get_trackable_object(trackable_id, db)
    if not trackable:
        raise HTTPException(
            status_code=404, detail=f"Trackable '{trackable_id}' does not exist"
        )
    return trackable.tags


"""
@router.post(
    "/{trackable_id}/tags", response_model=list[schemaTagRelation.TrackableTagRelation]
)
def add_tag(trackable_id: str, db: Session = Depends(get_db)):
    trackable_id = trackable_id.upper()
    trackable = _get_trackable_object(trackable_id, db)
    if not trackable:
        raise HTTPException(
            status_code=404, detail=f"Trackable '{trackable_id}' does not exist"
        )
    return trackable.tags
"""

'''
@router.get(
    "/{trackable_id}/tags/{tag_id}",
    response_model=list[schemaTagRelation.TrackableTagRelation],
)
def read_tag(trackable_id: str, tag_id: int, db: Session = Depends(get_db)):
    trackable_id = trackable_id.upper()
    trackable = _get_trackable_object(trackable_id, db)
    if not trackable:
        raise HTTPException(
            status_code=404, detail=f"Trackable '{trackable_id}' does not exist"
        )

    relation = (
        db.query(modelsTrackableTag.TrackableTag)
        .options(joinedload(modelsTrackableTag.TrackableTag.tag))
        .filter(
            modelsTrackableTag.TrackableTag.trackable_id == trackable.id,
            modelsTrackableTag.TrackableTag.tag_id == tag_id,
        )
        .first()
    )

    return relation
    """
    trackable = _get_trackable_object(trackable_id, db)
    if not trackable:
        raise HTTPException(
            status_code=404, detail=f"Trackable '{trackable_id}' does not exist"
        )
    return trackable.tags
    """
'''


@router.patch("/{trackable_id}", response_model=schemaTrackable.TrackableRead)
def update_trackable(
    trackable_id: str,
    update: schemaTrackable.TrackableUpdate,
    db: Session = Depends(get_db),
):
    try:
        trackable_id = trackable_id.upper()
        trackable = (
            db.query(models.Trackable)
            .filter(models.Trackable.private_code == trackable_id)
            .first()
        )
        if not trackable:
            raise HTTPException(status_code=404, detail="Trackable does not exist")

        update_data = update.dict(exclude_unset=True)
        for key, value in update_data.items():
            print(key, value)
            setattr(trackable, key, value)  # Dynamisch setzen

        db.commit()
        db.refresh(trackable)
        return trackable
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=str(e))
    #    except IntegrityError as e:
    #    db.rollback()
    #    raise HTTPException(status_code=400, detail="Email existiert bereits")


"""
@router.get("/id/{id}", response_model=schemaTrackable.TrackableRead)
def read_trackable_by_db_id(id: str, db: Session = Depends(get_db)):
    trackable = db.query(models.Trackable).filter(models.Trackable.id == id).first()
    if not trackable:
        raise HTTPException(status_code=404, detail="Trackable does not exist")
    return trackable
"""


@router.post("/", response_model=schemaTrackable.TrackableRead)
def create_trackable(
    trackable: schemaTrackable.TrackableCreate, db: Session = Depends(get_db)
):
    try:
        existing_trackable = (
            db.query(models.Trackable)
            .filter(models.Trackable.private_code == trackable.private_code)
            .first()
        )

        if existing_trackable:
            raise HTTPException(
                status_code=409,
                detail="A trackable with {trackable.private_code} already exists",
            )

        db_trackable = models.Trackable(
            private_code=trackable.private_code,
            public_code=trackable.public_code,
            title=trackable.title,
            series=trackable.series,
            owner=trackable.owner,
            activated=trackable.activated,
            icon_url=trackable.icon_url,
        )

        db.add(db_trackable)
        db.commit()
        db.refresh(db_trackable)
        return db_trackable
    except ValueError as e:
        # ValidationError aus @validates abfangen
        db.rollback()
        raise HTTPException(status_code=422, detail=str(e))
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=422, detail="Trackable already exist.")


@router.get(
    "/geocaching/{trackable_id}", response_model=schemaTrackable.TrackableExtern
)
async def get_trackable_info(trackingcode: str):
    """
    Ruft Informationen über einen Geocaching Trackable ab.

    Parameter:
    - trackingcode: Der Tracking-Code des Trackables

    Rückgabe:
    - JSON mit name, icon, origin_name, owner, series
    """

    # URL zusammenbauen
    url = f"https://www.geocaching.com/track/details.aspx?tracker={trackingcode}"

    try:
        # HTTP Request
        async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
            response = await client.get(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
            )
            response.raise_for_status()

        # HTML parsen
        soup = BeautifulSoup(response.text, "html.parser")

        # Prüfen ob Trackable existiert (Public Code Element vorhanden)
        public_code_elem = soup.find(
            id="ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode"
        )
        public_code = (
            public_code_elem.get_text(strip=True) if public_code_elem else None
        )

        print(public_code)
        if len(public_code) == 0:
            return JSONResponse(
                status_code=404,
                content={
                    "message": "The Travel Bug you requested does not exist in the system."
                },
            )

        # Prüfen ob Trackable aktiviert ist (BugOwner Element existiert)
        owner_elem = soup.find(id="ctl00_ContentBody_BugDetails_BugOwner")
        is_activated = owner_elem is not None

        # Name (ctl00_ContentBody_lbHeading)
        name_elem = soup.find(id="ctl00_ContentBody_lbHeading")
        name = name_elem.get_text(strip=True) if name_elem else ""

        # Icon (ctl00_ContentBody_BugTypeImage)
        icon_elem = soup.find(id="ctl00_ContentBody_BugTypeImage")
        icon_url = icon_elem.get("src", "") if icon_elem else ""

        # series_elem = soup.find("dd", attrs={"title": True})
        # series_elem.get_text(strip=True) if series_elem else name
        series = icon_elem.get("alt", name) if icon_elem else name

        db_trackable = models.Trackable(
            # id=-1,
            private_code=trackingcode.upper(),
            public_code=public_code,
            title=name,
            series=series,
            owner=owner_elem.get_text(strip=True) if is_activated else "",
            activated=is_activated,
            icon_url=icon_url,
        )

        return db_trackable

    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500, detail=f"Fehler beim Abrufen der Daten: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Fehler beim Verarbeiten: {str(e)}"
        )
