from pydantic import BaseModel, Field
from datetime import datetime

class TelemetryBase(BaseModel):
    satelliteId: str
    timestamp: datetime
    altitude: float
    velocity: float
    status: str

class TelemetryCreate(TelemetryBase):
    pass

class Telemetry(TelemetryBase):
    id: int
