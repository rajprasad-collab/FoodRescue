from dataclasses import dataclass


@dataclass
class Route:
    source: str
    destination: str
    distance_km: float
    travel_time_min: float
    status: str = "ACTIVE"