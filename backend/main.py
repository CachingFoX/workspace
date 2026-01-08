from fastapi import FastAPI
from database import engine, Base
from routers import tags, trackables, trackable_tags  # importiert den Router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)  # TODO here or in database.py

app = FastAPI(title="Beispiel App mit Routern")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vue Dev Server
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, ...
    allow_headers=["*"],  # Authorization, Content-Type, ...
)


# Router einbinden
app.include_router(tags.router)
app.include_router(trackables.router)
app.include_router(trackable_tags.router)

# --------------------
# Starten mit:
# uvicorn main:app --reload
# --------------------
