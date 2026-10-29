from typing import Dict, List, Tuple

from algorithms.graph.dijkstra import dijkstra
from algorithms.searching.binary_search import binary_search


def build_foodrescue_graph(
    routes: List[Tuple[str, str, float]]
) -> Dict[str, Dict[str, float]]:
    """
    Build a directed adjacency-list graph for FoodRescue.

    Each route is represented as:

        (source, destination, distance)

    Example:

        ("Restaurant", "Center A", 4)

    becomes:

        {
            "Restaurant": {
                "Center A": 4
            }
        }
    """

    graph: Dict[str, Dict[str, float]] = {}

    for source, destination, distance in routes:

        if source not in graph:
            graph[source] = {}

        if destination not in graph:
            graph[destination] = {}

        graph[source][destination] = distance

    return graph


def find_shortest_route(
    graph: Dict[str, Dict[str, float]],
    source: str,
    destination: str
):
    """
    Find the shortest route between two FoodRescue
    locations using the manually implemented
    Dijkstra algorithm.

    The Step 1 Dijkstra implementation accepts:

        dijkstra(graph, source)

    and returns:

        distances, previous

    This service reconstructs the requested destination
    path and returns a dictionary compatible with
    foodrescue_engine.py.
    """

    if source not in graph:
        raise ValueError(
            f"Source node '{source}' does not exist."
        )

    if destination not in graph:
        raise ValueError(
            f"Destination node '{destination}' does not exist."
        )

    # Run Dijkstra from the source.
    distances, previous = dijkstra(
        graph,
        source
    )

    # Destination cannot be reached.
    if destination not in distances:
        return {
            "distance": float("inf"),
            "path": []
        }

    distance = distances[destination]

    # No route exists.
    if distance == float("inf"):
        return {
            "distance": float("inf"),
            "path": []
        }

    # Reconstruct path from destination to source.
    path = []

    current = destination

    while current is not None:

        path.append(current)

        if current == source:
            break

        current = previous.get(current)

    # Source was not reached.
    if not path or path[-1] != source:
        return {
            "distance": float("inf"),
            "path": []
        }

    # Reverse path to get:
    #
    # Source -> ... -> Destination
    path.reverse()

    return {
        "distance": distance,
        "path": path
    }


def find_center_binary(
    centers: List[str],
    target: str
):
    """
    Search for a redistribution center using
    the manually implemented Binary Search.

    The input list must already be sorted.
    """

    if not centers:
        return -1

    return binary_search(
        centers,
        target
    )


def route_distance(
    graph: Dict[str, Dict[str, float]],
    path: List[str]
) -> float:
    """
    Calculate the total distance of a route.

    Example:

        Restaurant -> Center A -> NGO A

    If:

        Restaurant -> Center A = 4 km
        Center A -> NGO A = 3 km

    total = 7 km
    """

    if len(path) < 2:
        return 0.0

    total_distance = 0.0

    for i in range(len(path) - 1):

        current_node = path[i]
        next_node = path[i + 1]

        if current_node not in graph:
            raise ValueError(
                f"Node '{current_node}' does not exist."
            )

        if next_node not in graph[current_node]:
            raise ValueError(
                f"No route exists from "
                f"'{current_node}' to "
                f"'{next_node}'."
            )

        total_distance += graph[
            current_node
        ][next_node]

    return total_distance


def route_exists(
    graph: Dict[str, Dict[str, float]],
    source: str,
    destination: str
) -> bool:
    """
    Check whether a route exists between
    source and destination.
    """

    if source not in graph:
        return False

    if destination not in graph:
        return False

    route = find_shortest_route(
        graph,
        source,
        destination
    )

    return (
        route["distance"] != float("inf")
        and len(route["path"]) > 0
    )


def disable_route(
    graph: Dict[str, Dict[str, float]],
    source: str,
    destination: str
) -> bool:
    """
    Disable a specific route/edge.

    Returns True if the route existed
    and was successfully removed.
    """

    if source not in graph:
        return False

    if destination not in graph[source]:
        return False

    del graph[source][destination]

    return True


def disable_node(
    graph: Dict[str, Dict[str, float]],
    node: str
) -> bool:
    """
    Disable a FoodRescue network node.

    Removes:

    1. The node itself.
    2. Every incoming route to that node.

    Used by the self-healing mechanism.
    """

    if node not in graph:
        return False

    # Remove the node itself.
    del graph[node]

    # Remove incoming routes.
    for source in graph:

        if node in graph[source]:
            del graph[source][node]

    return True