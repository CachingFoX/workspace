from fastapi import status


def test_get_root(client):
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"version": "0.0.0"}
