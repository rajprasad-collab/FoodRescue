from algorithms.graph.dijkstra import (
    dijkstra,
    reconstruct_path,
)


def self_heal_route(
    graph,
    source,
    destination,
    failed_node
):
    """
    Remove a failed node and calculate a new route.
    """

    healed_graph = {}

    for node, neighbors in graph.items():

        if node == failed_node:
            continue

        healed_graph[node] = {
            neighbor: weight
            for neighbor, weight in neighbors.items()
            if neighbor != failed_node
        }

    distances, previous = dijkstra(
        healed_graph,
        source
    )

    path = reconstruct_path(
        previous,
        source,
        destination
    )

    if not path:
        return {
            "status": "NO_ALTERNATIVE",
            "path": [],
            "distance": None,
            "failed_node": failed_node,
        }

    return {
        "status": "SELF_HEALED",
        "path": path,
        "distance": distances[destination],
        "failed_node": failed_node,
    }