from sqlalchemy import Column, Integer, String, Boolean
from database import Base
from sqlalchemy.orm import validates


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
    description = Column(String)
    activation_code = Column(String)

    @validates("private_code")
    @validates("public_code")
    @validates("activation_code")
    def convert_upper(self, key, value):
        return value.upper()

    @validates("public_code")
    def validate_public_code(self, key, value):
        if value[0:2].upper() != "TB":
            raise ValueError(
                f"Public code must be start with 'TB'. '{value}' is invalid."
            )
        return value
