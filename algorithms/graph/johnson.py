import math
from algorithms.graph.bellman_ford import bellman_ford
from algorithms.graph.dijkstra import dijkstra


def johnson(graph):
    """
    Johnson's Algorithm for All-Pairs Shortest Paths.

    Combines Bellman-Ford (to reweight edges into non-negative values)
    and Dijkstra (run from every vertex on the reweighted graph).

    Works on directed graphs with positive or negative edge weights.
    Detects negative-weight cycles and raises ValueError if present.

    Graph format:
        {
            "A": {"B": 3, "C": 8},
            "B": {"C": -4, "D": 1},
            "C": {"D": 7},
            "D": {}
        }

    Returns:
        distances: dict of dicts where distances[u][v] is the shortest distance from u to v.
                   If v is unreachable from u, value is math.inf.
    """
    # 1. Discover all unique vertices
    nodes = set(graph)
    for neighbors in graph.values():
        nodes.update(neighbors)

    if not nodes:
        return {}

    # 2. Create augmented graph with a new source vertex s
    # s has directed edges of weight 0 to all vertices
    auxiliary_source = "__auxiliary_source__"
    while auxiliary_source in nodes:
        auxiliary_source += "_"

    augmented_graph = {node: dict(neighbors) for node, neighbors in graph.items()}
    # Ensure all nodes are present as keys
    for node in nodes:
        if node not in augmented_graph:
            augmented_graph[node] = {}

    augmented_graph[auxiliary_source] = {node: 0.0 for node in nodes}

    # 3. Run Bellman-Ford from auxiliary_source to get potential h(v)
    # If a negative cycle exists, bellman_ford raises ValueError
    h_distances, _ = bellman_ford(augmented_graph, auxiliary_source)

    # 4. Reweight every edge (u, v):
    #    w'(u, v) = w(u, v) + h(u) - h(v) >= 0
    reweighted_graph = {}
    for node in nodes:
        reweighted_graph[node] = {}
        for neighbor, weight in graph.get(node, {}).items():
            reweighted_edge = weight + h_distances[node] - h_distances[neighbor]
            # Avoid floating point precision negative zero
            reweighted_graph[node][neighbor] = max(0.0, round(reweighted_edge, 10))

    # 5. Run Dijkstra from each vertex in original graph
    all_pairs_distances = {}

    for u in nodes:
        d_prime, _ = dijkstra(reweighted_graph, u)
        all_pairs_distances[u] = {}
        for v in nodes:
            if d_prime[v] == math.inf:
                all_pairs_distances[u][v] = math.inf
            else:
                # Convert back: d(u, v) = d'(u, v) - h(u) + h(v)
                orig_dist = d_prime[v] - h_distances[u] + h_distances[v]
                all_pairs_distances[u][v] = round(orig_dist, 4)

    return all_pairs_distances
