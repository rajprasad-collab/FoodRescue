"use client";

import { useState } from "react";
import { BarChart3, Gauge, Play, RefreshCw, Zap } from "lucide-react";

interface BenchmarkEntry {
  input_size: number;
  algorithms: Record<
    string,
    {
      elapsed_ms: number;
      comparisons: number;
      swaps: number;
    }
  >;
}

const THEORETICAL_COMPLEXITY_TABLE = [
  // Sorting (6)
  {
    name: "Bubble Sort",
    category: "Sorting",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    notes: "Best when already sorted with early termination break",
  },
  {
    name: "Selection Sort",
    category: "Sorting",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    notes: "Minimizes write operations; always performs O(n²) comparisons",
  },
  {
    name: "Insertion Sort",
    category: "Sorting",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    notes: "Adaptive and online; fast for nearly-sorted incoming batches",
  },
  {
    name: "Merge Sort",
    category: "Sorting",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    notes: "Guaranteed stable divide-and-conquer runtime",
  },
  {
    name: "Quick Sort",
    category: "Sorting",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    notes: "In-place partitioning with high average-case performance",
  },
  {
    name: "Heap Sort",
    category: "Sorting",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
    notes: "Binary max-heap based; non-recursive O(1) auxiliary space",
  },
  // Searching (2)
  {
    name: "Linear Search",
    category: "Searching",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    notes: "Sequential scan, no precondition on data order",
  },
  {
    name: "Binary Search",
    category: "Searching",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
    notes: "Requires pre-sorted array; halves search interval each step",
  },
  // Graph (6)
  {
    name: "Dijkstra",
    category: "Graph",
    best: "O((V + E) log V)",
    average: "O((V + E) log V)",
    worst: "O(V²)",
    space: "O(V)",
    notes: "Greedy single-source shortest path for non-negative weights",
  },
  {
    name: "Bellman-Ford",
    category: "Graph",
    best: "O(E)",
    average: "O(V · E)",
    worst: "O(V · E)",
    space: "O(V)",
    notes: "Supports negative edges and detects negative-weight cycles",
  },
  {
    name: "DAG Shortest Path",
    category: "Graph",
    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    space: "O(V)",
    notes: "Topological sorting order relaxation for acyclic workflow graphs",
  },
  {
    name: "Johnson's Algorithm",
    category: "Graph",
    best: "O(V² log V + VE)",
    average: "O(V² log V + VE)",
    worst: "O(V² log V + VE)",
    space: "O(V²)",
    notes: "All-pairs shortest paths via Bellman-Ford reweighting + Dijkstra",
  },
  {
    name: "Ford-Fulkerson",
    category: "Graph",
    best: "O(E · f)",
    average: "O(V · E²)",
    worst: "O(V · E²)",
    space: "O(V + E)",
    notes: "Edmonds-Karp BFS implementation for maximum network capacity",
  },
  {
    name: "Maximum Bipartite Matching",
    category: "Graph",
    best: "O(V + E)",
    average: "O(V · E)",
    worst: "O(V · E)",
    space: "O(V)",
    notes: "Augmenting path DFS matching donations to centers",
  },
  // Number Theory (1)
  {
    name: "Chinese Remainder Theorem",
    category: "Number Theory",
    best: "O(k log(M))",
    average: "O(k log(M))",
    worst: "O(k log(M))",
    space: "O(k)",
    notes: "Extended Euclidean algorithm for modular schedule synchronization",
  },
];

