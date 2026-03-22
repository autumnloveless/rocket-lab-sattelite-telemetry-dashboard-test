from src.models import Telemetry
from datetime import datetime

INITIAL_TELEMETRY: list[Telemetry] = [
    Telemetry(id=1, satelliteId="SAT-1", timestamp=datetime(2025, 5, 3, 0, 12, 10), status="SOLAR_INERTIAL", altitude=5905.32, velocity=7820.87),
    Telemetry(id=2, satelliteId="SAT-1", timestamp=datetime(2025, 5, 3, 0, 12, 12), status="SOLAR_INERTIAL", altitude=5906.75, velocity=7820.87),
]