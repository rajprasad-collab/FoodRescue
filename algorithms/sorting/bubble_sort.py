def bubble_sort(arr):
    """Return sorted copy using Bubble Sort. Returns (result, comparisons, swaps)."""
    a = list(arr)
    comparisons = swaps = 0
    n = len(a)

    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            comparisons += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
                swapped = True
        if not swapped:
            break
    return a, comparisons, swaps
