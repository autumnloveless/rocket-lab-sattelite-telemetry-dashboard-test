"""API endpoint tests."""

"""
Test summary:
| Test                      | Endpoint              | Expect    |
| ------------------------- | --------------------- | --------- |
| health                    | GET /health           | 200       |
| list data                 | GET /telemetry        | 200, >=2  |
| list pagination           | GET /telemetry        | 200, paged|
| get by id                 | GET /telemetry/id     | 200       |
| create valid timestamp    | POST /telemetry       | 201       |
| delete by id              | DELETE /telemetry/id  | 200       |
| reject bad timestamp      | POST /telemetry       | 422       |
| reject negative altitude  | POST /telemetry       | 422       |
| reject negative velocity  | POST /telemetry       | 422       |
"""

from fastapi.testclient import TestClient

from src.main import app


client = TestClient(app)


def test_health_endpoint() -> None:
    """Health endpoint returns ok."""
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_telemetry_returns_seed_data() -> None:
    """Telemetry list returns seed data."""
    response = client.get("/telemetry")

    assert response.status_code == 200
    assert len(response.json()) >= 2


def test_list_telemetry_supports_pagination() -> None:
    """Telemetry list supports offset/limit pagination."""
    status_value = "PAGINATION_TEST_STATUS"

    for i in range(3):
        payload = {
            "satelliteId": f"SAT-PAGE-{i}",
            "timestamp": "2026-03-22T15:30:00Z",
            "altitude": 7000.0 + i,
            "velocity": 7900.0 + i,
            "status": status_value,
        }
        create_response = client.post("/telemetry", json=payload)
        assert create_response.status_code == 201

    first_page = client.get(f"/telemetry?status={status_value}&offset=0&limit=2")
    second_page = client.get(f"/telemetry?status={status_value}&offset=2&limit=2")

    assert first_page.status_code == 200
    assert second_page.status_code == 200
    assert len(first_page.json()) == 2
    assert len(second_page.json()) == 1


def test_create_telemetry_accepts_iso8601_timestamp() -> None:
    """Create accepts ISO 8601 timestamps."""
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


def test_get_telemetry_by_id_returns_record() -> None:
    """Get by ID returns a telemetry record."""
    payload = {
        "satelliteId": "SAT-GET",
        "timestamp": "2026-03-22T15:30:00Z",
        "altitude": 6200.0,
        "velocity": 7802.0,
        "status": "SOLAR_INERTIAL",
    }

    create_response = client.post("/telemetry", json=payload)
    telemetry_id = create_response.json()["id"]
    response = client.get(f"/telemetry/{telemetry_id}")

    assert create_response.status_code == 201
    assert response.status_code == 200
    assert response.json()["id"] == telemetry_id


def test_delete_telemetry_by_id_removes_record() -> None:
    """Delete by ID removes a telemetry record."""
    payload = {
        "satelliteId": "SAT-DELETE",
        "timestamp": "2026-03-22T15:30:00Z",
        "altitude": 6201.0,
        "velocity": 7803.0,
        "status": "SOLAR_INERTIAL",
    }

    create_response = client.post("/telemetry", json=payload)
    telemetry_id = create_response.json()["id"]
    delete_response = client.delete(f"/telemetry/{telemetry_id}")
    get_response = client.get(f"/telemetry/{telemetry_id}")

    assert create_response.status_code == 201
    assert delete_response.status_code == 200
    assert get_response.status_code == 404


def test_create_telemetry_rejects_invalid_timestamp() -> None:
    """Create rejects invalid timestamps."""
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
    """Create rejects negative altitude."""
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
    """Create rejects negative velocity."""
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