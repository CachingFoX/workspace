from fastapi.testclient import TestClient
import pytest
from backend.api import create_api
from backend.settings import ApiSettings, ApiSettingsInMemory
from backend.database import get_db

# from backend.models import *
from backend.models import modelTrackable

# logging.basicConfig(level=logging.DEBUG)


settings_alt = ApiSettings(
    database_url="sqlite:///./.tmp/test.db",
    upload_path="./.tmp/uploads",
)

settings = ApiSettingsInMemory(
    upload_path="./.tmp/uploads",
)


@pytest.fixture
def client():
    api = create_api(settings)
    client = TestClient(api)
    return client


def _init_trackable():
    trackable = modelTrackable(
        private_code="XXXXXX",
        public_code="TB1234",
        title="string",
        series="string",
        activated=False,
        icon_url="string",
        owner="string",
    )
    db = next(get_db())
    db.add(trackable)
    db.commit()
