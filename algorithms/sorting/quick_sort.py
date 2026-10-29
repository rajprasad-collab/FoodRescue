def quick_sort(arr):
    """Return sorted copy using Quick Sort with Lomuto partition."""
    a = list(arr)
    comparisons = [0]
    swaps = [0]

    def partition(low, high):
        pivot = a[high]
        i = low
        for j in range(low, high):
            comparisons[0] += 1
            if a[j] <= pivot:
                if i != j:
                    a[i], a[j] = a[j], a[i]
                    swaps[0] += 1
                i += 1
        if i != high:
            a[i], a[high] = a[high], a[i]
            swaps[0] += 1
        return i

    def sort(low, high):
        if low < high:
            p = partition(low, high)
            sort(low, p - 1)
            sort(p + 1, high)

    sort(0, len(a) - 1)
    return a, comparisons[0], swaps[0]
