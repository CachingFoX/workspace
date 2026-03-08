from pydantic import BaseModel


class ImageEmbbed(BaseModel):
    id: int
    trackable_id: int
    filename: str | None = None
    comment: str | None = None
    rank: str | None = None

    model_config = {"from_attributes": True}


class ImageRank(BaseModel):
    rank: str

    model_config = {"from_attributes": True}
