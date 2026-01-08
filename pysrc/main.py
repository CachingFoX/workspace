from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from bs4 import BeautifulSoup
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Geocaching Trackable API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vue Dev Server
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, ...
    allow_headers=["*"],  # Authorization, Content-Type, ...
)


@app.get("/trackable")
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
        if not public_code_elem:
            return JSONResponse(
                status_code=404,
                content={
                    "message": "The Travel Bug you requested does not exist in the system."
                },
            )

        # Daten extrahieren
        result = {}

        # Prüfen ob Trackable aktiviert ist (BugOwner Element existiert)
        owner_elem = soup.find(id="ctl00_ContentBody_BugDetails_BugOwner")
        is_activated = owner_elem is not None

        # Name (ctl00_ContentBody_lbHeading)
        name_elem = soup.find(id="ctl00_ContentBody_lbHeading")
        name = name_elem.get_text(strip=True) if name_elem else ""
        result["name"] = name

        # Icon (ctl00_ContentBody_BugTypeImage)
        icon_elem = soup.find(id="ctl00_ContentBody_BugTypeImage")
        result["icon"] = icon_elem.get("src", "") if icon_elem else ""

        if is_activated:
            # Aktivierter Trackable - normale Logik
            result["origin_name"] = icon_elem.get("alt", name) if icon_elem else name

            # Owner
            result["owner"] = owner_elem.get_text(strip=True)

            # Series (erstes dd Element mit title Attribut)
            series_elem = soup.find("dd", attrs={"title": True})
            result["series"] = series_elem.get_text(strip=True) if series_elem else ""

            # Public Code
            result["public_code"] = public_code_elem.get_text(strip=True)
            result["private_code"] = trackingcode.upper()
            result["activated"] = True
        else:
            # Nicht aktivierter Trackable - alternative Logik
            result["origin_name"] = name
            result["owner"] = ""
            result["series"] = name
            result["public_code"] = public_code_elem.get_text(strip=True)
            result["private_code"] = trackingcode.upper()
            result["activated"] = False

        return JSONResponse(content=result)

    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500, detail=f"Fehler beim Abrufen der Daten: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Fehler beim Verarbeiten: {str(e)}"
        )


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Geocaching Trackable API läuft"}


# Zum Starten: uvicorn main:app --reload