export default function PerformancePage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkEntry[] | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runPythonBenchmark() {
    setRunning(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/algorithms/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sizes: [100, 500, 1000, 2000] }),
      });

      if (!res.ok) {
        throw new Error("Failed to execute benchmark on Python engine.");
      }

      const data = await res.json();
      setBenchmarks(data.benchmark);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach Python API benchmark service."
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-[#17201b]">
      {/* Header */}
      <div className="border-b border-[#dfe3dd] bg-white px-6 py-6">
        <p className="text-xs text-[#7a847d]">FoodRescue / Performance & Complexity</p>
        <h1 className="mt-2 text-2xl font-semibold">Algorithm Performance & Complexity</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#717b74]">
          Comprehensive academic analysis of all 15 algorithms comparing theoretical time and space complexity against measured runtime benchmarks on the Python engine.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6 space-y-8">
        {/* Section 1: Academic Complexity Table */}
        <section className="rounded-xl border border-[#dce2dc] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#edf0ec] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Gauge size={18} className="text-[#176b45]" />
                <h2 className="text-base font-semibold text-[#17201b]">
                  Theoretical Complexity Analysis (All 15 Algorithms)
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-[#7a847d]">
                Asymptotic bounds derived from algorithmic structure and validated in pure Python.
              </p>
            </div>
            <span className="rounded bg-[#f0f4f1] px-2.5 py-1 text-xs font-medium text-[#176b45]">
              Academic Standard
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e5e9e4] bg-[#f8faf8] text-[#556157]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Algorithm</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Best Case</th>
                  <th className="py-3 px-4 font-semibold">Average Case</th>
                  <th className="py-3 px-4 font-semibold">Worst Case</th>
                  <th className="py-3 px-4 font-semibold">Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0ec]">
                {THEORETICAL_COMPLEXITY_TABLE.map((row) => (
                  <tr key={row.name} className="hover:bg-[#fafbf9] transition">
                    <td className="py-3 px-4 font-medium text-[#17201b]">
                      {row.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-[#edf4ef] px-2 py-0.5 text-[11px] font-medium text-[#206941]">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#2d4234]">
                      {row.best}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-semibold text-[#176b45]">
                      {row.average}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#717b74]">
                      {row.worst}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#34413a]">
                      {row.space}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Live Python Measured Runtime Benchmark */}
        <section className="rounded-xl border border-[#dce2dc] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-[#edf0ec] pb-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#176b45]" />
                <h2 className="text-base font-semibold text-[#17201b]">
                  Measured Runtime Benchmark Results (Python Engine)
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-[#7a847d]">
                Empirical execution time, comparison counts, and element swaps executed dynamically by Python on random integer arrays.
              </p>
            </div>

            <button
              onClick={runPythonBenchmark}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-[#173f35] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#23584b] disabled:opacity-50"
            >
              {running ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Running Benchmarks...
                </>
              ) : (
                <>
                  <Play size={13} />
                  Run Live Python Benchmark
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              {error}
            </div>
          )}

          {!error && !benchmarks && (
            <div className="mt-8 rounded-lg border border-dashed border-[#dce2dc] bg-[#fafbf9] p-8 text-center">
              <Zap size={24} className="mx-auto text-[#176b45] opacity-60" />
              <p className="mt-2 text-xs font-medium text-[#48534c]">
                No runtime measurements loaded yet
              </p>
              <p className="mt-1 text-[11px] text-[#7a847d]">
                Click &quot;Run Live Python Benchmark&quot; to invoke POST /api/algorithms/benchmark on http://localhost:8000.
              </p>
            </div>
          )}

          {benchmarks && (
            <div className="mt-6 space-y-6">
              <div className="rounded-md border border-[#cde5d5] bg-[#f2faf4] p-3 text-xs text-[#206941]">
                <strong>Runtime Benchmark Verification:</strong> These values represent real wall-clock execution times (ms) measured with <code>time.perf_counter()</code> in Python.
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {benchmarks.map((entry) => (
                  <div
                    key={entry.input_size}
                    className="rounded-lg border border-[#e4e8e3] bg-[#fafbf9] p-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#e5e9e4] pb-2">
                      <h4 className="text-xs font-bold text-[#17201b]">
                        Dataset Size: {entry.input_size} items
                      </h4>
                      <span className="text-[11px] text-[#717b74]">
                        Random Integers
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {Object.entries(entry.algorithms).map(([name, stats]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded bg-white p-2 border border-[#edf0ec] text-xs"
                        >
                          <span className="font-medium capitalize text-[#26352f]">
                            {name} Sort
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-[#717b74]">
                              {stats.comparisons.toLocaleString()} comps
                            </span>
                            <span className="rounded bg-[#eaf4ee] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#176b45]">
                              {stats.elapsed_ms.toFixed(3)} ms
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
