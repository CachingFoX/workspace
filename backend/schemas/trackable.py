from pydantic import BaseModel
from schemas.trackable_tag import TrackableTagRelation


# --------------------
# Pydantic Schemas
# --------------------
class TrackableCreate(BaseModel):
    private_code: str
    public_code: str
    title: str
    series: str
    activated: bool
    icon_url: str
    owner: str | None = None


class TrackableExtern(BaseModel):
    private_code: str
    public_code: str
    title: str
    series: str
    activated: bool
    icon_url: str
    owner: str | None = None

    class Config:
        orm_mode = True


class TrackableRead(BaseModel):
    id: int
    private_code: str
    public_code: str
    title: str
    owner: str | None = None
    activated: bool
    series: str | None = None
    icon_url: str | None = None
    description: str | None = None
    activation_code: str | None = None

    tags: list[TrackableTagRelation]

    class Config:
        orm_mode = True


class TrackableUpdate(BaseModel):
    private_code: str | None = None
    public_code: str | None = None
    title: str | None = None
    owner: str | None = None
    activated: bool | None = None
    series: str | None = None
    icon_url: str | None = None
    description: str | None = None
    activation_code: str | None = None

    class Config:
        orm_mode = True
