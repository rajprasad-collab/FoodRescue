from dataclasses import dataclass


@dataclass
class RedistributionCenter:
    id: str
    name: str
    location: str
    capacity: int
    available_capacity: int
    status: str = "ACTIVE"

    def can_accept(self, quantity: int) -> bool:
        return (
            self.status == "ACTIVE"
            and self.available_capacity >= quantity
        )