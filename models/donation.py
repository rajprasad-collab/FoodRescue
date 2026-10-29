from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Donation:
    id: str
    donor_id: str
    food_type: str
    quantity: int
    prepared_at: datetime
    expiry_at: datetime
    demand_score: float
    donor_priority: float
    location: str
    status: str = "AVAILABLE"
    priority_score: float = 0.0
    urgency: str = "NORMAL"
    assigned_center_id: Optional[str] = None

    def minutes_to_expiry(self, current_time: datetime) -> float:
        return max(
            0.0,
            (self.expiry_at - current_time).total_seconds() / 60
        )