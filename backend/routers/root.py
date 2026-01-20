from fastapi import APIRouter, Depends
from backend.dependencies import get_settings
from backend.settings import ApiSettings


router = APIRouter(prefix="")


@router.get("/")
async def read_root(settings: ApiSettings = Depends(get_settings)):
    return {"version": "0.0.0"}
