from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_telemetry_returns_seed_data() -> None:
    response = client.get("/telemetry")

    assert response.status_code == 200
    assert len(response.json()) >= 2


def test_create_telemetry_accepts_iso8601_timestamp() -> None:
    payload = {
        "satelliteId": "SAT-TEST",
        "timestamp": "2026-03-22T15:30:00Z",
        "altitude": 6100.5,
        "velocity": 7801.3,
        "status": "SOLAR_INERTIAL",
    }

    response = client.post("/telemetry", json=payload)
    print(response.json())
    assert response.status_code == 201
    assert response.json()["timestamp"] == "2026-03-22T15:30:00Z"


def test_create_telemetry_rejects_invalid_timestamp() -> None:
    payload = {
        "satelliteId": "SAT-TEST",
        "timestamp": "03/22/2026 15:30:00",
        "altitude": 6100.5,
        "velocity": 7801.3,
        "status": "SOLAR_INERTIAL",
    }

    response = client.post("/telemetry", json=payload)

    assert response.status_code == 422


def test_create_telemetry_rejects_negative_altitude() -> None:
    payload = {
        "satelliteId": "SAT-TEST",
        "timestamp": "2026-03-22T15:30:00Z",
        "altitude": -1.0,
        "velocity": 7801.3,
        "status": "SOLAR_INERTIAL",
    }

    response = client.post("/telemetry", json=payload)

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(error["loc"][-1] == "altitude" for error in detail)


def test_create_telemetry_rejects_negative_velocity() -> None:
    payload = {
        "satelliteId": "SAT-TEST",
        "timestamp": "2026-03-22T15:30:00Z",
        "altitude": 6100.5,
        "velocity": -1.0,
        "status": "SOLAR_INERTIAL",
    }

    response = client.post("/telemetry", json=payload)

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert any(error["loc"][-1] == "velocity" for error in detail)