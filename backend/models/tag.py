from sqlalchemy import Column, Integer, String
from backend.database2 import Base
from sqlalchemy.orm import relationship, validates
import re


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    unique_name = Column(String, unique=True, index=True)
    name = Column(String, index=True)

    @validates("unique_name")
    def validate_unique_name(self, key, value):
        # return value.lower()
        return re.sub(r"[^a-z0-9]", "", value.lower())

    trackables = relationship(
        "TrackableTag", back_populates="tag", cascade="all, delete-orphan"
    )
