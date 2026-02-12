from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from backend.database2 import Base
from sqlalchemy.orm import relationship, validates
from backend.models.image import Image as modelImage
# from backend.models.trackable_tag import __classname__ as XXX


class Trackable(Base):
    __tablename__ = "trackables"

    id = Column(Integer, primary_key=True, index=True)
    public_code = Column(String, unique=True, index=True)
    private_code = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    series = Column(String, index=True)
    owner = Column(String, index=True)
    activated = Column(Boolean, default=False)
    icon_url = Column(String)
    created = Column(
        DateTime,
        # nullable=False,
        server_default=func.now(),  # DB setzt Wert beim INSERT
    )
    updated = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),  # Initialer Wert
        onupdate=func.now(),  # Automatisch bei UPDATE
    )

    @validates("private_code")
    # @validates("public_code")
    @validates("activation_code")
    def convert_upper(self, key, value):
        return value.upper()

    @validates("public_code")
    def validate_public_code(self, key, value):
        value = value.upper()
        if value[0:2].upper() != "TB":
            raise ValueError(
                f"Public code must be start with 'TB'. '{value}' is invalid."
            )
        return value

    """
    @event.listens_for(MyModel, "before_update", propagate=True)
    def prevent_created_update(mapper, connection, target):
        hist = attributes.get_history(target, "created")
        if hist.has_changes():
            raise ValueError("created darf nach der Erstellung nicht geändert werden")
    """

    tags = relationship(
        "TrackableTag",
        back_populates="trackable",
        cascade="all, delete-orphan",
    )

    images = relationship(
        modelImage,
        back_populates="trackable",
        cascade="all, delete-orphan",
    )

    properties = relationship(
        "TrackableProperty",
        back_populates="trackable",
        cascade="all, delete-orphan",
    )
