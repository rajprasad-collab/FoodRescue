def selection_sort(arr):
    """Return sorted copy using Selection Sort."""
    a = list(arr)
    comparisons = swaps = 0
    n = len(a)

    for i in range(n - 1):
        min_index = i
        for j in range(i + 1, n):
            comparisons += 1
            if a[j] < a[min_index]:
                min_index = j
        if min_index != i:
            a[i], a[min_index] = a[min_index], a[i]
            swaps += 1
    return a, comparisons, swaps
