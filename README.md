# FoodRescue — A Self-Healing Food Redistribution Network

## 1. Project Overview
FoodRescue is an academic, full-stack logistics and algorithmic optimization system designed for the **Advanced Algorithms with Python** course. It bridges food donors (restaurants, campus cafeterias, banquet halls) with redistribution centers and NGOs (community kitchens, shelters) to minimize edible food waste through algorithmic priority ranking, capacity flow optimization, and resilient self-healing route dispatch.

## 2. Problem Statement
Urban food waste occurs primarily due to perishable shelf-life expiration and fragmented logistics:
1. Surplus donations lose edible viability rapidly if not prioritized deterministically.
2. Urban delivery routes experience node/road failures, requiring real-time self-healing rerouting.
3. Donors operate on disjoint collection schedules that must be synchronized without communication collisions.
4. Redistribution centers have hard volumetric capacity caps that cannot be violated.

FoodRescue solves these challenges by combining deterministic Python algorithms with Supabase database persistence, Next.js frontend visualization, and Google Gemini AI operational decision support.

## 3. Architecture Principle
**Algorithms decide; Gemini explains and recommends.**
- **Frontend**: Next.js 16 (App Router, TypeScript, React 19, Tailwind CSS)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS)
- **Algorithm Engine**: Pure Python 3 (manual implementations of 15 classical and advanced algorithms)
- **Backend API**: Python HTTP Service (`http.server.BaseHTTPRequestHandler` on port 8000)
- **AI Layer**: Google Gemini API for structured explanations without overriding deterministic bounds

```
Next.js Frontend (Port 3000)
        │
        ├──► Supabase PostgreSQL & Auth (Persistent Records & RLS)
        ├──► Google Gemini API (Server-Side Decision Explanations)
        └──► Python Algorithm Service (Port 8000)
                    │
                    ├── Sorting (Bubble, Selection, Insertion, Merge, Quick, Heap)
                    ├── Searching (Linear, Binary)
                    ├── Graph (Dijkstra, Bellman-Ford, DAG, Johnson, Ford-Fulkerson, Bipartite Matching)
                    └── Number Theory (Chinese Remainder Theorem)
```

## 4. All 15 Implemented Algorithms & FoodRescue Mapping

All 15 algorithms are implemented manually in pure Python without reliance on `sorted()`, NetworkX, or third-party graph packages:

| # | Algorithm | Category | Complexity (Avg) | FoodRescue Domain Mapping |
|---|-----------|----------|------------------|---------------------------|
| 1 | **Bubble Sort** | Sorting | $O(n^2)$ | Small emergency batches requiring immediate sequential verification |
| 2 | **Selection Sort** | Sorting | $O(n^2)$ | Priority item selection when minimal memory write operations are desired |
| 3 | **Insertion Sort** | Sorting | $O(n^2)$ | Real-time continuous insertion into live incoming donation queue |
| 4 | **Merge Sort** | Sorting | $O(n \log n)$ | Stable, predictable sorting of large cross-city donation datasets |
| 5 | **Quick Sort** | Sorting | $O(n \log n)$ | High-throughput general priority ranking across logistics nodes |
| 6 | **Heap Sort** | Sorting | $O(n \log n)$ | Guaranteed in-place priority processing of redistribution orders |
| 7 | **Linear Search** | Searching | $O(n)$ | Unsorted candidate queries, raw donor IDs, and emergency records |
| 8 | **Binary Search** | Searching | $O(\log n)$ | Logarithmic search over pre-sorted center and donation catalogs |
| 9 | **Dijkstra** | Graph | $O((V+E)\log V)$ | Single-source shortest path for standard delivery fleet vehicles |
| 10 | **Bellman-Ford** | Graph | $O(V \cdot E)$ | Shortest path supporting green-corridor rebates & negative cycle checks |
| 11 | **DAG Shortest Path** | Graph | $O(V + E)$ | Directional pipeline from inspection to NGO delivery via topological sort |
| 12 | **Johnson's Algorithm** | Graph | $O(V^2 \log V + VE)$ | All-pairs shortest path matrix between all donors, hubs, and NGOs |
| 13 | **Ford-Fulkerson** | Graph | $O(V \cdot E^2)$ | Max food throughput calculation from donors to NGOs with capacity caps |
| 14 | **Maximum Bipartite Matching** | Graph | $O(V \cdot E)$ | Augmenting path 1-to-1 matching of perishable food batches to centers |
| 15 | **Chinese Remainder Theorem** | Number Theory | $O(k \log M)$ | Synchronization of recurring donor collection schedules |

## 5. FoodRescue Workflow
1. **Donation Registration**: Donors input food type, quantity, prepared time, expiry time, demand score, and donor priority.
2. **Priority Calculation**: Python computes:
   $$\text{PriorityScore} = 0.45 \times \text{Expiry} + 0.25 \times \text{Quantity} + 0.20 \times \text{Demand} + 0.10 \times \text{DonorPriority}$$
3. **Database Insertion**: Complete record is persisted to Supabase PostgreSQL with assigned urgency tag (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
4. **Bipartite Matching & Capacity Flow**: Ford-Fulkerson and Maximum Bipartite Matching allocate food to active redistribution centers.
5. **Shortest Route & Self-Healing**: Dijkstra calculates shortest path. If a redistribution node fails, the self-healing service disables the node, recalculates an alternative route, and logs the incident to `route_incidents`.
6. **Collection Synchronization**: Chinese Remainder Theorem synchronizes recurring pickup windows across multi-fleet vehicles.

## 6. Environment Variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 7. Local Setup & Execution

### Terminal 1: Python Algorithm Engine API
```bash
cd G:\A
venv\Scripts\python.exe api\server.py
```
API runs at: `http://localhost:8000`

### Terminal 2: Next.js Frontend
```bash
cd G:\A\frontend
npm run dev
```
Frontend runs at: `http://localhost:3000`

### Run Standalone Python Algorithm Demonstration
```bash
cd G:\A
venv\Scripts\python.exe engine.py
```

### Run Unit Tests
```bash
cd G:\A
venv\Scripts\python.exe -m pytest tests/ -v
```

## 8. Python API Endpoints

### System Endpoints
- `GET /api/health` — Returns system status, version, and operational algorithm count.
- `GET /api` — Returns API info and list of 15 operational algorithms.

### Routing & Self-Healing Endpoints
- `POST /api/routing/shortest` — Dijkstra shortest path calculation.
- `POST /api/routing/self-heal` — Route failure detection and self-healing alternative calculation.

### Algorithm Endpoints
- `POST /api/algorithms/bellman-ford` — Single-source shortest path with negative edge support.
- `POST /api/algorithms/johnson` — All-pairs shortest paths via reweighting.
- `POST /api/algorithms/ford-fulkerson` — Maximum network capacity flow.
- `POST /api/algorithms/bipartite-matching` — Maximum bipartite donation-to-center matching.
- `POST /api/algorithms/dag` — DAG shortest path via topological ordering.
- `POST /api/algorithms/crt` — Chinese Remainder Theorem schedule synchronization.
- `POST /api/algorithms/sort` — Interactive sorting execution (bubble, selection, insertion, merge, quick, heap).
- `POST /api/algorithms/search` — Linear and binary search demonstrations.
- `POST /api/algorithms/benchmark` — Dynamic empirical benchmarking across variable dataset sizes.

### Donation Endpoints
- `POST /api/donations/calculate-priority` — Authoritative deterministic priority score & urgency calculation.
