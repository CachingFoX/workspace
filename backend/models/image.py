from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from backend.database2 import Base
from sqlalchemy.orm import relationship


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True)
    trackable_id = Column(Integer, ForeignKey("trackables.id"), nullable=False)
    filename = Column(String)
    comment = Column(String)
    gallery = Column(Boolean)

    trackable = relationship("Trackable", back_populates="images")
