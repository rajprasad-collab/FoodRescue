def dijkstra(graph, source):
    """
    Dijkstra's Single-Source Shortest Path.

    graph format:
        {
            "A": {"B": 4, "C": 2},
            "B": {"C": 1, "D": 5},
            ...
        }

    Returns (distances, previous).
    Edge weights must be non-negative.
    """
    import math

    for node, neighbors in graph.items():
        for neighbor, weight in neighbors.items():
            if weight < 0:
                raise ValueError("Dijkstra cannot use negative edge weights.")

    nodes = set(graph)
    for neighbors in graph.values():
        nodes.update(neighbors)

    distances = {node: math.inf for node in nodes}
    previous = {node: None for node in nodes}
    visited = set()
    distances[source] = 0

    # Manual min-selection so the algorithm is explicit and does not rely
    # on a graph library or a priority queue implementation.
    while len(visited) < len(nodes):
        current = None
        best_distance = math.inf

        for node in nodes:
            if node not in visited and distances[node] < best_distance:
                current = node
                best_distance = distances[node]

        if current is None:
            break

        visited.add(current)

        for neighbor, weight in graph.get(current, {}).items():
            if neighbor in visited:
                continue
            candidate = distances[current] + weight
            if candidate < distances[neighbor]:
                distances[neighbor] = candidate
                previous[neighbor] = current

    return distances, previous


def reconstruct_path(previous, source, target):
    """Reconstruct source -> target from Dijkstra predecessor data."""
    path = []
    current = target

    while current is not None:
        path.append(current)
        if current == source:
            path.reverse()
            return path
        current = previous.get(current)

    return []
