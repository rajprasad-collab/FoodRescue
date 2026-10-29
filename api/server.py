from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from datetime import datetime, timezone
import sys
import json
import time
import random
import math


# ============================================================
# ADD PROJECT ROOT TO PYTHON PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ============================================================
# IMPORT FOODRESCUE SERVICES / ALGORITHMS
# ============================================================

from services.priority_service import (
    calculate_priority,
    classify_urgency,
    expiry_urgency,
)

from services.routing_service import (
    find_shortest_route,
    disable_node,
)

from algorithms.number_theory.chinese_remainder import (
    chinese_remainder_theorem,
)

from algorithms.sorting.bubble_sort import bubble_sort
from algorithms.sorting.selection_sort import selection_sort
from algorithms.sorting.insertion_sort import insertion_sort
from algorithms.sorting.merge_sort import merge_sort
from algorithms.sorting.quick_sort import quick_sort
from algorithms.sorting.heap_sort import heap_sort

from algorithms.searching.linear_search import linear_search
from algorithms.searching.binary_search import binary_search

from algorithms.graph.dijkstra import dijkstra, reconstruct_path as dijkstra_reconstruct_path
from algorithms.graph.dag_shortest_path import (
    dag_shortest_path,
    reconstruct_path as dag_reconstruct_path,
)
from algorithms.graph.bellman_ford import (
    bellman_ford,
    reconstruct_path as bf_reconstruct_path,
)
from algorithms.graph.johnson import johnson
from algorithms.graph.ford_fulkerson import ford_fulkerson
from algorithms.graph.bipartite_matching import max_bipartite_matching


# ============================================================
# SERVER CONFIGURATION
# ============================================================

HOST = "0.0.0.0"
PORT = 8000


SORTING_ALGORITHMS = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    "merge": merge_sort,
    "quick": quick_sort,
    "heap": heap_sort,
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def send_json(handler, status_code, data):

    response = json.dumps(data).encode("utf-8")

    handler.send_response(status_code)

    handler.send_header(
        "Content-Type",
        "application/json"
    )

    # --------------------------------------------------------
    # CORS
    # --------------------------------------------------------

    handler.send_header(
        "Access-Control-Allow-Origin",
        "*"
    )

    handler.send_header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    )

    handler.send_header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    )

    handler.end_headers()

    handler.wfile.write(response)


def read_json(handler):

    content_length = int(
        handler.headers.get(
            "Content-Length",
            0
        )
    )

    if content_length == 0:
        return {}

    body = handler.rfile.read(
        content_length
    )

    return json.loads(
        body.decode("utf-8")
    )


# ============================================================
# FOODRESCUE API HANDLER
# ============================================================

