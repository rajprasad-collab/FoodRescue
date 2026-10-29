def bellman_ford(graph, source):
    """
    Bellman-Ford Single-Source Shortest Path Algorithm.

    Supports graphs with negative edge weights and detects negative-weight cycles.
    
    Graph format:
        {
            "A": {"B": 4, "C": -2},
            "B": {"C": 3, "D": 2},
            ...
        }

    Returns:
        (distances, previous)
        where distances is a dict mapping node -> shortest distance from source,
        and previous is a dict mapping node -> predecessor on shortest path.

    Raises:
        ValueError: If graph contains a negative-weight cycle reachable from source.
    """
    import math

    nodes = set(graph)
    for neighbors in graph.values():
        nodes.update(neighbors)

    if source not in nodes:
        nodes.add(source)

    distances = {node: math.inf for node in nodes}
    previous = {node: None for node in nodes}
    distances[source] = 0.0

    # Collect all directed edges (u, v, weight)
    edges = []
    for u, neighbors in graph.items():
        for v, weight in neighbors.items():
            edges.append((u, v, float(weight)))

    # Relax edges |V| - 1 times
    num_nodes = len(nodes)
    for _ in range(num_nodes - 1):
        updated = False
        for u, v, weight in edges:
            if distances[u] != math.inf:
                candidate = distances[u] + weight
                if candidate < distances[v]:
                    distances[v] = candidate
                    previous[v] = u
                    updated = True
        if not updated:
            break

    # Check for negative-weight cycles (|V|-th relaxation)
    for u, v, weight in edges:
        if distances[u] != math.inf:
            if distances[u] + weight < distances[v]:
                raise ValueError("Graph contains a negative-weight cycle.")

    return distances, previous


def reconstruct_path(previous, source, target):
    """Reconstruct source -> target path from predecessor map."""
    path = []
    current = target

    visited = set()
    while current is not None:
        if current in visited:
            return []  # Avoid infinite loop in case of cycle
        visited.add(current)
        path.append(current)
        if current == source:
            path.reverse()
            return path
        current = previous.get(current)

    return []
