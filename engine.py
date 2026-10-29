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
from algorithms.graph.bellman_ford import (
    bellman_ford,
    reconstruct_path as bellman_path,
)
from algorithms.graph.johnson import johnson
from algorithms.graph.ford_fulkerson import ford_fulkerson
from algorithms.graph.bipartite_matching import max_bipartite_matching

from algorithms.number_theory.chinese_remainder import chinese_remainder_theorem


SORTING_ALGORITHMS = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    "merge": merge_sort,
    "quick": quick_sort,
    "heap": heap_sort,
}


def sort_with(algorithm, data):
    if algorithm not in SORTING_ALGORITHMS:
        raise ValueError(
            f"Unknown sorting algorithm '{algorithm}'. "
            f"Choose from: {', '.join(SORTING_ALGORITHMS)}"
        )
    return SORTING_ALGORITHMS[algorithm](data)


def demo():
    data = [42, 17, 8, 99, 23, 4, 61]

    print("=== 1-6. SORTING ALGORITHMS ===")
    for name, algorithm in SORTING_ALGORITHMS.items():
        result, comparisons, operations = algorithm(data)
        print(f"{name:10} -> {result} | comparisons={comparisons}, operations={operations}")

    print("\n=== 7-8. SEARCHING ALGORITHMS ===")
    sorted_data = [4, 8, 17, 23, 42, 61, 99]
    print("linear search (42):", linear_search(sorted_data, 42))
    print("binary search (42):", binary_search(sorted_data, 42))

    print("\n=== 9. DIJKSTRA (Single-Source Shortest Path) ===")
    graph = {
        "Restaurant": {"Center A": 4, "Center B": 7},
        "Center A": {"NGO A": 3, "Center B": 2},
        "Center B": {"NGO A": 2},
        "NGO A": {},
    }
    distances, previous = dijkstra(graph, "Restaurant")
    print("distance to NGO A:", distances["NGO A"])
    print("path:", dijkstra_path(previous, "Restaurant", "NGO A"))

    print("\n=== 10. BELLMAN-FORD (Shortest Path with Route Incentives/Negative Costs) ===")
    # FoodRescue scenario: green corridor gives a toll rebate/carbon credit (-1 km equivalent benefit)
    corridor_graph = {
        "Restaurant": {"Center A": 4, "Center B": 7},
        "Center A": {"NGO A": 3, "Center B": -1},  # -1 represents a green routing incentive
        "Center B": {"NGO A": 2},
        "NGO A": {},
    }
    bf_distances, bf_previous = bellman_ford(corridor_graph, "Restaurant")
    print("distance to NGO A:", bf_distances["NGO A"])
    print("path:", bellman_path(bf_previous, "Restaurant", "NGO A"))

    print("\n=== 11. DAG SHORTEST PATH (Linear Workflow Routing) ===")
    dag = {
        "Registration": {"Inspection": 5},
        "Inspection": {"Center Assignment": 10},
        "Center Assignment": {"Pickup": 15, "Cold Storage": 20},
        "Pickup": {"Redistribution": 8},
        "Cold Storage": {"Redistribution": 5},
        "Redistribution": {"NGO Delivery": 12},
        "NGO Delivery": {},
    }
    dag_dist, dag_prev = dag_shortest_path(dag, "Registration")
    print("total workflow minutes to NGO Delivery:", dag_dist["NGO Delivery"])
    print("optimal path:", dag_path(dag_prev, "Registration", "NGO Delivery"))

    print("\n=== 12. JOHNSON'S ALGORITHM (All-Pairs Shortest Path) ===")
    network_nodes = {
        "Donor_North": {"Center_A": 5, "Center_B": 8},
        "Donor_South": {"Center_A": 6, "Center_B": 3},
        "Center_A": {"NGO_1": 4, "Center_B": -1},  # negative weight reweighted cleanly
        "Center_B": {"NGO_1": 5, "NGO_2": 2},
        "NGO_1": {},
        "NGO_2": {},
    }
    all_pairs = johnson(network_nodes)
    print("Donor_North -> NGO_1:", all_pairs["Donor_North"]["NGO_1"])
    print("Donor_South -> NGO_2:", all_pairs["Donor_South"]["NGO_2"])

    print("\n=== 13. FORD-FULKERSON (Maximum Food Capacity Flow) ===")
    capacity_net = {
        "Donor": {"Hub_1": 150, "Hub_2": 100},
        "Hub_1": {"Hub_2": 30, "NGO_Alpha": 80, "NGO_Beta": 60},
        "Hub_2": {"NGO_Beta": 90},
        "NGO_Alpha": {"Total_Redistribution": 80},
        "NGO_Beta": {"Total_Redistribution": 150},
        "Total_Redistribution": {}
    }
    flow_result = ford_fulkerson(capacity_net, "Donor", "Total_Redistribution")
    print(f"Max food units delivered: {flow_result['max_flow']}")
    print(f"Augmenting paths count: {len(flow_result['augmenting_paths'])}")

    print("\n=== 14. MAXIMUM BIPARTITE MATCHING (Donation-to-Center Allocation) ===")
    matching_graph = {
        "Hot_Meals_Batch_1": ["Kengeri_Center", "Whitefield_Center"],
        "Bakery_Surplus_Batch_2": ["Kengeri_Center"],
        "Perishable_Produce_3": ["Rajajinagar_Center", "Whitefield_Center"],
    }
    match_res = max_bipartite_matching(matching_graph)
    print(f"Total matched pairs: {match_res['matching_count']}")
    print("Assignments:", match_res["matching"])

    print("\n=== 15. CHINESE REMAINDER THEOREM (Collection Synchronization) ===")
    solution, period = chinese_remainder_theorem([1, 2, 3], [3, 5, 7])
    print(f"Synchronized recurring window: {solution} mins, Repeat cycle: {period} mins")


if __name__ == "__main__":
    demo()
