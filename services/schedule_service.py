from algorithms.number_theory.chinese_remainder import (
    chinese_remainder_theorem,
)


def synchronize_collection_schedules(
    schedules,
):
    """
    schedules example:

    [
        {"offset": 1, "period": 3},
        {"offset": 2, "period": 5},
        {"offset": 3, "period": 7}
    ]

    Finds the first synchronized time.
    """

    residues = [
        schedule["offset"]
        for schedule in schedules
    ]

    moduli = [
        schedule["period"]
        for schedule in schedules
    ]

    synchronized_time, repeat_period = (
        chinese_remainder_theorem(
            residues,
            moduli
        )
    )

    return {
        "synchronized_time": synchronized_time,
        "repeat_period": repeat_period,
    }