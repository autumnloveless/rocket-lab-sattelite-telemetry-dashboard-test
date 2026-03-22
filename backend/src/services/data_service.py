from src.data.seed_data import INITIAL_TELEMETRY
from src.models import Telemetry, TelemetryCreate

class DataService:
    def __init__(self) -> None:
        self._telemetry: dict[int, Telemetry] = { telemetry.id: telemetry for telemetry in INITIAL_TELEMETRY }
        self._next_id = max((telemetry.id for telemetry in self._telemetry.values()), default=0) + 1

    def list_telemetry(self) -> list[Telemetry]:
        return list(self._telemetry.values())

    def get_telemetry(self, telemetry_id: int) -> Telemetry | None:
        return self._telemetry.get(telemetry_id)
    
    def delete_telemetry(self, telemetry_id: int) -> None:
        self._telemetry.pop(telemetry_id, None)
        return

    def create_telemetry(self, telemetry: TelemetryCreate) -> Telemetry:     
        telemetry_record = Telemetry.model_validate({ "id": self._next_id, **telemetry.model_dump() })
        self._next_id += 1
        self._telemetry[telemetry_record.id] = telemetry_record
        return telemetry_record

data_service = DataService()