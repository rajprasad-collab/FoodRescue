"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Code2,
  GitBranch,
  Network,
  Play,
  RotateCcw,
  Search,
  SortAsc,
  Zap,
} from "lucide-react";
import {
  runBellmanFord,
  runJohnson,
  runFordFulkerson,
  runBipartiteMatching,
  BellmanFordResponse,
  JohnsonResponse,
  FordFulkersonResponse,
  BipartiteMatchingResponse,
} from "@/lib/api";

interface AlgorithmInfo {
  name: string;
  category: "Sorting" | "Searching" | "Graph" | "Number Theory";
  purpose: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  status: string;
}

const ALL_15_ALGORITHMS: AlgorithmInfo[] = [
  // Sorting (6)
  {
    name: "Bubble Sort",
    category: "Sorting",
    purpose: "Small emergency batches requiring immediate sequential verification",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    status: "Operational",
  },
  {
    name: "Selection Sort",
    category: "Sorting",
    purpose: "Priority item selection when minimal memory swaps are prioritized",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    status: "Operational",
  },
  {
    name: "Insertion Sort",
    category: "Sorting",
    purpose: "Continuously updated donation queue with small real-time incoming records",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    status: "Operational",
  },
  {
    name: "Merge Sort",
    category: "Sorting",
    purpose: "Predictable, stable O(n log n) ranking of large cross-city donation datasets",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    status: "Operational",
  },
  {
    name: "Quick Sort",
    category: "Sorting",
    purpose: "High-throughput general priority ranking across active logistics nodes",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    status: "Operational",
  },
  {
    name: "Heap Sort",
    category: "Sorting",
    purpose: "Guaranteed O(n log n) in-place sorting for priority redistribution schedules",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
    status: "Operational",
  },
  // Searching (2)
  {
    name: "Linear Search",
    category: "Searching",
    purpose: "Searching small, unsorted candidate donation entries or direct partner IDs",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    status: "Operational",
  },
  {
    name: "Binary Search",
    category: "Searching",
    purpose: "Rapid logarithmic lookup in pre-sorted center and donation catalog",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
    status: "Operational",
  },
  // Graph (6)
  {
    name: "Dijkstra's Algorithm",
    category: "Graph",
    purpose: "Fast single-source shortest path for non-negative vehicle delivery routing",
    best: "O((V + E) log V)",
    average: "O((V + E) log V)",
    worst: "O(V²)",
    space: "O(V)",
    status: "Operational",
  },
  {
    name: "Bellman-Ford",
    category: "Graph",
    purpose: "Shortest route calculation allowing green-corridor rebates and negative-cycle detection",
    best: "O(E)",
    average: "O(V · E)",
    worst: "O(V · E)",
    space: "O(V)",
    status: "Operational",
  },
  {
    name: "DAG Shortest Path",
    category: "Graph",
    purpose: "Optimal directional pipeline from food inspection to center delivery via topological sorting",
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    space: "O(V)",
    status: "Operational",
  },
  {
    name: "Johnson's Algorithm",
    category: "Graph",
    purpose: "All-pairs shortest distances between all donors, centers, and NGOs via potential reweighting",
    best: "O(V² log V + VE)",
    average: "O(V² log V + VE)",
    worst: "O(V² log V + VE)",
    space: "O(V²)",
    status: "Operational",
  },
  {
    name: "Ford-Fulkerson",
    category: "Graph",
    purpose: "Maximum throughput food flow from multiple collection hubs to NGO sinks under capacity caps",
    best: "O(E · f)",
    average: "O(V · E²)",
    worst: "O(V · E²)",
    space: "O(V + E)",
    status: "Operational",
  },
  {
    name: "Maximum Bipartite Matching",
    category: "Graph",
    purpose: "Optimal 1-to-1 allocation of perishable donations to compatible redistribution centers",
    best: "O(V + E)",
    average: "O(V · E)",
    worst: "O(V · E)",
    space: "O(V)",
    status: "Operational",
  },
  // Number Theory (1)
  {
    name: "Chinese Remainder Theorem",
    category: "Number Theory",
    purpose: "Synchronizing recurring periodic collection schedules across donor fleets",
    best: "O(k log(M))",
    average: "O(k log(M))",
    worst: "O(k log(M))",
    space: "O(k)",
    status: "Operational",
  },
];

