from typing import Annotated

from pydantic import BaseModel, BeforeValidator, Field
from datetime import datetime

class TelemetryBase(BaseModel):
    satelliteId: str
    timestamp: Annotated[datetime, BeforeValidator(lambda x: datetime.fromisoformat(str(x)))]
    altitude: Annotated[float, Field(gt=0)]
    velocity: Annotated[float, Field(gt=0)]
    status: str

class TelemetryCreate(TelemetryBase):
    pass

class Telemetry(TelemetryBase):
    id: int
