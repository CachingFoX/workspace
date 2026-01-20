from backend.database import get_db
from backend.models import modelTrackable
from fastapi.testclient import TestClient
import pytest
from backend.api import create_api
from backend.settings import ApiSettingsInMemory

trackable_1_public_code = "XXXXXX"  # activated
trackable_1_private_code = "TB5EFVM"
trackable_2_public_code = "FREMONT"  # activated
trackable_2_private_code = "TB5EFR9"
trackable_3_public_code = "FX5910"  # not activated
trackable_3_private_code = "TBA164J"


@pytest.fixture
def client():
    settings = ApiSettingsInMemory(
        upload_path="./.tmp/uploads",
    )
    api = create_api(settings)
    client = TestClient(api)

    return client


@pytest.fixture
def test_database():
    db = next(get_db())

    trackable = modelTrackable(
        private_code=trackable_1_public_code,
        public_code=trackable_1_private_code,
        title="string",
        series="string",
        activated=False,
        icon_url="string",
        owner="string",
    )

    db.add(trackable)
    db.commit()

    trackable = modelTrackable(
        private_code=trackable_2_public_code,
        public_code=trackable_2_private_code,
        title="string",
        series="string",
        activated=False,
        icon_url="string",
        owner="string",
    )
    db.add(trackable)
    db.commit()

    return db


@pytest.fixture
def testdata_new_trackable():
    return {
        "private_code": trackable_3_public_code,
        "public_code": trackable_3_private_code,
        "title": "string",
        "series": "string",
        "activated": False,
        "icon_url": "string",
        "owner": "string",
    }


@pytest.fixture
def trackable_duplicate_private_code():
    return {
        "private_code": trackable_1_public_code,  # use code from trackable #1
        "public_code": trackable_3_private_code,
        "title": "string",
        "series": "string",
        "activated": False,
        "icon_url": "string",
        "owner": "string",
    }


@pytest.fixture
def trackable_duplicate_public_code():
    return {
        "private_code": trackable_3_public_code,
        "public_code": trackable_1_private_code,  # use code from trackable #1
        "title": "string",
        "series": "string",
        "activated": False,
        "icon_url": "string",
        "owner": "string",
    }
