from datetime import datetime, timedelta

from models.donation import Donation
from models.center import RedistributionCenter

from services.donation_service import (
    calculate_donation_priority,
    sort_donations_by_priority,
)

from services.routing_service import (
    find_shortest_route,
)

from services.self_healing_service import (
    self_heal_route,
)

from services.schedule_service import (
    synchronize_collection_schedules,
)


def main():

    print("=" * 60)
    print("        FOODRESCUE DOMAIN ENGINE")
    print("=" * 60)

    # ---------------------------------------------------------
    # 1. DONATIONS
    # ---------------------------------------------------------

    now = datetime.now()

    donations = [
        Donation(
            id="FD001",
            donor_id="D001",
            food_type="Cooked Meals",
            quantity=150,
            prepared_at=now - timedelta(minutes=90),
            expiry_at=now + timedelta(minutes=25),
            demand_score=90,
            donor_priority=80,
            location="Kengeri",
        ),

        Donation(
            id="FD002",
            donor_id="D002",
            food_type="Rice",
            quantity=80,
            prepared_at=now - timedelta(minutes=60),
            expiry_at=now + timedelta(minutes=180),
            demand_score=70,
            donor_priority=60,
            location="Whitefield",
        ),

        Donation(
            id="FD003",
            donor_id="D003",
            food_type="Bread",
            quantity=40,
            prepared_at=now - timedelta(minutes=30),
            expiry_at=now + timedelta(minutes=90),
            demand_score=85,
            donor_priority=70,
            location="Rajajinagar",
        ),
    ]

    # ---------------------------------------------------------
    # 2. PRIORITY CALCULATION
    # ---------------------------------------------------------

    for donation in donations:
        calculate_donation_priority(
            donation,
            now
        )

    donations = sort_donations_by_priority(
        donations
    )

    print("\nPRIORITIZED DONATIONS")
    print("-" * 60)

    for donation in donations:

        print(
            f"{donation.id} | "
            f"{donation.food_type:15} | "
            f"Quantity={donation.quantity:3} | "
            f"Priority={donation.priority_score:5.2f} | "
            f"{donation.urgency}"
        )

    # ---------------------------------------------------------
    # 3. REDISTRIBUTION CENTERS
    # ---------------------------------------------------------

    centers = [
        RedistributionCenter(
            id="C001",
            name="Kengeri Food Center",
            location="Kengeri",
            capacity=500,
            available_capacity=300,
        ),

        RedistributionCenter(
            id="C002",
            name="Nagarbhavi Food Center",
            location="Nagarbhavi",
            capacity=400,
            available_capacity=250,
        ),
    ]

    print("\nREDISTRIBUTION CENTERS")

    for center in centers:

        print(
            f"{center.id} | "
            f"{center.name} | "
            f"Available={center.available_capacity}"
        )

    # ---------------------------------------------------------
    # 4. NETWORK
    # ---------------------------------------------------------

    graph = {
        "Restaurant": {
            "Center A": 4,
            "Center B": 7,
        },

        "Center A": {
            "NGO A": 3,
            "Center B": 2,
        },

        "Center B": {
            "NGO A": 2,
        },

        "NGO A": {},
    }

    # ---------------------------------------------------------
    # 5. DIJKSTRA
    # ---------------------------------------------------------

    route = find_shortest_route(
        graph,
        "Restaurant",
        "NGO A",
    )

    print("\nSHORTEST ROUTE")
    print("-" * 60)
    print(f"Path: {' -> '.join(route['path'])}")
    print(f"Distance: {route['distance']} km")

    # ---------------------------------------------------------
    # 6. SELF-HEALING
    # ---------------------------------------------------------

    print("\nSIMULATING CENTER A FAILURE")
    print("-" * 60)

    healed = self_heal_route(
        graph,
        "Restaurant",
        "NGO A",
        "Center A",
    )

    print(f"Status: {healed['status']}")

    if healed["path"]:
        print(
            f"New path: {' -> '.join(healed['path'])}"
        )

        print(
            f"New distance: {healed['distance']} km"
        )

    # ---------------------------------------------------------
    # 7. CRT
    # ---------------------------------------------------------

    schedule = synchronize_collection_schedules(
        [
            {"offset": 1, "period": 3},
            {"offset": 2, "period": 5},
            {"offset": 3, "period": 7},
        ]
    )

    print("\nCRT SCHEDULE SYNCHRONIZATION")
    print("-" * 60)

    print(
        f"Synchronized time: "
        f"{schedule['synchronized_time']}"
    )

    print(
        f"Repeat period: "
        f"{schedule['repeat_period']}"
    )

    print("\nFoodRescue domain engine completed.")


if __name__ == "__main__":
    main()