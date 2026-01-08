from pydantic import BaseModel
from schemas.tag import TagRead


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
    tag: TagRead  # verschachteltes Objekt
    hidden: bool

    class Config:
        orm_mode = True


# Schema für die TrackableTag-Relation
class TrackableTagRelation(BaseModel):
    id: int
    tag: TagRead
    hidden: bool

    class Config:
        orm_mode = True
