from pydantic import BaseModel


class TagCreate(BaseModel):
    name: str


class TagRead(BaseModel):
    id: int
    name: str
    unique_name: str

    class Config:
        orm_mode = True


class TagUpdate(BaseModel):
    name: str

    class Config:
        orm_mode = True
