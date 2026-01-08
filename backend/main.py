from fastapi import FastAPI
from database import engine, Base
from routers import trackables  # importiert den Router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

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
app.include_router(trackables.router)

# --------------------
# Starten mit:
# uvicorn main:app --reload
# --------------------
