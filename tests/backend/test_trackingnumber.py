from fastapi import status
from datetime import datetime


def test_read_private_tracking_number_okay(client, test_database):
    response = client.get("/trackingnumber/XXXXXX")
    assert response.status_code == status.HTTP_200_OK
    result = response.json()
    assert result["id"] == 1
    assert result["public_code"] == "TB5EFVM"
    assert datetime.fromisoformat(result["created"])
    assert len(result) == 14


def test_read_public_tracking_number_okay(client, test_database):
    response = client.get("/trackingnumber/TB5EFVM")
    assert response.status_code == status.HTTP_200_OK

    result = response.json()
    assert result["id"] == 1
    assert result["private_code"] == "XXXXXX"
    assert datetime.fromisoformat(result["created"])
    assert len(result) == 14


def test_read_tracking_number_failed(client, test_database):
    response = client.get("/trackingnumber/YYYYYY")
    assert response.status_code == status.HTTP_404_NOT_FOUND

    result = response.json()
    assert result["detail"] == "Trackable 'YYYYYY' not found."
