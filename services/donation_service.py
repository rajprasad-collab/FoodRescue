from datetime import datetime

from models.donation import Donation

from services.priority_service import (
    calculate_priority,
    classify_urgency,
    expiry_urgency,
)

from algorithms.sorting.quick_sort import quick_sort


def calculate_donation_priority(
    donation: Donation,
    current_time: datetime
) -> Donation:
    """
    Calculate and assign the priority score and urgency
    for a FoodRescue donation.

    Priority formula:

        Priority =
            0.45E +
            0.25Q +
            0.20D +
            0.10P

    Where:
        E = Expiry urgency
        Q = Quantity score
        D = Demand score
        P = Donor priority
    """

    # Calculate remaining shelf life.
    minutes_remaining = donation.minutes_to_expiry(
        current_time
    )

    # Convert remaining shelf life into urgency score.
    expiry_score = expiry_urgency(
        minutes_remaining
    )

    # Normalize quantity to a 0–100 score.
    #
    # 200 meals or more = 100.
    quantity_score = min(
        100.0,
        (donation.quantity / 200.0) * 100.0
    )

    # Calculate final priority score.
    donation.priority_score = calculate_priority(
        expiry_urgency=expiry_score,
        quantity_score=quantity_score,
        demand_score=donation.demand_score,
        donor_priority=donation.donor_priority,
    )

    # Convert numerical score into a human-readable category.
    donation.urgency = classify_urgency(
        donation.priority_score
    )

    return donation


class PriorityItem:
    """
    Wrapper used by Quick Sort.

    Quick Sort compares objects using comparison operators.
    We only compare the priority score, not the Donation object.

    This prevents Python from attempting to compare Donation
    objects when two donations have the same priority score.
    """

    def __init__(
        self,
        score: float,
        donation: Donation
    ):
        self.score = score
        self.donation = donation

    def __lt__(self, other):
        return self.score < other.score

    def __le__(self, other):
        return self.score <= other.score

    def __gt__(self, other):
        return self.score > other.score

    def __ge__(self, other):
        return self.score >= other.score

    def __eq__(self, other):
        if not isinstance(other, PriorityItem):
            return False

        return self.score == other.score

    def __repr__(self):
        return (
            f"PriorityItem("
            f"score={self.score}, "
            f"donation={self.donation.id}"
            f")"
        )


def sort_donations_by_priority(
    donations
):
    """
    Sort donations from highest priority to lowest priority
    using the project's manually implemented Quick Sort.

    IMPORTANT:
    Python's built-in sorted() is deliberately NOT used here.
    """

    # Convert each donation into a PriorityItem.
    items = [
        PriorityItem(
            donation.priority_score,
            donation
        )
        for donation in donations
    ]

    # Our Quick Sort sorts in ascending order.
    sorted_items, comparisons, swaps = quick_sort(
        items
    )

    # Reverse the ascending result manually so that
    # highest-priority donations appear first.
    sorted_items.reverse()

    sorted_donations = [
        item.donation
        for item in sorted_items
    ]

    return sorted_donations


def prioritize_and_sort_donations(
    donations,
    current_time: datetime
):
    """
    Complete FoodRescue donation-prioritization pipeline.

    Step 1:
        Calculate priority for every donation.

    Step 2:
        Classify urgency.

    Step 3:
        Sort donations using Quick Sort.

    Returns:
        sorted_donations, comparisons, swaps
    """

    # Calculate priority for every donation.
    for donation in donations:
        calculate_donation_priority(
            donation,
            current_time
        )

    # Sort by priority using Quick Sort.
    sorted_donations = sort_donations_by_priority(
        donations
    )

    return sorted_donations