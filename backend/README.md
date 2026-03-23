# FastAPI Backend

Basic FastAPI API scaffold for the telemetry dashboard workspace.

## Structure

```text
backend/
  src/
    data/
    routers/
    services/
    main.py
    models.py
  requirements.txt
  test-requirements.txt
```

## Install

1. Create and activate a virtual environment.
2. Install runtime dependencies:

```sh
pip install -r requirements.txt
```

3. Optional: install test dependencies:

```sh
pip install -r test-requirements.txt
```

## Run

From the `backend` directory:

```sh
uvicorn src.main:app --reload
```

The API will start at `http://127.0.0.1:8000`.

## Endpoints

- `GET /`
- `GET /health`
- `GET /telemetry`
- `POST /telemetry`
- `GET /telemetry/{telemetry_id}`
- `DELETE /telemetry/{telemetry_id}`

Interactive docs are available at `http://127.0.0.1:8000/docs`.

## Test

From the `backend` directory:

```sh
pytest
```