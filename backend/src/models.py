from typing import Annotated

from pydantic import BaseModel, BeforeValidator, Field
from datetime import datetime


# Shared telemetry fields used by both create and response models.
class TelemetryBase(BaseModel):
    satelliteId: str
    # Domain rule: timestamp must be valid ISO-8601.
    timestamp: Annotated[datetime, BeforeValidator(lambda x: datetime.fromisoformat(str(x)))]
    # Domain rule: altitude must be positive.
    altitude: Annotated[float, Field(gt=0)]
    # Domain rule: velocity must be positive.
    velocity: Annotated[float, Field(gt=0)]
    status: str


# Request model: same telemetry payload shape, without server-generated ID.
# Exists primarily to have descriptive class types in API type hints.
class TelemetryCreate(TelemetryBase):
    pass


# Response model: extends base fields with persistent record ID.
class Telemetry(TelemetryBase):
    id: int
