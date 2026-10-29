import pytest
from algorithms.sorting.bubble_sort import bubble_sort
from algorithms.sorting.selection_sort import selection_sort
from algorithms.sorting.insertion_sort import insertion_sort
from algorithms.sorting.merge_sort import merge_sort
from algorithms.sorting.quick_sort import quick_sort
from algorithms.sorting.heap_sort import heap_sort

from algorithms.searching.linear_search import linear_search
from algorithms.searching.binary_search import binary_search

from algorithms.graph.dijkstra import dijkstra, reconstruct_path as dijkstra_path
from algorithms.graph.dag_shortest_path import (
    dag_shortest_path,
    reconstruct_path as dag_path,
)
from algorithms.graph.bellman_ford import bellman_ford, reconstruct_path as bellman_path
from algorithms.graph.johnson import johnson
from algorithms.graph.ford_fulkerson import ford_fulkerson
from algorithms.graph.bipartite_matching import max_bipartite_matching

from algorithms.number_theory.chinese_remainder import chinese_remainder_theorem


def test_all_sorts():
    data = [5, 1, 4, 2, 8, 0, 2]
    expected = sorted(data)
    algorithms = [
        bubble_sort, selection_sort, insertion_sort,
        merge_sort, quick_sort, heap_sort
    ]
    for algorithm in algorithms:
        result, _, _ = algorithm(data)
        assert result == expected


def test_search():
    data = [1, 3, 5, 7, 9]
    assert linear_search(data, 7)[0] == 3
    assert linear_search(data, 8)[0] == -1
    assert binary_search(data, 7)[0] == 3
    assert binary_search(data, 8)[0] == -1


def test_dijkstra():
    graph = {
        "A": {"B": 4, "C": 2},
        "B": {"D": 5},
        "C": {"B": 1, "D": 8},
        "D": {},
    }
    distances, previous = dijkstra(graph, "A")
    assert distances["D"] == 8
    assert dijkstra_path(previous, "A", "D") == ["A", "C", "B", "D"]


def test_dag_shortest_path():
    graph = {
        "A": {"B": 2, "C": 6},
        "B": {"D": 2, "E": 5},
        "C": {"E": 1},
        "D": {"E": 1},
        "E": {},
    }
    distances, previous = dag_shortest_path(graph, "A")
    assert distances["E"] == 5
    assert dag_path(previous, "A", "E") == ["A", "B", "D", "E"]


def test_bellman_ford():
    # Graph with negative weight edge but no negative cycle
    graph = {
        "A": {"B": 4, "C": 2},
        "B": {"D": 3},
        "C": {"B": -1, "D": 5},
        "D": {},
    }
    distances, previous = bellman_ford(graph, "A")
    assert distances["B"] == 1.0  # A -> C (2) + C -> B (-1) = 1
    assert distances["D"] == 4.0  # A -> C -> B -> D = 4
    assert bellman_path(previous, "A", "D") == ["A", "C", "B", "D"]


def test_bellman_ford_negative_cycle():
    # Negative cycle between B and C
    graph = {
        "A": {"B": 1},
        "B": {"C": -2},
        "C": {"B": -1},
    }
    with pytest.raises(ValueError, match="negative-weight cycle"):
        bellman_ford(graph, "A")


def test_johnson():
    graph = {
        "A": {"B": 3, "C": 8},
        "B": {"C": -4, "D": 1},
        "C": {"D": 7},
        "D": {},
    }
    distances = johnson(graph)
    # Shortest A -> D: A -> B (3) + B -> D (1) = 4
    # Shortest A -> C: A -> B (3) + B -> C (-4) = -1
    assert distances["A"]["C"] == -1.0
    assert distances["A"]["D"] == 4.0
    assert distances["B"]["D"] == 1.0


def test_johnson_negative_cycle():
    graph = {
        "A": {"B": 1},
        "B": {"C": -3},
        "C": {"B": 1},
    }
    with pytest.raises(ValueError, match="negative-weight cycle"):
        johnson(graph)


def test_ford_fulkerson():
    # Classic flow network: S -> A, B -> T
    capacity_graph = {
        "Source": {"A": 10, "B": 10},
        "A": {"B": 2, "Sink": 4},
        "B": {"Sink": 9},
        "Sink": {}
    }
    result = ford_fulkerson(capacity_graph, "Source", "Sink")
    # Max flow should be 13 (A->Sink gets 4, A->B gets 2, B->Sink gets 2+7=9)
    assert result["max_flow"] == 13.0
    assert isinstance(result["augmenting_paths"], list)
    assert len(result["augmenting_paths"]) > 0


def test_bipartite_matching():
    # Donations on left, Redistribution Centers / NGOs on right
    compatibility = {
        "Donation_1": ["Center_A", "Center_B"],
        "Donation_2": ["Center_A"],
        "Donation_3": ["Center_B", "Center_C"],
    }
    result = max_bipartite_matching(compatibility)
    assert result["matching_count"] == 3
    # Verify each donation is matched to a distinct center
    matched_centers = set(result["matching"].values())
    assert len(matched_centers) == 3


def test_crt():
    x, period = chinese_remainder_theorem([1, 2, 3], [3, 5, 7])
    assert x == 52
    assert period == 105
