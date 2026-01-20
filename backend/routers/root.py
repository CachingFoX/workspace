from fastapi import APIRouter, Depends
from dependencies import get_settings
from settings import ApiSettings

# from schemas.root import Root as schemaRoot

router = APIRouter(
    prefix="",
)


@router.get("/")
async def read_root(settings: ApiSettings = Depends(get_settings)):
    return {"version": "0.0.0"}
