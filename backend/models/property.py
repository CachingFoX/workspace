from sqlalchemy import Column, Integer, String
from database2 import Base
from sqlalchemy.orm import validates
import re


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    unique_name = Column(String, unique=True, index=True)

    @validates("unique_name")
    def validate_unique_name(self, key, value):
        return re.sub(r"[^a-z0-9]", "", value.lower())

    # trackables = relationship(
    #    "TrackableTag", back_populates="tag", cascade="all, delete-orphan"
    # )
