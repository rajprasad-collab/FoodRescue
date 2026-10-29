def calculate_priority(
    expiry_urgency: float,
    quantity_score: float,
    demand_score: float,
    donor_priority: float
) -> float:
    """
    Calculate FoodRescue donation priority.

    E = expiry urgency
    Q = quantity factor
    D = demand factor
    P = donor-defined priority

    Priority =
        0.45E + 0.25Q + 0.20D + 0.10P
    """

    score = (
        0.45 * expiry_urgency
        + 0.25 * quantity_score
        + 0.20 * demand_score
        + 0.10 * donor_priority
    )

    return round(max(0.0, min(100.0, score)), 2)


def classify_urgency(score: float) -> str:
    if score >= 80:
        return "CRITICAL"
    elif score >= 60:
        return "HIGH"
    elif score >= 40:
        return "MEDIUM"
    return "LOW"


def expiry_urgency(minutes_remaining: float) -> float:
    """
    Convert remaining shelf life into an urgency score.

    ≤30 min  -> 100
    ≤60 min  -> 90
    ≤120 min -> 75
    ≤240 min -> 55
    >240 min -> 30
    """

    if minutes_remaining <= 30:
        return 100.0
    if minutes_remaining <= 60:
        return 90.0
    if minutes_remaining <= 120:
        return 75.0
    if minutes_remaining <= 240:
        return 55.0
    return 30.0