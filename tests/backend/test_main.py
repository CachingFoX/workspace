from fastapi import status


def test_get_root(client):
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "database_url": "sqlite:///:memory:",
        "short_name": "...",
        "version": "0.3.0",
        "upload_path": "/workspace/.tmp/uploads",
    }
