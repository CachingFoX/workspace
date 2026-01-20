from pydantic import BaseModel
from backend.schemas.tag import TagRead as schemaTagRead


# =========================
# TrackableTag Schema
# =========================
class TrackableTagIn(BaseModel):
    trackable_id: int
    tag_id: int
    hidden: bool

    class Config:
        orm_mode = True


# =========================
# TrackableTag Schema
# =========================
class TrackableTagOut(BaseModel):
    id: int
    trackable_id: int
    tag: schemaTagRead  # verschachteltes Objekt
    hidden: bool

    class Config:
        orm_mode = True


# Schema für die TrackableTag-Relation
class TrackableTagRelation(BaseModel):
    id: int
    tag: schemaTagRead
    hidden: bool

    class Config:
        orm_mode = True
