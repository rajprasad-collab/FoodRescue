def heap_sort(arr):
    """Return sorted copy using Heap Sort."""
    a = list(arr)
    comparisons = [0]
    swaps = [0]

    def heapify(size, root):
        largest = root
        left = 2 * root + 1
        right = 2 * root + 2

        if left < size:
            comparisons[0] += 1
            if a[left] > a[largest]:
                largest = left

        if right < size:
            comparisons[0] += 1
            if a[right] > a[largest]:
                largest = right

        if largest != root:
            a[root], a[largest] = a[largest], a[root]
            swaps[0] += 1
            heapify(size, largest)

    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)

    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        swaps[0] += 1
        heapify(end, 0)

    return a, comparisons[0], swaps[0]
