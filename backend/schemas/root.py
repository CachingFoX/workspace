from pydantic import BaseModel


class Root(BaseModel):
    version: str
