from pydantic import BaseModel


class Property(BaseModel):
    id: int
    name: str
    type: str

    model_config = {"from_attributes": True}


"""# Schema für die TrackableProperty-Relation
class TrackablePropertyRelation(BaseModel):
    id: int
    tag: schemaTagRead
    hidden: bool

    model_config = {
        "from_attributes": True
    }

"""
