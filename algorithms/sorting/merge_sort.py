def merge_sort(arr):
    """Return sorted copy using Merge Sort."""
    a = list(arr)
    comparisons = [0]

    def merge(left, right):
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            comparisons[0] += 1
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        result.extend(left[i:])
        result.extend(right[j:])
        return result

    def sort(values):
        if len(values) <= 1:
            return values
        mid = len(values) // 2
        return merge(sort(values[:mid]), sort(values[mid:]))

    result = sort(a)
    return result, comparisons[0], 0
