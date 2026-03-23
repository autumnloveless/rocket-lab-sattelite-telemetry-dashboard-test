from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routers.telemetry import router as telemetry_router

app = FastAPI(
    title="Rocket Lab Satellite Telemetry API",
    version="0.1.0",
    description="Basic FastAPI backend scaffold with an in-memory data store.",
)

# Allow the local frontend dev server and equivalent localhost variants.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://satdashboard.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Keep API endpoint registration separate from app bootstrapping.
app.include_router(telemetry_router)

@app.get("/", tags=["root"])
def read_root() -> dict[str, str]:
    """Return a basic service identity message."""
    return {"message": "Rocket Lab telemetry API is running."}


@app.get("/health", tags=["root"])
def health_check() -> dict[str, str]:
    """Return service liveness status."""
    return {"status": "ok"}
