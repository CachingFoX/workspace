from fastapi import FastAPI
import os
from routers import (
    geocaching,
    images,
    root,
    tags,
    trackables,
    trackables_images,
    trackables_tags,
    trackingnumber,
)  # importiert den Router
from fastapi.middleware.cors import CORSMiddleware
from backend.database import init_db  # Base, engine,
from settings import ApiSettings
import logging

"""
TODO
@app.on_event("startup")
def startup():
    db_dir = get_sqlite_db_directory(settings.database_url)
    db_dir.mkdir(parents=True, exist_ok=True)
    
"""


def create_api(settings: ApiSettings):
    logging.debug(f"create_api({settings})")

    # TODO if _api:
    #    return _api

    _api = FastAPI(title="TOD")  # TODo
    _api.state.settings = settings

    init_db(settings)

    # check upload folder
    os.makedirs(settings.upload_path, exist_ok=True)

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

    # Router einbinden
    _api.include_router(root.router)
    _api.include_router(trackingnumber.router)
    _api.include_router(trackables.router)
    _api.include_router(trackables_tags.router)
    _api.include_router(trackables_images.router)
    _api.include_router(tags.router)
    _api.include_router(geocaching.router)
    _api.include_router(images.router)

    return _api
