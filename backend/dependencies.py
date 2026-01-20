from fastapi import Depends, Request
from typing_extensions import Annotated
from backend.database import get_db
from sqlalchemy.orm import Session
from settings import ApiSettings

DbSession = Annotated[Session, Depends(get_db)]


def get_settings(request: Request) -> ApiSettings:
    return request.app.state.settings
