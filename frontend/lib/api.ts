const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface RouteResult {
  distance: number;
  path: string[];
}

export interface ShortestRouteResponse {
  success: boolean;
  route: RouteResult;
  error?: string;
}

export interface SelfHealingResponse {
  success: boolean;
  status: string;
  failed_node: string;
  node_disabled: boolean;
  original_route: RouteResult;
  new_route: RouteResult;
  error?: string;
}

export interface CRTResponse {
  success: boolean;
  result: number;
  repeat_period: number;
  error?: string;
}

export interface PriorityResponse {
  success: boolean;
  priority_score: number;
  urgency: string;
  expiry_score: number;
  quantity_score: number;
  minutes_remaining: number;
  error?: string;
}

export interface BellmanFordResponse {
  success: boolean;
  algorithm: string;
  source: string;
  destination?: string;
  distance: number | null;
  path: string[];
  distances: Record<string, number | null>;
  error?: string;
}

export interface JohnsonResponse {
  success: boolean;
  algorithm: string;
  distances: Record<string, Record<string, number | null>>;
  node_count: number;
  error?: string;
}

export interface FordFulkersonResponse {
  success: boolean;
  algorithm: string;
  source: string;
  sink: string;
  max_flow: number;
  flow: Record<string, Record<string, number>>;
  residual: Record<string, Record<string, number>>;
  augmenting_paths: Array<{ path: string[]; flow: number }>;
  error?: string;
}

export interface BipartiteMatchingResponse {
  success: boolean;
  algorithm: string;
  matching_count: number;
  matching: Record<string, string>;
  reverse_matching: Record<string, string>;
  unmatched_left: string[];
  unmatched_right: string[];
  error?: string;
}

export interface DAGResponse {
  success: boolean;
  algorithm: string;
  source: string;
  target?: string;
  distance: number | null;
  path: string[];
  distances: Record<string, number | null>;
  error?: string;
}

export async function checkApiHealth() {
  const response = await fetch(`${API_URL}/api/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("FoodRescue Python API is unavailable.");
  }

  return response.json();
}

export async function findShortestRoute(
  graph: Record<string, Record<string, number>>,
  source: string,
  destination: string
): Promise<ShortestRouteResponse> {
  const response = await fetch(`${API_URL}/api/routing/shortest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graph, source, destination }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to calculate shortest route.");
  }
  return data;
}

export async function selfHealRoute(
  graph: Record<string, Record<string, number>>,
  source: string,
  destination: string,
  failedNode: string
): Promise<SelfHealingResponse> {
  const response = await fetch(`${API_URL}/api/routing/self-heal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      graph,
      source,
      destination,
      failed_node: failedNode,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Self-healing route calculation failed.");
  }
  return data;
}

export async function calculateCRT(
  remainders: number[],
  moduli: number[]
): Promise<CRTResponse> {
  const response = await fetch(`${API_URL}/api/algorithms/crt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ remainders, moduli }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "CRT calculation failed.");
  }
  return data;
}

export async function calculateDonationPriority(
  expiryAt: string,
  quantity: number,
  demandScore: number,
  donorPriority: number
): Promise<PriorityResponse> {
  const response = await fetch(`${API_URL}/api/donations/calculate-priority`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      expiry_at: expiryAt,
      quantity,
      demand_score: demandScore,
      donor_priority: donorPriority,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to calculate donation priority.");
  }
  return data;
}

export async function runBellmanFord(
  graph: Record<string, Record<string, number>>,
  source: string,
  destination?: string
): Promise<BellmanFordResponse> {
  const response = await fetch(`${API_URL}/api/algorithms/bellman-ford`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graph, source, destination }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Bellman-Ford calculation failed.");
  }
  return data;
}

export async function runJohnson(
  graph: Record<string, Record<string, number>>
): Promise<JohnsonResponse> {
  const response = await fetch(`${API_URL}/api/algorithms/johnson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graph }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Johnson's algorithm failed.");
  }
  return data;
}

export async function runFordFulkerson(
  graph: Record<string, Record<string, number>>,
  source: string,
  sink: string
): Promise<FordFulkersonResponse> {
  const response = await fetch(`${API_URL}/api/algorithms/ford-fulkerson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graph, source, sink }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Ford-Fulkerson algorithm failed.");
  }
  return data;
}

export async function runBipartiteMatching(
  graph: Record<string, string[]>,
  leftNodes?: string[],
  rightNodes?: string[]
): Promise<BipartiteMatchingResponse> {
  const response = await fetch(`${API_URL}/api/algorithms/bipartite-matching`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graph, left_nodes: leftNodes, right_nodes: rightNodes }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Bipartite matching algorithm failed.");
  }
  return data;
}

export async function runDAG(
  graph: Record<string, Record<string, number>>,
  source: string,
  target?: string
): Promise<DAGResponse> {
  const response = await fetch(`${API_URL}/api/algorithms/dag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ graph, source, target }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "DAG shortest path calculation failed.");
  }
  return data;
}