export default function AlgorithmsPage() {
  const [selectedDemo, setSelectedDemo] = useState<
    "bellman" | "johnson" | "ford" | "matching"
  >("bellman");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bellmanResult, setBellmanResult] = useState<BellmanFordResponse | null>(null);
  const [johnsonResult, setJohnsonResult] = useState<JohnsonResponse | null>(null);
  const [fordResult, setFordResult] = useState<FordFulkersonResponse | null>(null);
  const [matchingResult, setMatchingResult] = useState<BipartiteMatchingResponse | null>(null);

  async function handleRunDemo() {
    setLoading(true);
    setError(null);

    try {
      if (selectedDemo === "bellman") {
        const graph = {
          Restaurant: { "Center A": 4, "Center B": 7 },
          "Center A": { "NGO A": 3, "Center B": -1 }, // -1 green corridor rebate
          "Center B": { "NGO A": 2 },
          "NGO A": {},
        };
        const res = await runBellmanFord(graph, "Restaurant", "NGO A");
        setBellmanResult(res);
      } else if (selectedDemo === "johnson") {
        const graph = {
          Donor_North: { Center_A: 5, Center_B: 8 },
          Donor_South: { Center_A: 6, Center_B: 3 },
          Center_A: { NGO_1: 4, Center_B: -1 },
          Center_B: { NGO_1: 5, NGO_2: 2 },
          NGO_1: {},
          NGO_2: {},
        };
        const res = await runJohnson(graph);
        setJohnsonResult(res);
      } else if (selectedDemo === "ford") {
        const capacityGraph = {
          Donor: { Hub_1: 150, Hub_2: 100 },
          Hub_1: { Hub_2: 30, NGO_Alpha: 80, NGO_Beta: 60 },
          Hub_2: { NGO_Beta: 90 },
          NGO_Alpha: { Total_Redistribution: 80 },
          NGO_Beta: { Total_Redistribution: 150 },
          Total_Redistribution: {},
        };
        const res = await runFordFulkerson(capacityGraph, "Donor", "Total_Redistribution");
        setFordResult(res);
      } else if (selectedDemo === "matching") {
        const compatibility = {
          "Hot Meals (Batch 1)": ["Kengeri Center", "Whitefield Center"],
          "Bakery Surplus (Batch 2)": ["Kengeri Center"],
          "Perishable Produce (Batch 3)": ["Rajajinagar Center", "Whitefield Center"],
        };
        const res = await runBipartiteMatching(compatibility);
        setMatchingResult(res);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Execution failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-[#17201b]">
      {/* Header */}
      <div className="border-b border-[#dfe3dd] bg-white px-6 py-6">
        <p className="text-xs text-[#7a847d]">FoodRescue / Academic Algorithm Engine</p>
        <h1 className="mt-2 text-2xl font-semibold">Algorithm Engine (15 Algorithms)</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#717b74]">
          Classical and advanced algorithms implemented manually in pure Python and invoked dynamically via the FoodRescue HTTP engine.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* System Banner */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-[#cde5d5] bg-[#f2faf4] p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#27784d]" />
            <div>
              <p className="text-xs font-semibold text-[#27784d]">
                15 Algorithms Active & Demonstrable
              </p>
              <p className="text-[11px] text-[#64776a]">
                Sorting (6) · Searching (2) · Graph (6) · Number Theory (1) — Pure Python, No External Shortcuts
              </p>
            </div>
          </div>
          <span className="rounded-md bg-[#27784d] px-3 py-1 text-xs font-medium text-white">
            Python Engine v2.0
          </span>
        </div>

        {/* Interactive Python Algorithm Demonstration Panel */}
        <section className="mb-8 rounded-xl border border-[#dce2dc] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-[#ecefe9] pb-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#27784d]" />
                <h2 className="text-base font-semibold text-[#17201b]">
                  Live Python Algorithm Execution
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-[#717b74]">
                Trigger live executions on the backend Python engine and inspect calculated results.
              </p>
            </div>

            {/* Selector tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedDemo("bellman"); setBellmanResult(null); setError(null); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedDemo === "bellman"
                    ? "bg-[#173f35] text-white"
                    : "bg-[#edf1ed] text-[#4d5951] hover:bg-[#dfe5e0]"
                }`}
              >
                Bellman-Ford
              </button>
              <button
                onClick={() => { setSelectedDemo("johnson"); setJohnsonResult(null); setError(null); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedDemo === "johnson"
                    ? "bg-[#173f35] text-white"
                    : "bg-[#edf1ed] text-[#4d5951] hover:bg-[#dfe5e0]"
                }`}
              >
                Johnson&apos;s APSP
              </button>
              <button
                onClick={() => { setSelectedDemo("ford"); setFordResult(null); setError(null); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedDemo === "ford"
                    ? "bg-[#173f35] text-white"
                    : "bg-[#edf1ed] text-[#4d5951] hover:bg-[#dfe5e0]"
                }`}
              >
                Ford-Fulkerson Max Flow
              </button>
              <button
                onClick={() => { setSelectedDemo("matching"); setMatchingResult(null); setError(null); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedDemo === "matching"
                    ? "bg-[#173f35] text-white"
                    : "bg-[#edf1ed] text-[#4d5951] hover:bg-[#dfe5e0]"
                }`}
              >
                Bipartite Matching
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {/* Input & Explanation */}
            <div className="rounded-lg border border-[#e4e8e3] bg-[#fafbf9] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#637068]">
                Scenario & Input Data
              </h3>

              {selectedDemo === "bellman" && (
                <div className="mt-2 text-xs text-[#48534c]">
                  <p className="font-medium text-[#173f35]">
                    Single-Source Shortest Path with Green Corridor Rebate:
                  </p>
                  <p className="mt-1">
                    Edge <code className="bg-[#eef2ee] px-1 py-0.5 rounded">Center A → Center B: -1</code> represents an eco-incentive / congestion rebate.
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded bg-[#17201b] p-3 text-[11px] text-[#cde5d5]">
{`Restaurant -> Center A (4), Center B (7)
Center A   -> NGO A (3), Center B (-1)
Center B   -> NGO A (2)`}
                  </pre>
                </div>
              )}

              {selectedDemo === "johnson" && (
                <div className="mt-2 text-xs text-[#48534c]">
                  <p className="font-medium text-[#173f35]">
                    All-Pairs Shortest Paths across Multi-Donor & Multi-NGO Network:
                  </p>
                  <p className="mt-1">
                    Uses Bellman-Ford potential reweighting followed by Dijkstra from every node to compute the complete distance matrix.
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded bg-[#17201b] p-3 text-[11px] text-[#cde5d5]">
{`Donors : Donor_North, Donor_South
Hubs   : Center_A, Center_B (with -1 edge)
Sinks  : NGO_1, NGO_2`}
                  </pre>
                </div>
              )}

              {selectedDemo === "ford" && (
                <div className="mt-2 text-xs text-[#48534c]">
                  <p className="font-medium text-[#173f35]">
                    Food Distribution Network Maximum Capacity:
                  </p>
                  <p className="mt-1">
                    Computes maximum quantity of perishable food deliverable through bottlenecks from primary Donor to NGO distribution sinks.
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded bg-[#17201b] p-3 text-[11px] text-[#cde5d5]">
{`Donor -> Hub_1 (cap: 150), Hub_2 (cap: 100)
Hub_1 -> NGO_Alpha (80), NGO_Beta (60), Hub_2 (30)
Hub_2 -> NGO_Beta (90)
NGOs  -> Total_Redistribution (caps: 80, 150)`}
                  </pre>
                </div>
              )}

              {selectedDemo === "matching" && (
                <div className="mt-2 text-xs text-[#48534c]">
                  <p className="font-medium text-[#173f35]">
                    Maximum Bipartite Matching (Donations ↔ Redistribution Centers):
                  </p>
                  <p className="mt-1">
                    Matches discrete surplus batches to compatible centers based on food type and storage constraints using augmenting paths.
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded bg-[#17201b] p-3 text-[11px] text-[#cde5d5]">
{`Batch 1 (Hot Meals)   -> Kengeri, Whitefield
Batch 2 (Bakery)      -> Kengeri
Batch 3 (Perishables) -> Rajajinagar, Whitefield`}
                  </pre>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleRunDemo}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#173f35] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#23584b] disabled:opacity-50"
                >
                  <Play size={13} />
                  {loading ? "Executing on Python..." : "Execute Python Algorithm"}
                </button>
              </div>
            </div>

            {/* Results Output */}
            <div className="rounded-lg border border-[#e4e8e3] bg-[#fafbf9] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#637068]">
                Python API Output
              </h3>

              {error && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {!error && !bellmanResult && !johnsonResult && !fordResult && !matchingResult && (
                <div className="mt-8 text-center text-xs text-[#8d968f]">
                  Click &quot;Execute Python Algorithm&quot; above to run the manual implementation and view JSON results.
                </div>
              )}

              {bellmanResult && selectedDemo === "bellman" && (
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded bg-[#edf5ef] p-3">
                    <p className="font-semibold text-[#176b45]">
                      Shortest Path: {bellmanResult.path.join(" → ")}
                    </p>
                    <p className="mt-1 text-[#2d4234]">
                      Total Effective Distance: <strong>{bellmanResult.distance} km</strong>
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="font-medium text-[#48534c]">Distances from Restaurant:</p>
                    <pre className="mt-1 rounded bg-[#17201b] p-2 text-[11px] text-[#cde5d5]">
                      {JSON.stringify(bellmanResult.distances, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {johnsonResult && selectedDemo === "johnson" && (
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded bg-[#edf5ef] p-3">
                    <p className="font-semibold text-[#176b45]">
                      All-Pairs Shortest Path Matrix ({johnsonResult.node_count} nodes)
                    </p>
                    <p className="mt-1 text-[#2d4234]">
                      Reweighted potential function h(v) guarantees non-negative weights for Dijkstra passes.
                    </p>
                  </div>
                  <pre className="mt-1 max-h-48 overflow-auto rounded bg-[#17201b] p-2 text-[11px] text-[#cde5d5]">
                    {JSON.stringify(johnsonResult.distances, null, 2)}
                  </pre>
                </div>
              )}

              {fordResult && selectedDemo === "ford" && (
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded bg-[#edf5ef] p-3">
                    <p className="font-semibold text-[#176b45]">
                      Maximum Network Capacity: <strong>{fordResult.max_flow} Units</strong>
                    </p>
                    <p className="mt-1 text-[#2d4234]">
                      Augmenting Paths Evaluated: {fordResult.augmenting_paths.length}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="font-medium text-[#48534c]">Augmenting Paths Breakdown:</p>
                    <div className="mt-1 space-y-1">
                      {fordResult.augmenting_paths.map((p, idx) => (
                        <div key={idx} className="rounded border border-[#dfe5e0] bg-white p-2">
                          <span className="font-mono text-[10px] text-[#176b45]">
                            +{p.flow} units:
                          </span>{" "}
                          <span className="text-[11px]">{p.path.join(" → ")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {matchingResult && selectedDemo === "matching" && (
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded bg-[#edf5ef] p-3">
                    <p className="font-semibold text-[#176b45]">
                      Total Maximum Matches: <strong>{matchingResult.matching_count}</strong>
                    </p>
                    <p className="mt-1 text-[#2d4234]">
                      Augmenting DFS matched 100% of candidate donations to available centers.
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="font-medium text-[#48534c]">Optimal Pairs:</p>
                    <div className="mt-1 space-y-1">
                      {Object.entries(matchingResult.matching).map(([donation, center]) => (
                        <div key={donation} className="flex justify-between rounded border border-[#dfe5e0] bg-white p-2">
                          <span className="font-medium">{donation}</span>
                          <span className="font-semibold text-[#176b45]">→ {center}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 15 Classical & Advanced Algorithms Catalog */}
        <h2 className="mb-4 text-lg font-semibold text-[#17201b]">
          Complete Academic Algorithm Catalog
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {["Sorting", "Searching", "Graph", "Number Theory"].map((category) => {
            const algos = ALL_15_ALGORITHMS.filter((a) => a.category === category);
            const icon =
              category === "Sorting" ? (
                <SortAsc size={17} />
              ) : category === "Searching" ? (
                <Search size={17} />
              ) : category === "Graph" ? (
                <GitBranch size={17} />
              ) : (
                <Code2 size={17} />
              );

            return (
              <section
                key={category}
                className="rounded-xl border border-[#dce2dc] bg-white"
              >
                <div className="flex items-center gap-3 border-b border-[#e6e9e5] px-5 py-4">
                  <div className="rounded-lg bg-[#edf4ef] p-2 text-[#176b45]">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{category}</h3>
                    <p className="text-[11px] text-[#7c857e]">
                      {algos.length} manual Python {algos.length === 1 ? "implementation" : "implementations"}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-[#edf0ec]">
                  {algos.map((algo) => (
                    <div key={algo.name} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-[#17201b]">
                              {algo.name}
                            </h4>
                            <span className="rounded bg-[#eaf4ee] px-1.5 py-0.5 text-[9px] font-medium text-[#206941]">
                              {algo.status}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-[#7c857e]">
                            {algo.purpose}
                          </p>
                        </div>
                        <span className="whitespace-nowrap rounded bg-[#f3f5f2] px-2 py-1 text-[10px] font-medium text-[#637068]">
                          Avg: {algo.average}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#637068]">
                        <span className="rounded bg-[#f8faf8] px-2 py-0.5 border border-[#e6eae6]">
                          Best: {algo.best}
                        </span>
                        <span className="rounded bg-[#f8faf8] px-2 py-0.5 border border-[#e6eae6]">
                          Worst: {algo.worst}
                        </span>
                        <span className="rounded bg-[#f8faf8] px-2 py-0.5 border border-[#e6eae6]">
                          Space: {algo.space}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
