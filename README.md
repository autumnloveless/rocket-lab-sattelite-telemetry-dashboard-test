# Satellite Telemetry Dashboard
[![Netlify Status](https://api.netlify.com/api/v1/badges/693db0cb-0dd4-406e-8199-91b5a3cee1e3/deploy-status)](https://app.netlify.com/projects/satdashboard/deploys)


## Overview
This project is a small full-stack telemetry dashboard intended for a coding assignment.

Implemented functionality:
- Display telemetry table columns: Satellite ID, Timestamp, Altitude, Velocity, Health Status.
- Filter telemetry by Satellite ID and Health Status.
- Add new telemetry entries.
- Delete telemetry entries.

## Tech Stack
- Backend: FastAPI + Pydantic + in-memory data store.
- Frontend: React + TypeScript + Vite.
- UI: AstroUXDS component library + TailwindCSS.
- Data fetching: SWR.
- Filter URL state: React Router search params.

## Architecture Notes
- Frontend API access is centralized in `frontend/src/services/telemetryService.ts`.
- SWR data flow lives in `frontend/src/hooks/useTelemetry.ts`.
- URL query params (`satelliteId`, `status`) are the source of truth for filter state.
- UI is split into focused components:
	- `TelemetryFilters`
	- `TelemetryForm`
	- `TelemetryTable`
	- `TelemetryDashboardPage`

## Run Locally

### Backend
From `backend`:

```powershell
pip install -r requirements.txt
uvicorn src.main:app --reload
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
