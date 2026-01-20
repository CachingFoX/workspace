from fastapi import Depends, Request, Path
from typing_extensions import Annotated
from backend.database import get_db
from sqlalchemy.orm import Session
from backend.settings import ApiSettings
import os

DbSession = Annotated[Session, Depends(get_db)]


def get_settings(request: Request) -> ApiSettings:
    return request.app.state.settings


def get_version(request: Request) -> str:
    return request.app.version


# Nur den Basisnamen nehmen, um Pfadmanipulation zu verhindern
"""
def get_safe_basename(path_parameter_name: str):
    async def dependency(filename: str = Path(..., alias=path_parameter_name)):
        return os.path.basename(filename)

    return dependency
"""


def get_only_basename(path_parameter_name: str):
    async def dependency(filename: str = Path(..., alias=path_parameter_name)):
        return os.path.basename(filename)

    return dependency
