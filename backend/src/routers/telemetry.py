from fastapi import APIRouter, HTTPException, status

from src.models import Telemetry, TelemetryCreate
from src.services.data_service import data_service

router = APIRouter()

@router.get("/telemetry", response_model=list[Telemetry], tags=["telemetry"])
def list_telemetry(satteliteId: str | None = None, status: str | None = None) -> list[Telemetry]:
    telemetry_results = data_service.list_telemetry()
    if satteliteId:
        telemetry_results = filter(lambda t: t.satelliteId == satteliteId, telemetry_results)
    if status:
        telemetry_results = filter(lambda t: t.status == status, telemetry_results)
    return list(telemetry_results)


@router.get("/telemetry/{telemetry_id}", response_model=Telemetry, tags=["telemetry"])
def get_telemetry(telemetry_id: int) -> Telemetry:
    telemetry = data_service.get_telemetry(telemetry_id)
    if telemetry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Telemetry {telemetry_id} was not found.",
        )
    return telemetry


@router.post("/telemetry", response_model=Telemetry, status_code=status.HTTP_201_CREATED, tags=["telemetry"],)
def create_telemetry(payload: TelemetryCreate) -> Telemetry:
    return data_service.create_telemetry(payload)

@router.delete("/telemetry/{telemetry_id}", tags=["telemetry"])
def delete_telemetry(telemetry_id: int) -> None:
    data_service.delete_telemetry(telemetry_id)