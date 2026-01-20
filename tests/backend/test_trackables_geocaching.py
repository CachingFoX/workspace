from fastapi import status


def test_read_trackables_geocaching_activated(client, test_database):
    response = client.get("/trackables/geocaching/XXXXXX")
    assert response.status_code == status.HTTP_200_OK
    result = response.json()
    assert len(result) == 7
    assert result["activated"]
    assert result["icon_url"] == "/images/WptTypes/21.gif"
    assert result["owner"] == "Geocaching HQ"
    assert result["private_code"] == "XXXXXX"
    assert result["public_code"] == "TB5EFVM"
    assert result["series"] == "Travel Bug Dog Tag"
    assert result["title"] == "Travel Bug Dog Tag"


def test_read_trackables_geocaching_inactive(client, test_database):
    response = client.get("/trackables/geocaching/FX5910")
    assert response.status_code == status.HTTP_200_OK
    result = response.json()
    assert len(result) == 7
    assert not result["activated"]
    assert result["icon_url"] == "/images/WptTypes/23.gif"
    assert result["owner"] == ""
    assert result["private_code"] == "FX5910"
    assert result["public_code"] == "TBA164J"
    assert result["series"] == "Franconia Flag Micro"
    assert result["title"] == "Franconia Flag Micro"


def test_read_trackables_geocaching_unknown(client, test_database):
    response = client.get("/trackables/geocaching/ZZZZZZ")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    result = response.json()
    assert (
        result["detail"]
        == "The Travel Bug ZZZZZZ you requested does not exist in the system."
    )
