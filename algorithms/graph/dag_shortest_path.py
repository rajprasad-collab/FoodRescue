def topological_sort(graph):
    """Return a topological ordering. Raises ValueError if graph has a cycle."""
    nodes = set(graph)
    for neighbors in graph.values():
        nodes.update(neighbors)

    indegree = {node: 0 for node in nodes}
    for node, neighbors in graph.items():
        for neighbor in neighbors:
            indegree[neighbor] += 1

    queue = [node for node in nodes if indegree[node] == 0]
    order = []

    while queue:
        node = queue.pop(0)
        order.append(node)

        for neighbor in graph.get(node, {}):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    if len(order) != len(nodes):
        raise ValueError("Graph is not a DAG; a cycle was detected.")

    return order


def dag_shortest_path(graph, source):
    """
    Single-source shortest path in a DAG using topological ordering.
    Unlike Dijkstra, this algorithm works by relaxing edges in topological order.
    Negative weights are allowed as long as the graph remains acyclic.
    """
    import math

    order = topological_sort(graph)
    distances = {node: math.inf for node in order}
    previous = {node: None for node in order}
    distances[source] = 0

    for node in order:
        if distances[node] == math.inf:
            continue

        for neighbor, weight in graph.get(node, {}).items():
            candidate = distances[node] + weight
            if candidate < distances[neighbor]:
                distances[neighbor] = candidate
                previous[neighbor] = node

    return distances, previous


def reconstruct_path(previous, source, target):
    path = []
    current = target

    while current is not None:
        path.append(current)
        if current == source:
            path.reverse()
            return path
        current = previous.get(current)

    return []
