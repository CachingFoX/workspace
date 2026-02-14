from pydantic import BaseModel


class Owner(BaseModel):
    owner: str
    count: int

    @classmethod
    def from_orm(cls, owner):
        return cls(
            owner=owner[0],
            count=owner[1],
        )
