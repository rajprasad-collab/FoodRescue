def binary_search(arr, target):
    """Binary Search on an already sorted array. Returns (index, comparisons)."""
    low, high = 0, len(arr) - 1
    comparisons = 0

    while low <= high:
        mid = (low + high) // 2
        comparisons += 1

        if arr[mid] == target:
            return mid, comparisons
        if arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1, comparisons
