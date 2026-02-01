from sqlalchemy import String, Column, Integer, ForeignKey, UniqueConstraint
from backend.database2 import Base
from sqlalchemy.orm import relationship


class TrackableProperty(Base):
    __tablename__ = "trackables_properties"

    id = Column(Integer, primary_key=True)
    trackable_id = Column(Integer, ForeignKey("trackables.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    text = Column(String, default=False)

    __table_args__ = (
        UniqueConstraint("trackable_id", "property_id", name="uix_trackable_property"),
    )

    trackable = relationship("Trackable", back_populates="properties")
    property = relationship(
        "Property"  # Module name
    )  # back_populates="trackables"  # hier keine back_populates nötig, nur laden
