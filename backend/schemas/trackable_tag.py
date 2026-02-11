from pydantic import BaseModel
from backend.schemas.tag import TagRead as schemaTagRead


# =========================
# TrackableTag Schema
# =========================
class TrackableTagIn(BaseModel):
    trackable_id: int
    tag_id: int
    hidden: bool

    model_config = {"from_attributes": True}


# =========================
# TrackableTag Schema
# =========================
class TrackableTagOut(BaseModel):
    id: int
    trackable_id: int
    tag: schemaTagRead  # verschachteltes Objekt
    hidden: bool

    model_config = {"from_attributes": True}


# Schema für die TrackableTag-Relation
class TrackableTagRelation(BaseModel):
    id: int
    tag: schemaTagRead
    hidden: bool

    model_config = {"from_attributes": True}


class TrackableAttachedTag(BaseModel):
    id: int
    name: str
    unique_name: str
    hidden: bool
    tag_id: int

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_with_transform(cls, tag):
        return cls(
            id=tag.tag.id,
            name=tag.tag.name,
            unique_name=tag.tag.unique_name,
            hidden=tag.hidden,
            tag_id=tag.id,
        )


def transformAttachedTags(tags, sort=False):
    attachedTags = [TrackableAttachedTag.from_orm_with_transform(tag) for tag in tags]
    if sort:
        attachedTags.sort(key=lambda item: item.name)
    return attachedTags
