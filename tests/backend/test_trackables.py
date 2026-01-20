from fastapi import status
from datetime import datetime


def test_read_all_trackables(client, test_database):
    response = client.get("/trackables")
    assert response.status_code == status.HTTP_200_OK
    result = response.json()
    assert len(result) == 2


def test_read_trackables_failed(client):
    response = client.get("/trackables/4711")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    result = response.json()
    assert result["detail"] == "Trackable with internal id '4711' not found."


def test_read_trackables_okay(client, test_database):
    response = client.get("/trackables/1")
    assert response.status_code == status.HTTP_200_OK
    result = response.json()
    assert result["id"] == 1
    assert datetime.fromisoformat(result["created"])
    assert len(result) == 14


def test_create_read_trackable_okay(client, test_database, testdata_new_trackable):
    response = client.post("/trackables", json=testdata_new_trackable)
    assert response.status_code == status.HTTP_201_CREATED
    result = response.json()
    assert result["id"] == 3


def test_create_read_trackable_fail_known_private_code(
    client, test_database, trackable_duplicate_private_code
):
    response = client.post("/trackables", json=trackable_duplicate_private_code)
    assert response.status_code == status.HTTP_409_CONFLICT
    result = response.json()
    assert result["detail"] == "A trackable with 'XXXXXX' already exists"


def test_create_read_trackable_fail_known_public_code(
    client, test_database, trackable_duplicate_public_code
):
    response = client.post("/trackables", json=trackable_duplicate_public_code)
    assert response.status_code == status.HTTP_409_CONFLICT
    result = response.json()
    assert result["detail"] == "A trackable with 'TB5EFVM' already exists"


def test_delete_trackables_okay(client, test_database):
    response = client.delete("/trackables/1")
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_delete_trackables_failed(client):
    response = client.delete("/trackables/4711")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    result = response.json()
    assert result["detail"] == "Trackable with internal id '4711' not found."
