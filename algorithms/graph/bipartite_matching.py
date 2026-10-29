def max_bipartite_matching(compatibility_graph, left_nodes=None, right_nodes=None):
    """
    Maximum Bipartite Matching Algorithm (Augmenting Paths via DFS).

    Finds the maximum cardinality matching in a bipartite graph.
    Used in FoodRescue to match surplus donations (left side) with
    compatible redistribution centers or NGOs (right side).

    Args:
        compatibility_graph:
            Either a dict {left_node: [right_node1, right_node2, ...]}
            OR a dict containing edges between nodes.
        left_nodes: (optional) list of left-partition nodes. If None, keys of compatibility_graph are used.
        right_nodes: (optional) list of right-partition nodes.

    Returns:
        dict:
            - matching_count (int): Total number of maximum matches.
            - matching (dict): Pairs {left_node: matched_right_node}.
            - reverse_matching (dict): Pairs {right_node: matched_left_node}.
            - unmatched_left (list): Unmatched left partition nodes.
            - unmatched_right (list): Unmatched right partition nodes.
    """
    if left_nodes is None:
        left_nodes = list(compatibility_graph.keys())

    all_right_candidates = set()
    for u in left_nodes:
        all_right_candidates.update(compatibility_graph.get(u, []))

    if right_nodes is None:
        right_nodes = list(all_right_candidates)
    else:
        all_right_candidates.update(right_nodes)

    # right_match[v] stores the left node matched to right node v
    right_match = {v: None for v in all_right_candidates}

    def dfs(u, visited):
        """Try to find an augmenting path starting from left node u."""
        for v in compatibility_graph.get(u, []):
            if v not in visited:
                visited.add(v)
                # If v is not matched OR previous match of v can find another match
                if right_match[v] is None or dfs(right_match[v], visited):
                    right_match[v] = u
                    return True
        return False

    matching_count = 0
    # Try to match each left node
    for u in left_nodes:
        visited = set()
        if dfs(u, visited):
            matching_count += 1

    # Invert mapping to produce left -> right matching
    left_match = {}
    for v, u in right_match.items():
        if u is not None:
            left_match[u] = v

    unmatched_left = [u for u in left_nodes if u not in left_match]
    unmatched_right = [v for v in right_nodes if right_match.get(v) is None]

    return {
        "matching_count": matching_count,
        "matching": left_match,
        "reverse_matching": {v: u for v, u in right_match.items() if u is not None},
        "unmatched_left": unmatched_left,
        "unmatched_right": unmatched_right
    }
