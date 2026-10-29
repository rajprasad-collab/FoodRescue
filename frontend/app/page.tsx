"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Command,
  Database,
  GitBranch,
  HeartHandshake,
  LayoutDashboard,
  Map,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  checkApiHealth,
  findShortestRoute,
  selfHealRoute,
  calculateCRT,
} from "../lib/api";

const FOODRESCUE_GRAPH = {
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

const donations = [
  {
    id: "FD-001",
    donor: "Green Leaf Restaurant",
    food: "Cooked meals",
    quantity: 150,
    expires: "42 min",
    priority: 89.75,
    status: "Critical",
  },
  {
    id: "FD-003",
    donor: "Fresh Bake House",
    food: "Bread",
    quantity: 40,
    expires: "1h 36m",
    priority: 62.75,
    status: "High",
  },
  {
    id: "FD-002",
    donor: "Annapurna Kitchen",
    food: "Rice",
    quantity: 80,
    expires: "2h 14m",
    priority: 54.75,
    status: "Medium",
  },
  {
    id: "FD-004",
    donor: "Campus Cafeteria",
    food: "Vegetable curry",
    quantity: 65,
    expires: "3h 02m",
    priority: 47.2,
    status: "Medium",
  },
];

const activity = [
  {
    time: "08:42",
    text: "150 meals registered by Green Leaf Restaurant",
    type: "donation",
  },
  {
    time: "08:36",
    text: "Center A accepted donation FD-003",
    type: "center",
  },
  {
    time: "08:21",
    text: "Route recalculated after temporary road closure",
    type: "route",
  },
  {
    time: "08:05",
    text: "Morning collection cycle completed",
    type: "success",
  },
];

const algorithms = [
  "Bubble Sort",
  "Selection Sort",
  "Insertion Sort",
  "Merge Sort",
  "Quick Sort",
  "Heap Sort",
  "Linear Search",
  "Binary Search",
  "Dijkstra",
  "DAG Shortest Path",
  "Chinese Remainder Theorem",
];

export default function Home() {
  const [apiOnline, setApiOnline] = useState(false);

  const [route, setRoute] = useState<string[]>([]);
  const [distance, setDistance] =
    useState<number | null>(null);

  const [healed, setHealed] = useState(false);
  const [healedRoute, setHealedRoute] =
    useState<string[]>([]);
  const [healedDistance, setHealedDistance] =
    useState<number | null>(null);

  const [crtResult, setCrtResult] =
    useState<number | null>(null);

  const [loadingRoute, setLoadingRoute] =
    useState(false);

  const [loadingHeal, setLoadingHeal] =
    useState(false);

  const [loadingCRT, setLoadingCRT] =
    useState(false);

  const [notice, setNotice] =
    useState<string | null>(null);

  useEffect(() => {
    checkApiHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  async function handleRoute() {
    setLoadingRoute(true);
    setNotice(null);

    try {
      const result = await findShortestRoute(
        FOODRESCUE_GRAPH,
        "Restaurant",
        "NGO A"
      );

      setRoute(result.route.path);
      setDistance(result.route.distance);

      setNotice(
        "Shortest available route calculated successfully."
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to calculate route."
      );
    } finally {
      setLoadingRoute(false);
    }
  }

  async function handleSelfHealing() {
    setLoadingHeal(true);
    setNotice(null);

    try {
      const result = await selfHealRoute(
        FOODRESCUE_GRAPH,
        "Restaurant",
        "NGO A",
        "Center A"
      );

      setHealed(result.status === "SELF_HEALED");

      setRoute(result.original_route.path);
      setDistance(result.original_route.distance);

      setHealedRoute(result.new_route.path);
      setHealedDistance(result.new_route.distance);

      setNotice(
        "Center A failure simulated. Network successfully recovered."
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Self-healing operation failed."
      );
    } finally {
      setLoadingHeal(false);
    }
  }

  async function handleCRT() {
    setLoadingCRT(true);

    try {
      const result = await calculateCRT(
        [2, 3, 2],
        [3, 5, 7]
      );

      setCrtResult(result.result);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Schedule synchronization failed."
      );
    } finally {
      setLoadingCRT(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f3] text-[#17201b]">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-[238px] border-r border-[#dfe3dd] bg-[#fbfcfa] lg:block">

        <div className="flex h-[72px] items-center border-b border-[#e5e8e3] px-6">

          <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#176b45] text-white">
            <HeartHandshake size={19} />
          </div>

          <div>
            <div className="text-[15px] font-semibold tracking-tight">
              FoodRescue
            </div>

            <div className="text-[10px] uppercase tracking-[0.12em] text-[#7a847d]">
              Operations
            </div>
          </div>

        </div>

        <nav className="px-3 py-5">

          <NavItem
            icon={<LayoutDashboard size={17} />}
            label="Overview"
            active
          />

          <NavItem
            icon={<Package size={17} />}
            label="Donations"
          />

          <NavItem
            icon={<Map size={17} />}
            label="Routes"
          />

          <NavItem
            icon={<Users size={17} />}
            label="Partners"
          />

          <NavItem
            icon={<BarChart3 size={17} />}
            label="Performance"
          />

          <div className="my-5 border-t border-[#e5e8e3]" />

          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#89918b]">
            System
          </p>

          <NavItem
            icon={<GitBranch size={17} />}
            label="Algorithm Engine"
          />

          <NavItem
            icon={<Settings size={17} />}
            label="Settings"
          />

        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-[#dfe4de] bg-white p-4">

          <div className="flex items-center gap-2">

            <div className="h-2 w-2 rounded-full bg-[#36a269]" />

            <span className="text-xs font-medium">
              System operational
            </span>

          </div>

          <p className="mt-2 text-[11px] leading-4 text-[#7c857e]">
            Python engine connected
            <br />
            Last checked just now
          </p>

        </div>

      </aside>

      {/* MAIN */}

      <div className="lg:pl-[238px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#dfe3dd] bg-[#fbfcfa]/95 px-5 backdrop-blur lg:px-8">

          <div className="flex items-center gap-3">

            <button className="lg:hidden">
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-[18px] font-semibold">
                Operations overview
              </h1>

              <p className="hidden text-xs text-[#7a847d] sm:block">
                Thursday, 29 October 2026
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-lg border border-[#dfe4de] bg-white px-3 py-2 md:flex">

              <Search
                size={15}
                className="text-[#8a938c]"
              />

              <span className="text-xs text-[#8a938c]">
                Search
              </span>

              <kbd className="ml-5 rounded border border-[#e1e4e0] px-1.5 py-0.5 text-[10px] text-[#89918b]">
                ⌘ K
              </kbd>

            </div>

            <button className="relative rounded-lg border border-[#dfe4de] bg-white p-2.5">

              <Bell size={17} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d85a48]" />

            </button>

            <div className="hidden items-center gap-2 border-l border-[#e0e4df] pl-3 sm:flex">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9e8dc] text-xs font-semibold text-[#275c3d]">
                RP
              </div>

              <ChevronDown
                size={14}
                className="text-[#8a938c]"
              />

            </div>

          </div>

        </header>

        <main className="mx-auto max-w-[1450px] px-5 py-7 lg:px-8">

          {/* INTRO */}

          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2 text-xs text-[#718078]">

                <span>Workspace</span>

                <span>/</span>

                <span className="text-[#28352d]">
                  Overview
                </span>

              </div>

              <h2 className="text-[28px] font-semibold tracking-[-0.025em]">
                Good morning, Raj.
              </h2>

              <p className="mt-1 text-sm text-[#717b74]">
                Here is what is happening across the
                redistribution network.
              </p>

            </div>

            <div className="flex items-center gap-2">

              <div className="flex items-center gap-2 rounded-lg border border-[#dce3dc] bg-white px-3 py-2 text-xs">

                <span
                  className={`h-2 w-2 rounded-full ${
                    apiOnline
                      ? "bg-[#36a269]"
                      : "bg-[#d85a48]"
                  }`}
                />

                {apiOnline
                  ? "Engine connected"
                  : "Engine offline"}

              </div>

            </div>

          </div>

          {/* METRICS */}

          <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">

            <Metric
              label="Food awaiting pickup"
              value="270"
              unit="meals"
              change="+18"
              positive
            />

            <Metric
              label="Redistributed this month"
              value="1,240"
              unit="kg"
              change="+12.4%"
              positive
            />

            <Metric
              label="Active redistribution centers"
              value="12"
              unit=""
              change="No change"
            />

            <Metric
              label="Routes recovered"
              value="27"
              unit=""
              change="100% success"
              positive
            />

          </div>

          {/* PRIMARY GRID */}

          <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">

            {/* NETWORK */}

            <section className="overflow-hidden rounded-xl border border-[#dce2dc] bg-white">

              <div className="flex items-center justify-between border-b border-[#e6e9e5] px-5 py-4">

                <div>

                  <h3 className="text-sm font-semibold">
                    Redistribution network
                  </h3>

                  <p className="mt-0.5 text-xs text-[#7c857e]">
                    Current food movement across the network
                  </p>

                </div>

                <button className="flex items-center gap-1.5 rounded-md border border-[#dce2dc] px-2.5 py-1.5 text-xs text-[#556159] hover:bg-[#f7f8f6]">

                  Today

                  <ChevronDown size={13} />

                </button>

              </div>

              {/* MAP-LIKE AREA */}

              <div className="relative h-[330px] overflow-hidden bg-[#eef1ec]">

                <div className="absolute inset-0 opacity-40">

                  <div className="absolute left-[8%] top-[18%] h-px w-[72%] rotate-[12deg] bg-[#b8c4ba]" />

                  <div className="absolute left-[12%] top-[55%] h-px w-[70%] rotate-[-8deg] bg-[#b8c4ba]" />

                  <div className="absolute left-[35%] top-[5%] h-[90%] w-px rotate-[15deg] bg-[#c1c9c1]" />

                  <div className="absolute left-[68%] top-[2%] h-[95%] w-px rotate-[-22deg] bg-[#c1c9c1]" />

                  <div className="absolute left-[4%] top-[35%] h-20 w-40 rounded-full border border-[#c3ccc3]" />

                  <div className="absolute right-[4%] top-[20%] h-28 w-44 rounded-full border border-[#c3ccc3]" />

                </div>

                {/* ROUTE LINE */}

                <div className="absolute left-[23%] top-[52%] h-[2px] w-[53%] rotate-[-13deg] bg-[#176b45]" />

                <div className="absolute left-[45%] top-[48%] h-[2px] w-[29%] rotate-[17deg] bg-[#176b45]" />

                {/* NODES */}

                <NetworkNode
                  left="18%"
                  top="50%"
                  label="Green Leaf"
                  type="donor"
                />

                <NetworkNode
                  left="47%"
                  top="36%"
                  label="Center A"
                  type="center"
                />

                <NetworkNode
                  left="77%"
                  top="50%"
                  label="NGO A"
                  type="ngo"
                />

                <NetworkNode
                  left="52%"
                  top="74%"
                  label="Center B"
                  type="center"
                />

                <div className="absolute bottom-4 left-4 rounded-lg border border-[#d7ddd7] bg-white/90 px-3 py-2 backdrop-blur">

                  <div className="flex items-center gap-4 text-[10px] text-[#69736c]">

                    <Legend
                      color="bg-[#2c865a]"
                      label="Active"
                    />

                    <Legend
                      color="bg-[#d85a48]"
                      label="Issue"
                    />

                    <Legend
                      color="bg-[#789081]"
                      label="Partner"
                    />

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-3 divide-x divide-[#e7eae6] border-t border-[#e6e9e5]">

                <NetworkStat
                  label="Active routes"
                  value="18"
                />

                <NetworkStat
                  label="Collections today"
                  value="34"
                />

                <NetworkStat
                  label="Avg. delivery"
                  value="31 min"
                />

              </div>

            </section>

            {/* PRIORITY QUEUE */}

            <section className="rounded-xl border border-[#dce2dc] bg-white">

              <div className="flex items-center justify-between border-b border-[#e6e9e5] px-5 py-4">

                <div>

                  <h3 className="text-sm font-semibold">
                    Priority queue
                  </h3>

                  <p className="mt-0.5 text-xs text-[#7c857e]">
                    Food requiring attention first
                  </p>

                </div>

                <button className="text-xs font-medium text-[#176b45]">
                  View all
                </button>

              </div>

              <div>

                {donations.map((donation, index) => (

                  <div
                    key={donation.id}
                    className={`px-5 py-4 ${
                      index !== donations.length - 1
                        ? "border-b border-[#edf0ec]"
                        : ""
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <span className="text-xs font-semibold">
                            {donation.id}
                          </span>

                          <PriorityBadge
                            status={donation.status}
                          />

                        </div>

                        <p className="mt-1 truncate text-sm font-medium">
                          {donation.donor}
                        </p>

                        <p className="mt-0.5 text-xs text-[#7b857e]">
                          {donation.food} ·{" "}
                          {donation.quantity} meals
                        </p>

                      </div>

                      <div className="shrink-0 text-right">

                        <p className="text-sm font-semibold">
                          {donation.priority}
                        </p>

                        <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#8a938c]">
                          <Clock3 size={11} />
                          {donation.expires}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </section>

          </div>

          {/* OPERATIONS */}

          <div className="mt-5 grid gap-5 lg:grid-cols-3">

            {/* ROUTING */}

            <section className="rounded-xl border border-[#dce2dc] bg-white">

              <SectionHeader
                title="Route planner"
                subtitle="Dijkstra shortest path"
              />

              <div className="p-5">

                <div className="mb-5 rounded-lg bg-[#f5f7f4] p-4">

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-[#7c857e]">
                      Restaurant
                    </span>

                    <span className="text-[10px] text-[#9aa19b]">
                      SOURCE
                    </span>

                  </div>

                  <div className="my-3 ml-2 h-6 border-l border-dashed border-[#aeb9b0]" />

                  <div className="flex items-center justify-between">

                    <span className="text-xs text-[#7c857e]">
                      NGO A
                    </span>

                    <span className="text-[10px] text-[#9aa19b]">
                      DESTINATION
                    </span>

                  </div>

                </div>

                <button
                  onClick={handleRoute}
                  disabled={!apiOnline || loadingRoute}
                  className="w-full rounded-lg bg-[#176b45] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#125c3b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingRoute
                    ? "Calculating..."
                    : "Calculate shortest route"}
                </button>

                {route.length > 0 && (

                  <div className="mt-4 border-t border-[#edf0ec] pt-4">

                    <div className="text-[11px] uppercase tracking-wide text-[#8a938c]">
                      Result
                    </div>

                    <p className="mt-2 text-sm font-medium">
                      {route.join(" → ")}
                    </p>

                    <p className="mt-1 text-xs text-[#7a847d]">
                      Total distance:{" "}
                      <span className="font-semibold text-[#27332b]">
                        {distance} km
                      </span>
                    </p>

                  </div>

                )}

              </div>

            </section>

            {/* SELF HEALING */}

            <section className="rounded-xl border border-[#dce2dc] bg-white">

              <SectionHeader
                title="Network recovery"
                subtitle="Failure detection and rerouting"
              />

              <div className="p-5">

                <div className="mb-4 flex items-center gap-3 rounded-lg border border-[#f0d8d4] bg-[#fff8f7] p-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6dfdc]">

                    <AlertTriangle
                      size={15}
                      className="text-[#c45142]"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-semibold">
                      Simulated failure
                    </p>

                    <p className="text-[11px] text-[#8b7773]">
                      Center A becomes unavailable
                    </p>

                  </div>

                </div>

                <button
                  onClick={handleSelfHealing}
                  disabled={
                    !apiOnline || loadingHeal
                  }
                  className="w-full rounded-lg border border-[#d9dfda] bg-white px-4 py-2.5 text-xs font-semibold text-[#344139] hover:bg-[#f7f8f6] disabled:opacity-50"
                >
                  {loadingHeal
                    ? "Finding alternative..."
                    : "Run self-healing test"}
                </button>

                {healed && (

                  <div className="mt-4 rounded-lg border border-[#cde5d5] bg-[#f2faf4] p-4">

                    <div className="flex items-center gap-2 text-[#27784d]">

                      <Check size={15} />

                      <span className="text-xs font-semibold">
                        Route recovered
                      </span>

                    </div>

                    <p className="mt-2 text-xs text-[#53675a]">
                      {healedRoute.join(" → ")}
                    </p>

                    <p className="mt-1 text-[11px] text-[#718078]">
                      New distance:{" "}
                      <strong>
                        {healedDistance} km
                      </strong>
                    </p>

                  </div>

                )}

              </div>

            </section>

            {/* SCHEDULE */}

            <section className="rounded-xl border border-[#dce2dc] bg-white">

              <SectionHeader
                title="Collection schedule"
                subtitle="CRT synchronization"
              />

              <div className="p-5">

                <div className="mb-4 grid grid-cols-3 gap-2">

                  <ScheduleItem
                    label="Kitchen A"
                    cycle="3 hrs"
                  />

                  <ScheduleItem
                    label="Center A"
                    cycle="5 hrs"
                  />

                  <ScheduleItem
                    label="NGO A"
                    cycle="7 hrs"
                  />

                </div>

                <button
                  onClick={handleCRT}
                  disabled={!apiOnline || loadingCRT}
                  className="w-full rounded-lg border border-[#d9dfda] bg-white px-4 py-2.5 text-xs font-semibold text-[#344139] hover:bg-[#f7f8f6] disabled:opacity-50"
                >
                  {loadingCRT
                    ? "Synchronizing..."
                    : "Find next synchronization"}
                </button>

                {crtResult !== null && (

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-[#f4f7f3] px-4 py-3">

                    <span className="text-xs text-[#6d7870]">
                      Next synchronized time
                    </span>

                    <span className="text-sm font-bold text-[#176b45]">
                      T + {crtResult}
                    </span>

                  </div>

                )}

              </div>

            </section>

          </div>

          {/* ACTIVITY */}

          <section className="mt-5 rounded-xl border border-[#dce2dc] bg-white">

            <SectionHeader
              title="Recent activity"
              subtitle="Latest events from the network"
            />

            <div className="grid divide-y divide-[#edf0ec] md:grid-cols-2 md:divide-x md:divide-y-0">

              <div>

                {activity.slice(0, 2).map((item) => (

                  <ActivityItem
                    key={item.time}
                    time={item.time}
                    text={item.text}
                    type={item.type}
                  />

                ))}

              </div>

              <div>

                {activity.slice(2).map((item) => (

                  <ActivityItem
                    key={item.time}
                    time={item.time}
                    text={item.text}
                    type={item.type}
                  />

                ))}

              </div>

            </div>

          </section>

          {/* ENGINE */}

          <section className="mt-5 rounded-xl border border-[#dce2dc] bg-white">

            <SectionHeader
              title="Algorithm engine"
              subtitle="Algorithms currently implemented in Python"
            />

            <div className="grid grid-cols-2 gap-px bg-[#e5e9e4] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">

              {algorithms.map((algorithm) => (

                <div
                  key={algorithm}
                  className="bg-white px-4 py-4"
                >

                  <div className="mb-2 flex items-center gap-2">

                    <div className="h-1.5 w-1.5 rounded-full bg-[#3d9a67]" />

                    <span className="text-xs font-medium">
                      Implemented
                    </span>

                  </div>

                  <p className="text-xs font-semibold leading-4">
                    {algorithm}
                  </p>

                </div>

              ))}

            </div>

          </section>

          {notice && (

            <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-[#d6ded7] bg-white p-4 shadow-lg">

              <Check
                size={17}
                className="mt-0.5 shrink-0 text-[#25804f]"
              />

              <p className="text-xs leading-5 text-[#46534b]">
                {notice}
              </p>

              <button
                onClick={() => setNotice(null)}
                className="text-[#89918b]"
              >
                <X size={14} />
              </button>

            </div>

          )}

          <footer className="py-8 text-center text-[11px] text-[#8a938c]">
            FoodRescue · Redistribution network management
          </footer>

        </main>

      </div>

    </div>
  );
}

/* -------------------------------------------------------
   COMPONENTS
------------------------------------------------------- */

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-[#e9f3ec] font-medium text-[#176b45]"
          : "text-[#5e6961] hover:bg-[#f1f3f0]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Metric({
  label,
  value,
  unit,
  change,
  positive = false,
}: {
  label: string;
  value: string;
  unit: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#dce2dc] bg-white px-5 py-4">

      <p className="text-xs text-[#7b857e]">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-1.5">

        <span className="text-[25px] font-semibold tracking-tight">
          {value}
        </span>

        {unit && (
          <span className="text-xs text-[#7d867f]">
            {unit}
          </span>
        )}

      </div>

      <p
        className={`mt-2 text-[11px] ${
          positive
            ? "text-[#278252]"
            : "text-[#89918b]"
        }`}
      >
        {change}
      </p>

    </div>
  );
}

function NetworkNode({
  left,
  top,
  label,
  type,
}: {
  left: string;
  top: string;
  label: string;
  type: "donor" | "center" | "ngo";
}) {
  const bg =
    type === "donor"
      ? "bg-[#2b865b]"
      : type === "center"
        ? "bg-[#668171]"
        : "bg-[#3f6e56]";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top }}
    >

      <div
        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-sm ${bg}`}
      >
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>

      <div className="mt-1 whitespace-nowrap rounded bg-white/90 px-2 py-1 text-[10px] font-medium text-[#465149] shadow-sm">
        {label}
      </div>

    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-2 w-2 rounded-full ${color}`}
      />
      {label}
    </div>
  );
}

function NetworkStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-4 py-3">

      <p className="text-[10px] uppercase tracking-wide text-[#8a938c]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>

    </div>
  );
}

function PriorityBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    Critical:
      "bg-[#fff0ed] text-[#bd4e40]",
    High:
      "bg-[#fff6e8] text-[#ad6a16]",
    Medium:
      "bg-[#f4f5e9] text-[#78802d]",
  };

  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
        styles[status] || styles.Medium
      }`}
    >
      {status}
    </span>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="border-b border-[#e6e9e5] px-5 py-4">

      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-0.5 text-xs text-[#7c857e]">
        {subtitle}
      </p>

    </div>
  );
}

function ScheduleItem({
  label,
  cycle,
}: {
  label: string;
  cycle: string;
}) {
  return (
    <div className="rounded-lg bg-[#f5f7f4] p-3">

      <p className="truncate text-[10px] font-medium text-[#56625a]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold">
        {cycle}
      </p>

    </div>
  );
}

function ActivityItem({
  time,
  text,
  type,
}: {
  time: string;
  text: string;
  type: string;
}) {
  return (
    <div className="flex gap-4 px-5 py-4">

      <span className="w-10 shrink-0 text-[11px] font-medium text-[#929a94]">
        {time}
      </span>

      <div className="flex gap-2.5">

        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#edf4ef]">

          {type === "route" ? (
            <GitBranch
              size={11}
              className="text-[#3d7f59]"
            />
          ) : type === "donation" ? (
            <Package
              size={11}
              className="text-[#3d7f59]"
            />
          ) : type === "center" ? (
            <Map
              size={11}
              className="text-[#3d7f59]"
            />
          ) : (
            <Check
              size={11}
              className="text-[#3d7f59]"
            />
          )}

        </div>

        <p className="text-xs leading-5 text-[#4d5951]">
          {text}
        </p>

      </div>

    </div>
  );
}