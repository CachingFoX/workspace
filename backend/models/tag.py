from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy.orm import relationship, validates
from models.tablenames import Tablenames as tablenames


class Tag(Base):
    __tablename__ = tablenames.Tag

    id = Column(Integer, primary_key=True, index=True)
    unique_name = Column(String, unique=True, index=True)
    name = Column(String, index=True)

    @validates("unique_name")
    def validate_unique_name(self, key, value):
        return value.lower()

    trackables = relationship(
        "TrackableTag", back_populates="tag", cascade="all, delete-orphan"
    )
