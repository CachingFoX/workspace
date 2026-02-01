from pydantic import BaseModel


class Property(BaseModel):
    id: int
    name: str
    type: str

    class Config:
        orm_mode = True


"""# Schema für die TrackableProperty-Relation
class TrackablePropertyRelation(BaseModel):
    id: int
    tag: schemaTagRead
    hidden: bool

    class Config:
        orm_mode = True
"""
