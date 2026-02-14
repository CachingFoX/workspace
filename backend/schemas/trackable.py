from pydantic import BaseModel, field_validator
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

    @field_validator("public_code")
    @classmethod
    def validate_public_code(cls, value):
        value = value.upper()
        if value[0:2].upper() != "TB":
            raise ValueError(
                f"Public code must be start with 'TB'. '{value}' is invalid."
            )
        return value


class TrackableExtern(BaseModel):
    private_code: str
    public_code: str
    title: str
    series: str
    activated: bool
    icon_url: str
    owner: str | None = None

    model_config = {"from_attributes": True}


class TrackableRead(BaseModel):
    id: int
    private_code: str
    public_code: str
    title: str
    owner: str | None = None
    activated: bool
    series: str | None = None
    icon_url: str | None = None
    created: datetime | None = None
    updated: datetime | None = None

    tags: list[schemaAttachedTag]
    images: list[schemaImageEmbbed]
    properties: list[schemaAttachedProperty]

    @classmethod
    def from_orm(cls, trackable):
        return cls.from_orm_with_transform(trackable)

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
            created=trackable.created,
            updated=trackable.updated,
            tags=transformAttachedTags(trackable.tags, True),
            properties=transformAttachedProperties(trackable.properties, True),
            images=trackable.images,  # TODO
        )


class TrackableUpdate(BaseModel):
    title: str | None = None
    owner: str | None = None
    activated: bool | None = None
    series: str | None = None
    icon_url: str | None = None

    model_config = {"from_attributes": True}
