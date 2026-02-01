from pydantic import BaseModel
from backend.schemas.image import ImageEmbbed as schemaImageEmbbed
from backend.schemas.trackable_tag import TrackableAttachedTag as schemaAttachedTag
from backend.schemas.trackable_tag import transformAttachedTags
from backend.schemas.trackable_property import (
    TrackableAttachedProperty2 as schemaAttachedProperty,
)
from backend.schemas.trackable_property import transformAttachedProperties

from datetime import datetime


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
    created: datetime | None = None
    updated: datetime | None = None

    tags: list[schemaAttachedTag]
    images: list[schemaImageEmbbed]
    properties: list[schemaAttachedProperty]

    @classmethod
    def from_orm_with_transform(cls, trackable):
        return cls(
            id=trackable.id,
            private_code=trackable.private_code,
            public_code=trackable.public_code,
            title=trackable.title,
            owner=trackable.owner,
            activated=trackable.activated,
            series=trackable.series,
            icon_url=trackable.icon_url,
            description=trackable.description,
            activation_code=trackable.activation_code,
            created=trackable.created,
            updated=trackable.updated,
            tags=transformAttachedTags(trackable.tags, True),
            properties=transformAttachedProperties(trackable.properties, True),
            images=trackable.images,  # TODO
        )


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
