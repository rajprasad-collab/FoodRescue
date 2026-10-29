from algorithms.searching.linear_search import linear_search
from algorithms.searching.binary_search import binary_search


def find_center_linear(centers, center_id):
    ids = [center.id for center in centers]

    index, comparisons = linear_search(ids, center_id)

    if index == -1:
        return None, comparisons

    return centers[index], comparisons


def find_center_binary(centers, center_id):
    """
    Binary search requires centers to already be sorted by ID.
    """

    centers_sorted = sorted(
        centers,
        key=lambda center: center.id
    )

    ids = [center.id for center in centers_sorted]

    index, comparisons = binary_search(
        ids,
        center_id
    )

    if index == -1:
        return None, comparisons

    return centers_sorted[index], comparisons
from algorithms.graph.dijkstra import (
    dijkstra,
    reconstruct_path,
)


def find_shortest_route(graph, source, destination):

    distances, previous = dijkstra(
        graph,
        source
    )

    path = reconstruct_path(
        previous,
        source,
        destination
    )

    return {
        "source": source,
        "destination": destination,
        "distance": distances[destination],
        "path": path,
    }