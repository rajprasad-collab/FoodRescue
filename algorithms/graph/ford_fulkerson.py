def ford_fulkerson(capacity_graph, source, sink):
    """
    Ford-Fulkerson Maximum Flow Algorithm (Edmonds-Karp BFS implementation).

    Computes the maximum flow from source to sink in a flow network
    where edges have capacity constraints.

    capacity_graph format:
        {
            "Donor": {"Center_A": 100, "Center_B": 50},
            "Center_A": {"NGO_1": 70, "NGO_2": 30},
            "Center_B": {"NGO_2": 40},
            "NGO_1": {"Sink": 70},
            "NGO_2": {"Sink": 70},
            "Sink": {}
        }

    Returns:
        dict:
            - max_flow (float): Total maximum flow from source to sink.
            - flow (dict): Detailed flow on each directed edge {u: {v: flow_val}}.
            - residual (dict): Final residual capacities {u: {v: remaining_cap}}.
            - augmenting_paths (list): List of paths found with their bottleneck capacities.
    """
    nodes = set(capacity_graph)
    for neighbors in capacity_graph.values():
        nodes.update(neighbors)

    if source not in nodes or sink not in nodes:
        raise ValueError(f"Source '{source}' or Sink '{sink}' not found in graph.")

    # Initialize residual capacities
    residual = {u: {} for u in nodes}
    for u in nodes:
        for v in nodes:
            residual[u][v] = 0.0

    for u, neighbors in capacity_graph.items():
        for v, cap in neighbors.items():
            residual[u][v] = float(cap)

    max_flow = 0.0
    augmenting_paths = []

    # BFS to find an augmenting path from source to sink in residual graph
    def find_augmenting_path():
        parent = {node: None for node in nodes}
        visited = {source}
        queue = [source]

        while queue:
            curr = queue.pop(0)
            if curr == sink:
                break
            for next_node in nodes:
                if next_node not in visited and residual[curr][next_node] > 1e-9:
                    visited.add(next_node)
                    parent[next_node] = curr
                    queue.append(next_node)

        if sink not in visited:
            return None, 0.0

        # Reconstruct path and find bottleneck capacity
        path = []
        curr = sink
        bottleneck = float("inf")

        while curr != source:
            prev = parent[curr]
            bottleneck = min(bottleneck, residual[prev][curr])
            path.append(curr)
            curr = prev
        path.append(source)
        path.reverse()

        return path, bottleneck

    # Augment flow while path exists
    while True:
        path, bottleneck = find_augmenting_path()
        if not path or bottleneck <= 0:
            break

        # Apply flow along the augmenting path
        for i in range(len(path) - 1):
            u = path[i]
            v = path[i + 1]
            residual[u][v] -= bottleneck
            residual[v][u] += bottleneck

        max_flow += bottleneck
        augmenting_paths.append({
            "path": path,
            "flow": bottleneck
        })

    # Compute actual directed flow: flow(u, v) = original_capacity(u, v) - residual(u, v)
    flow = {}
    for u in capacity_graph:
        flow[u] = {}
        for v, cap in capacity_graph[u].items():
            actual_flow = cap - residual[u][v]
            flow[u][v] = round(max(0.0, actual_flow), 2)

    # Format residual output to keep only non-zero edges
    filtered_residual = {}
    for u in nodes:
        active_edges = {v: round(c, 2) for v, c in residual[u].items() if c > 1e-9}
        if active_edges:
            filtered_residual[u] = active_edges

    return {
        "max_flow": round(max_flow, 2),
        "flow": flow,
        "residual": filtered_residual,
        "augmenting_paths": augmenting_paths
    }
