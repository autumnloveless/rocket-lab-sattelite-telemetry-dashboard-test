from fastapi import FastAPI

from src.routers.telemetry import router as telemetry_router

app = FastAPI(
    title="Rocket Lab Satellite Telemetry API",
    version="0.1.0",
    description="Basic FastAPI backend scaffold with an in-memory data store.",
)

app.include_router(telemetry_router)


@app.get("/", tags=["root"])
def read_root() -> dict[str, str]:
    return {"message": "Rocket Lab telemetry API is running."}

@app.get("/health", tags=["root"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
