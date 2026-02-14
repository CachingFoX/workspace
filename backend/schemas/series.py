from pydantic import BaseModel


# --------------------
# Pydantic Schemas
# --------------------
class Series(BaseModel):
    series: str
    count: int

    @classmethod
    def from_orm(cls, series):
        return cls(
            series=series[0],
            count=series[1],
        )
