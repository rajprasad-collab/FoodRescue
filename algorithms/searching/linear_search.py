def linear_search(arr, target):
    """Return the first index of target, or -1 if not found."""
    comparisons = 0
    for i, value in enumerate(arr):
        comparisons += 1
        if value == target:
            return i, comparisons
    return -1, comparisons
