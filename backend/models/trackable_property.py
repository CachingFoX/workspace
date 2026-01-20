from sqlalchemy import Column, Integer, ForeignKey, String
from database2 import Base


class TrackableProperty(Base):
    __tablename__ = "trackable_properties"

    id = Column(Integer, primary_key=True)
    trackable_id = Column(Integer, ForeignKey("trackables.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("property.id"), nullable=False)
    type = Column(String, nullable=False)
    text = Column(String, default=False)
    # number = Column(Integer, default=False)
    # boolean = Column(Boolean, default=False)
    # datetime = Column(DateTime, default=False)

    """
    hidden = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        UniqueConstraint("trackable_id", "tag_id", name="uix_trackable_tag"),
    )

    trackable = relationship("Trackable", back_populates="tags")
    tag = relationship(
        "Tag"  # Module name
    )  # back_populates="trackables"  # hier keine back_populates nötig, nur laden
    """
