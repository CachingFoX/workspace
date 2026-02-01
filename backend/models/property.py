from sqlalchemy import Column, Integer, String
from backend.database2 import Base


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    type = Column(String, index=True)
