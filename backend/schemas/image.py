from pydantic import BaseModel


class ImageEmbbed(BaseModel):
    id: int
    trackable_id: int
    filename: str | None = None
    comment: str | None = None
    gallery: bool | None = None

    model_config = {"from_attributes": True}

    """
    id = Column(Integer, primary_key=True)
    trackable_id = Column(Integer, ForeignKey("trackables.id"), nullable=False)
    filename = Column(String)
    comment = Column(String)
    gallery = Column(Boolean)
    """