class FoodRescueAPI(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        pass

    # --------------------------------------------------------
    # OPTIONS / CORS
    # --------------------------------------------------------

    def do_OPTIONS(self):

        send_json(
            self,
            200,
            {
                "status": "ok"
            }
        )

    # ========================================================
    # GET REQUESTS
    # ========================================================

    def do_GET(self):

        # ----------------------------------------------------
        # HEALTH CHECK
        # ----------------------------------------------------

        if self.path == "/api/health":

            send_json(
                self,
                200,
                {
                    "status": "healthy",
                    "service": "FoodRescue Python Algorithm Engine",
                    "version": "2.0",
                    "algorithm_count": 15
                }
            )

            return

        # ----------------------------------------------------
        # API INFORMATION
        # ----------------------------------------------------

        if self.path == "/api":

            send_json(
                self,
                200,
                {
                    "name": "FoodRescue API",
                    "version": "2.0",
                    "status": "running",
                    "algorithms": [
                        "Bubble Sort",
                        "Selection Sort",
                        "Insertion Sort",
                        "Merge Sort",
                        "Quick Sort",
                        "Heap Sort",
                        "Linear Search",
                        "Binary Search",
                        "Dijkstra",
                        "Bellman-Ford",
                        "DAG Shortest Path",
                        "Johnson's Algorithm",
                        "Ford-Fulkerson",
                        "Maximum Bipartite Matching",
                        "Chinese Remainder Theorem"
                    ]
                }
            )

            return

        # ----------------------------------------------------
        # UNKNOWN GET ENDPOINT
        # ----------------------------------------------------

        send_json(
            self,
            404,
            {
                "success": False,
                "error": "Endpoint not found"
            }
        )

    # ========================================================
    # POST REQUESTS
    # ========================================================

    def do_POST(self):

        try:

            data = read_json(self)

            # =================================================
            # 1. SHORTEST ROUTE — DIJKSTRA
            # =================================================

            if self.path == "/api/routing/shortest":

                graph = data["graph"]
                source = data["source"]
                destination = data["destination"]

                route = find_shortest_route(
                    graph,
                    source,
                    destination
                )

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "route": route
                    }
                )

                return

            # =================================================
            # 2. SELF-HEALING ROUTE
            # =================================================

            if self.path == "/api/routing/self-heal":

                graph = data["graph"]
                source = data["source"]
                destination = data["destination"]
                failed_node = data["failed_node"]

                original_route = find_shortest_route(
                    graph,
                    source,
                    destination
                )

                node_disabled = disable_node(
                    graph,
                    failed_node
                )

                new_route = find_shortest_route(
                    graph,
                    source,
                    destination
                )

                if new_route["path"]:
                    status = "SELF_HEALED"
                else:
                    status = "NO_ALTERNATIVE_ROUTE"

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "status": status,
                        "failed_node": failed_node,
                        "node_disabled": node_disabled,
                        "original_route": original_route,
                        "new_route": new_route
                    }
                )

                return

            # =================================================
            # 3. CHINESE REMAINDER THEOREM
            # =================================================

            if self.path == "/api/algorithms/crt":

                remainders = data["remainders"]
                moduli = data["moduli"]

                result, repeat_period = (
                    chinese_remainder_theorem(
                        remainders,
                        moduli
                    )
                )

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "result": result,
                        "repeat_period": repeat_period
                    }
                )

                return

            # =================================================
            # 4. BELLMAN-FORD (Negative Weights / Cycles)
            # =================================================

            if self.path == "/api/algorithms/bellman-ford":

                graph = data.get("graph")
                source = data.get("source")
                destination = data.get("destination")

                if not graph or not source:
                    raise ValueError("Both 'graph' and 'source' are required.")

                distances, previous = bellman_ford(graph, source)

                path = []
                target_distance = None
                if destination:
                    path = bf_reconstruct_path(previous, source, destination)
                    dist_val = distances.get(destination)
                    target_distance = None if dist_val == math.inf else dist_val

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "algorithm": "Bellman-Ford",
                        "source": source,
                        "destination": destination,
                        "distance": target_distance,
                        "path": path,
                        "distances": {
                            k: (None if v == math.inf else v)
                            for k, v in distances.items()
                        }
                    }
                )

                return

            # =================================================
            # 5. JOHNSON'S ALGORITHM (All-Pairs Shortest Path)
            # =================================================

            if self.path == "/api/algorithms/johnson":

                graph = data.get("graph")
                if not graph:
                    raise ValueError("'graph' dictionary is required.")

                all_pairs = johnson(graph)

                # Format infinite distances cleanly for JSON
                formatted = {}
                for u in all_pairs:
                    formatted[u] = {}
                    for v, d in all_pairs[u].items():
                        formatted[u][v] = None if d == math.inf else d

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "algorithm": "Johnson's Algorithm",
                        "distances": formatted,
                        "node_count": len(all_pairs)
                    }
                )

                return

            # =================================================
            # 6. FORD-FULKERSON (Maximum Flow)
            # =================================================

            if self.path == "/api/algorithms/ford-fulkerson":

                graph = data.get("graph")
                source = data.get("source")
                sink = data.get("sink")

                if not graph or not source or not sink:
                    raise ValueError("'graph', 'source', and 'sink' are required.")

                result = ford_fulkerson(graph, source, sink)

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "algorithm": "Ford-Fulkerson",
                        "source": source,
                        "sink": sink,
                        "max_flow": result["max_flow"],
                        "flow": result["flow"],
                        "residual": result["residual"],
                        "augmenting_paths": result["augmenting_paths"]
                    }
                )

                return

            # =================================================
            # 7. MAXIMUM BIPARTITE MATCHING
            # =================================================

            if self.path == "/api/algorithms/bipartite-matching":

                graph = data.get("graph")
                if not graph or not isinstance(graph, dict):
                    raise ValueError("'graph' mapping (e.g. {donation_id: [compatible_centers]}) is required.")

                left_nodes = data.get("left_nodes")
                right_nodes = data.get("right_nodes")

                result = max_bipartite_matching(graph, left_nodes, right_nodes)

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "algorithm": "Maximum Bipartite Matching",
                        "matching_count": result["matching_count"],
                        "matching": result["matching"],
                        "reverse_matching": result["reverse_matching"],
                        "unmatched_left": result["unmatched_left"],
                        "unmatched_right": result["unmatched_right"]
                    }
                )

                return

            # =================================================
            # 8. DAG SHORTEST PATH
            # =================================================

            if self.path == "/api/algorithms/dag":

                graph = data.get("graph")
                source = data.get("source")
                target = data.get("target")

                if not graph or not source:
                    raise ValueError("'graph' and 'source' are required.")

                distances, previous = dag_shortest_path(graph, source)
                path = []
                target_dist = None
                if target:
                    path = dag_reconstruct_path(previous, source, target)
                    dist_val = distances.get(target)
                    target_dist = None if dist_val == math.inf else dist_val

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "algorithm": "DAG Shortest Path",
                        "source": source,
                        "target": target,
                        "distance": target_dist,
                        "path": path,
                        "distances": {
                            k: (None if v == math.inf else v)
                            for k, v in distances.items()
                        }
                    }
                )

                return

            # =================================================
            # 9. SORTING DEMONSTRATION
            # =================================================

            if self.path == "/api/algorithms/sort":

                algorithm_name = data.get("algorithm", "bubble")
                input_data = data.get("data", [])

                if not isinstance(input_data, list):
                    raise ValueError("data must be a list of numbers.")

                fn = SORTING_ALGORITHMS.get(algorithm_name)
                if fn is None:
                    raise ValueError(f"Unknown sorting algorithm '{algorithm_name}'.")

                start = time.perf_counter()
                sorted_data, comparisons, swaps = fn(input_data)
                elapsed_ms = (time.perf_counter() - start) * 1000

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "algorithm": algorithm_name,
                        "original": input_data,
                        "sorted": sorted_data,
                        "comparisons": comparisons,
                        "swaps": swaps,
                        "elapsed_ms": round(elapsed_ms, 4)
                    }
                )

                return

            # =================================================
            # 10. SEARCHING DEMONSTRATION
            # =================================================

            if self.path == "/api/algorithms/search":

                algorithm_name = data.get("algorithm", "linear")
                dataset = data.get("data", [])
                target = data.get("target")

                if target is None or not isinstance(dataset, list):
                    raise ValueError("'data' list and 'target' value are required.")

                start = time.perf_counter()
                if algorithm_name == "binary":
                    # Binary search operates on sorted array
                    sorted_data = sorted(dataset)
                    idx, comparisons = binary_search(sorted_data, target)
                    elapsed_ms = (time.perf_counter() - start) * 1000
                    send_json(
                        self,
                        200,
                        {
                            "success": True,
                            "algorithm": "Binary Search",
                            "data": sorted_data,
                            "target": target,
                            "index": idx,
                            "found": idx != -1,
                            "comparisons": comparisons,
                            "elapsed_ms": round(elapsed_ms, 6)
                        }
                    )
                else:
                    idx, comparisons = linear_search(dataset, target)
                    elapsed_ms = (time.perf_counter() - start) * 1000
                    send_json(
                        self,
                        200,
                        {
                            "success": True,
                            "algorithm": "Linear Search",
                            "data": dataset,
                            "target": target,
                            "index": idx,
                            "found": idx != -1,
                            "comparisons": comparisons,
                            "elapsed_ms": round(elapsed_ms, 6)
                        }
                    )

                return

            # =================================================
            # 11. BENCHMARKING
            # =================================================

            if self.path == "/api/algorithms/benchmark":

                sizes = data.get("sizes", [100, 500, 1000, 5000])
                sizes = [s for s in sizes if isinstance(s, int) and 0 < s <= 10000]

                benchmark_results = []
                for size in sizes:
                    sample = [random.randint(1, 10000) for _ in range(size)]
                    size_entry = {"input_size": size, "algorithms": {}}
                    for name, fn in SORTING_ALGORITHMS.items():
                        data_copy = sample[:]
                        t0 = time.perf_counter()
                        _, comp, swp = fn(data_copy)
                        ms = (time.perf_counter() - t0) * 1000
                        size_entry["algorithms"][name] = {
                            "elapsed_ms": round(ms, 4),
                            "comparisons": comp,
                            "swaps": swp
                        }
                    benchmark_results.append(size_entry)

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "benchmark": benchmark_results,
                        "note": "Runtime benchmark results generated dynamically using random integer datasets."
                    }
                )

                return

            # =================================================
            # 12. DONATION PRIORITY CALCULATION
            # =================================================

            if self.path == "/api/donations/calculate-priority":

                expiry_at = data["expiry_at"]
                quantity = float(data["quantity"])
                demand_score = float(data["demand_score"])
                donor_priority = float(data["donor_priority"])

                if quantity <= 0:
                    raise ValueError("Quantity must be greater than zero.")

                if not 0 <= demand_score <= 100:
                    raise ValueError("Demand score must be between 0 and 100.")

                if not 0 <= donor_priority <= 100:
                    raise ValueError("Donor priority must be between 0 and 100.")

                expiry_time = datetime.fromisoformat(expiry_at.replace("Z", "+00:00"))
                if expiry_time.tzinfo is None:
                    expiry_time = expiry_time.replace(tzinfo=timezone.utc)

                current_time = datetime.now(timezone.utc)
                minutes_remaining = max(0.0, (expiry_time - current_time).total_seconds() / 60)

                expiry_score = expiry_urgency(minutes_remaining)
                quantity_score = min(100.0, (quantity / 200.0) * 100.0)

                priority_score = calculate_priority(
                    expiry_urgency=expiry_score,
                    quantity_score=quantity_score,
                    demand_score=demand_score,
                    donor_priority=donor_priority,
                )

                urgency = classify_urgency(priority_score)

                send_json(
                    self,
                    200,
                    {
                        "success": True,
                        "priority_score": priority_score,
                        "urgency": urgency,
                        "expiry_score": round(expiry_score, 2),
                        "quantity_score": round(quantity_score, 2),
                        "minutes_remaining": round(minutes_remaining, 2)
                    }
                )

                return

            # =================================================
            # UNKNOWN POST ENDPOINT
            # =================================================

            send_json(
                self,
                404,
                {
                    "success": False,
                    "error": "Endpoint not found"
                }
            )

        except Exception as error:

            send_json(
                self,
                400,
                {
                    "success": False,
                    "error": str(error)
                }
            )


# ============================================================
# START SERVER
# ============================================================

def main():

    server = HTTPServer(
        (HOST, PORT),
        FoodRescueAPI
    )

    print("=" * 60)
    print("       FOODRESCUE PYTHON ALGORITHM API")
    print("=" * 60)
    print(f"Server running on http://localhost:{PORT}")
    print("Project root:", PROJECT_ROOT)
    print("Algorithms: 15 classical and advanced algorithms operational.")
    print("Press CTRL+C to stop.")
    print("=" * 60)

    server.serve_forever()


if __name__ == "__main__":
    main()
