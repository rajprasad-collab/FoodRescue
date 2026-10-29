"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Route,
  ShieldCheck,
} from "lucide-react";

import {
  findShortestRoute,
  selfHealRoute,
} from "../../lib/api";

const graph = {
  Restaurant: {
    "Center A": 4,
    "Center B": 7,
  },
  "Center A": {
    "NGO A": 3,
    "Center B": 2,
  },
  "Center B": {
    "NGO A": 2,
  },
  "NGO A": {},
};

export default function RoutesPage() {
  const [path, setPath] = useState<string[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [healed, setHealed] = useState(false);

  async function calculate() {
    const result = await findShortestRoute(
      graph,
      "Restaurant",
      "NGO A"
    );

    setPath(result.route.path);
    setDistance(result.route.distance);
    setHealed(false);
  }

  async function heal() {
    const result = await selfHealRoute(
      graph,
      "Restaurant",
      "NGO A",
      "Center A"
    );

    setPath(result.new_route.path);
    setDistance(result.new_route.distance);
    setHealed(result.status === "SELF_HEALED");
  }

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-[#17201b]">

      <div className="border-b border-[#dfe3dd] bg-white px-6 py-6">

        <p className="text-xs text-[#7a847d]">
          FoodRescue / Routes
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          Route management
        </h1>

        <p className="mt-1 text-sm text-[#717b74]">
          Calculate delivery paths and recover automatically from network failures.
        </p>

      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">

        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">

          <section className="rounded-xl border border-[#dce2dc] bg-white">

            <div className="border-b border-[#e6e9e5] p-5">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-[#edf4ef] p-2">
                  <Route
                    size={18}
                    className="text-[#176b45]"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Redistribution network
                  </h2>

                  <p className="text-xs text-[#7c857e]">
                    Weighted graph used by Dijkstra
                  </p>
                </div>

              </div>

            </div>

            <div className="p-6">

              <div className="mb-7 flex items-center justify-center gap-2">

                <Node label="Restaurant" />

                <Edge distance="4 km" />

                <Node label="Center A" />

                <Edge distance="3 km" />

                <Node label="NGO A" />

              </div>

              <div className="mb-6 flex justify-center">

                <div className="text-xs text-[#7c857e]">
                  Alternative path available through Center B
                </div>

              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <button
                  onClick={calculate}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#176b45] px-4 py-3 text-xs font-semibold text-white hover:bg-[#125c3b]"
                >
                  <GitBranch size={15} />
                  Calculate shortest path
                </button>

                <button
                  onClick={heal}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#d9dfda] px-4 py-3 text-xs font-semibold hover:bg-[#f7f8f6]"
                >
                  <ShieldCheck size={15} />
                  Simulate failure
                </button>

              </div>

            </div>

          </section>

          <section className="rounded-xl border border-[#dce2dc] bg-white">

            <div className="border-b border-[#e6e9e5] p-5">

              <h2 className="text-sm font-semibold">
                Current result
              </h2>

              <p className="mt-1 text-xs text-[#7c857e]">
                Python algorithm output
              </p>

            </div>

            <div className="p-5">

              {path.length === 0 ? (

                <div className="py-10 text-center text-xs text-[#89918b]">
                  Run a route calculation to see the result.
                </div>

              ) : (

                <>

                  {healed && (
                    <div className="mb-5 flex items-center gap-2 rounded-lg border border-[#cde5d5] bg-[#f2faf4] p-3 text-xs text-[#27784d]">

                      <CheckCircle2 size={15} />

                      Network successfully self-healed.

                    </div>
                  )}

                  <div className="space-y-2">

                    {path.map((node, index) => (

                      <div
                        key={`${node}-${index}`}
                        className="flex items-center gap-3"
                      >

                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#edf4ef] text-[10px] font-semibold text-[#176b45]">
                          {index + 1}
                        </div>

                        <span className="text-xs font-medium">
                          {node}
                        </span>

                      </div>

                    ))}

                  </div>

                  <div className="mt-5 border-t border-[#edf0ec] pt-4">

                    <p className="text-[10px] uppercase tracking-wide text-[#89918b]">
                      Total distance
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      {distance} km
                    </p>

                  </div>

                </>

              )}

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}

function Node({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-[#dce2dc] bg-[#f8faf7] px-4 py-3 text-xs font-medium">
      {label}
    </div>
  );
}

function Edge({ distance }: { distance: string }) {
  return (
    <div className="flex flex-col items-center">
      <ArrowRight
        size={15}
        className="text-[#789081]"
      />
      <span className="text-[9px] text-[#89918b]">
        {distance}
      </span>
    </div>
  );
}