from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from backend.auth.auth import (
    get_current_user,
    update_user_token_timestamp,
    create_new_token,
)
from backend.schemas import schemaAuthenticationToken, schemaUser
import logging

logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="",
    tags=["images"],
)


@router.post("/token", response_model=schemaAuthenticationToken)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return create_new_token(form_data.username, form_data.password)


@router.get("/token", response_model=schemaUser)
def verify_token(user=Depends(get_current_user)):
    return user


@router.delete("/token")
def logout(user=Depends(get_current_user), status_code=status.HTTP_204_NO_CONTENT):
    update_user_token_timestamp(user["username"])  # TODO use id


@router.get("/me")
def read_me(user=Depends(get_current_user)):
    return user
