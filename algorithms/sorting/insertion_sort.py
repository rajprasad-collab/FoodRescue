def insertion_sort(arr):
    """Return sorted copy using Insertion Sort."""
    a = list(arr)
    comparisons = shifts = 0

    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0:
            comparisons += 1
            if a[j] <= key:
                break
            a[j + 1] = a[j]
            shifts += 1
            j -= 1
        a[j + 1] = key

    return a, comparisons, shifts
