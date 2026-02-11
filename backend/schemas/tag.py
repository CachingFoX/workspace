from pydantic import BaseModel


class TagId(BaseModel):
    id: int

    model_config = {"from_attributes": True}


class TagCreate(BaseModel):
    name: str


class TagRead(BaseModel):
    id: int
    name: str
    unique_name: str
    use: int | None = None

    model_config = {"from_attributes": True}


class TagUpdate(BaseModel):
    name: str

    model_config = {"from_attributes": True}
