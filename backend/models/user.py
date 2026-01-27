from sqlalchemy import Column, Integer, String
from backend.database2 import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar = Column(String)
    token_timestamp = Column(Integer)
    role = Column(String)
