from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_satellites_returns_seed_data() -> None:
    response = client.get("/satellites")

    assert response.status_code == 200
    assert len(response.json()) >= 2