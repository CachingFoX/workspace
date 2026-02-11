from pydantic_settings import BaseSettings
from sqlalchemy.pool import StaticPool
from typing import Type


class ApiSettings(BaseSettings):
    debug: bool = False
    database_url: str
    upload_path: str
    poolclass: Type | None = None

    class Config:
        env_file = ".env"


class ApiSettingsInMemory(ApiSettings):
    database_url: str = "sqlite:///:memory:"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Default setzen, falls poolclass nicht gesetzt
        if self.poolclass is None:
            self.poolclass = StaticPool

    class Config:
        env_file = ".env"
