from bs4 import BeautifulSoup
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from backend.models import modelTrackable
from backend.schemas import trackable as schemaTrackable
from sqlalchemy.orm import Session
import httpx
from backend.database import get_db

router = APIRouter(
    prefix="/trackables/geocaching",
    tags=["Geocaching HQ services"],
)


@router.get("/{trackable_id}", response_model=schemaTrackable.TrackableExtern)
async def get_trackable_info(trackable_id: str, db: Session = Depends(get_db)):
    """
    Ruft Informationen über einen Geocaching Trackable ab.

    Parameter:
    - trackable_id: Der Tracking-Code des Trackables

    Rückgabe:
    - JSON mit name, icon, origin_name, owner, series
    """

    # URL zusammenbauen
    url = f"https://www.geocaching.com/track/details.aspx?tracker={trackable_id}"

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
                    "detail": f"The Travel Bug {trackable_id} you requested does not exist in the system."
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

        db_trackable = modelTrackable(
            # id=-1,
            private_code=trackable_id.upper(),
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
