from fastapi import APIRouter, HTTPException, Query, status

# Keep data-access concerns in the service layer, not in endpoint handlers.
from src.services.data_service import data_service
from src.models import Telemetry, TelemetryCreate

router = APIRouter()

@router.get("/telemetry", response_model=list[Telemetry], tags=["telemetry"])
def list_telemetry(
    satelliteId: str | None = None,
    status: str | None = None,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1),
) -> list[Telemetry]:
    """List telemetry entries with optional filters and pagination."""
    # Fetch all telemetry entries. Since this uses a simple in-memory store,
    # reading all records is acceptable here.
    # For a production-scale datastore, filtering should happen in the database
    # to avoid loading unnecessary rows into application memory.
    telemetry_results = data_service.list_telemetry()
    
    # Apply optional query filters.
    if satelliteId:
        telemetry_results = filter(lambda t: t.satelliteId == satelliteId, telemetry_results)
    if status:
        telemetry_results = filter(lambda t: t.status == status, telemetry_results)
    
    # Apply pagination after filtering so pages reflect the filtered dataset.
    paged_results = list(telemetry_results)[offset : offset + limit]

    # Return the paginated results as a concrete list.
    return paged_results

@router.get("/telemetry/{telemetry_id}", response_model=Telemetry, tags=["telemetry"])
def get_telemetry(telemetry_id: int) -> Telemetry:
    """Return one telemetry entry by ID."""
    # Look up one telemetry record by ID.
    telemetry = data_service.get_telemetry(telemetry_id)
    if telemetry is None:
        # Missing records are mapped to 404 so clients can distinguish
        # "not found" from successful responses.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Telemetry {telemetry_id} was not found.",
        )
    # Return the found record.
    return telemetry

@router.post("/telemetry", response_model=Telemetry, status_code=status.HTTP_201_CREATED, tags=["telemetry"],)
def create_telemetry(payload: TelemetryCreate) -> Telemetry:
    """Create a telemetry entry."""
    # IDs are assigned server-side by the data service for consistency.
    return data_service.create_telemetry(payload)

@router.delete("/telemetry/{telemetry_id}", tags=["telemetry"])
def delete_telemetry(telemetry_id: int) -> None:
    """Delete a telemetry entry by ID."""
    # Deletion is idempotent: deleting a missing ID is treated as a no-op.
    data_service.delete_telemetry(telemetry_id)