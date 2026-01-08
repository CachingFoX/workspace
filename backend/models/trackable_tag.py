from sqlalchemy import Column, Integer, Boolean, ForeignKey, UniqueConstraint
from database import Base
from models.tablenames import Tablenames as tablenames
from sqlalchemy.orm import relationship


class TrackableTag(Base):
    __tablename__ = tablenames.Trackable_Tag

    id = Column(Integer, primary_key=True)
    trackable_id = Column(Integer, ForeignKey("trackables.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False)
    hidden = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint("trackable_id", "tag_id", name="uix_trackable_tag"),
    )

    trackable = relationship("Trackable", back_populates="tags")
    tag = relationship(
        "Tag"  # Module name
    )  # back_populates="trackables"  # hier keine back_populates nötig, nur laden
