from pydantic import BaseModel


class AuthenticationToken(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    name: str
    role: str
    avatar: str | None = None
