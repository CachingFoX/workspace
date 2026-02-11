from fastapi import FastAPI
import os
from backend.routers import (
    auth,
    geocaching,
    images,
    root,
    tags,
    trackables,
    trackables_images,
    trackables_tags,
    trackables_properties,
    trackingnumber,
)  # importiert den Router
from fastapi.middleware.cors import CORSMiddleware
from backend.database import init_db
from backend.settings import ApiSettings
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

__version__ = "0.8.15"

"""
TODO
@app.on_event("startup")
def startup():
    db_dir = get_sqlite_db_directory(settings.database_url)
    db_dir.mkdir(parents=True, exist_ok=True)
    
"""


def startup():
    logger.info("startup")


def create_api(settings: ApiSettings):
    # logging.debug(f"create_api({settings})")

    _api = FastAPI(title="TrackableAPI", version=__version__, on_startup=[startup])
    _api.state.settings = settings

    init_db(settings)

    # --- check upload folder
    upload_path = Path(settings.upload_path)
    if not upload_path.is_absolute():
        absolute_path = (Path.cwd() / upload_path).resolve()
    settings.upload_path = str(absolute_path)
    logger.info(f"Upload directory: {settings.upload_path}")

    os.makedirs(settings.upload_path, exist_ok=True)

    # --- middleware
    _api.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",  # Vue Dev Server
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],  # GET, POST, PUT, DELETE, ...
        allow_headers=["*"],  # Authorization, Content-Type, ...
    )

    # --- router einbinden
    _api.include_router(auth.router)
    _api.include_router(root.router)
    _api.include_router(trackingnumber.router)
    _api.include_router(trackables.router)
    _api.include_router(trackables_properties.router)
    _api.include_router(trackables_tags.router)
    _api.include_router(trackables_images.router)

    _api.include_router(tags.router)
    _api.include_router(geocaching.router)
    _api.include_router(images.router)

    return _api
