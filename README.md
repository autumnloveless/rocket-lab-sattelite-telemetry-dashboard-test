# Satellite Telemetry Dashboard

## Goal
Build a small, testable full-stack dashboard to manage and view satellite telemetry data.

## Solution
- Backend: Python + FastAPI API with an in-memory database, Pydantic validation, and pytest unit tests.
- Frontend: React (Vite) app using SWR for data fetching and TailwindCSS + AstroUXDS for styling.
- Testing: Backend uses pytest. Frontend uses Vitest + React Testing Library for high-level tests.
- Containers: Backend and frontend are containerized, with a top-level Docker Compose setup to run both together.

## Run Locally

### Backend
From `backend`:

```powershell
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: http://127.0.0.1:8000/docs

Run backend tests:

```powershell
pip install -r test-requirements.txt
pytest
```

### Frontend
From `frontend`:

```powershell
npm install
npm run dev
```

Build for production:

```powershell
npm run build
```

## Run With Docker
From the project root:

```powershell
docker compose up --build
```

Stop containers:

```powershell
docker compose down
```
