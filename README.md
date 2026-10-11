# Parallel Sorting Algorithm Visualizer

A full-stack, academic-grade web application built for the **B.E. Computer Science and Engineering** subject **Parallel Computing**.

The application combines interactive step-by-step sorting animations with genuine operating system-level parallel processing using Python's `multiprocessing` module, paired with performance benchmarking, speedup curves, and academic correctness verification.

---

## 1. Project Overview

Sorting algorithms form a cornerstone of computer science education. While traditional visualizers rely on browser timeouts and single-threaded JavaScript, this project demonstrates **authentic parallel computing**:

1. **Frontend**: An interactive React + Vite dashboard demonstrating step-by-step algorithmic mechanics, worker chunk distributions, and Recharts performance plots.
2. **Backend**: A modular Python Flask service implementing true multicore concurrency via `multiprocessing.Pool`, hierarchical K-way tree reduction merges, and microsecond-precision benchmarks with `time.perf_counter()`.

---

## 2. Main Features

### A. Sorting Playground (6 Algorithms)
- **Algorithms Supported**:
  1. Bubble Sort ($O(n^2)$)
  2. Selection Sort ($O(n^2)$)
  3. Insertion Sort ($O(n^2)$)
  4. Merge Sort ($O(n \log n)$)
  5. Quick Sort ($O(n \log n)$)
  6. Parallel Merge Sort ($O(\frac{n}{P} \log \frac{n}{P} + n \log P)$)
- **Input Controls**:
  - Custom integer input (e.g. `8, 3, 6, 1, 9, 2, 5, 4` or negative integers)
  - Presets: Random, Reverse Sorted, Nearly Sorted, Duplicates, Negative Numbers
  - Array size slider (5 to 80 elements)
  - Speed slider (10ms to 600ms per step)
- **Animation Controls**:
  - Non-overlapping execution: **Start**, **Pause**, **Resume**, **Reset**
  - Distinct state coloring:
    - Default unsorted: Light Blue (`#93c5fd`)
    - Elements being compared: Amber/Orange (`#f59e0b`)
    - Elements swapping or writing: Crimson (`#ef4444`)
    - Quick Sort Pivot: Purple (`#8b5cf6`)
    - Confirmed sorted: Emerald Green (`#10b981`)
    - Worker process chunks: Blue, Green, Amber, Violet palette
  - Real-time step counter: Comparisons, Swaps/Writes, Elapsed Time, Current Phase.

### B. Parallel Execution (Multiprocessing Pipeline)
- Dispatches custom array chunks to **2, 4, or 8 Python worker processes**.
- Visualizes the 3-stage multiprocessing lifecycle:
  1. **Balanced Array Chunking**: $k = \lfloor N / P \rfloor$
  2. **Concurrent Worker Execution**: Worker lanes displaying Assigned Chunk, Worker Status, Sorted Chunk, and Worker CPU time.
  3. **Hierarchical Tree Reduction (K-Way Merge)**: Step-by-step reduction rounds combining worker sub-lists.

### C. Performance Analysis & Correctness Verification
- Evaluates **Sequential Merge Sort** vs **Parallel Merge Sort** on identical inputs.
- Microsecond timing with `time.perf_counter()`.
- Interactive Recharts plots:
  - **Execution Time Bar Chart** (Sequential vs Parallel ms across varying sizes: 1,000 to 100,000+ elements)
  - **Speedup Scaling Curve** ($S$ vs Array Size)
- **3-Point Correctness Verification**:
  1. *Ascending Sorted Order*: $A[i] \le A[i+1]$
  2. *Algorithmic Equivalence*: Sequential output $\equiv$ Parallel output
  3. *Element Conservation*: Length and multiset identity preserved (no loss or duplicate corruption)
- **Academic Context**: Clear explanation of Amdahl's Law and Inter-Process Communication (IPC) overhead for small datasets.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS (Light Theme: White, Emerald Green, Tech Blue, Orange accents), Recharts, Lucide Icons.
- **Backend**: Python 3.12, Flask 3.0, Flask-CORS, Python `multiprocessing`.
- **Timing**: Python `time.perf_counter()`.
- **Target Deployments**: Vercel (Frontend), Render (Backend).

---

## 4. Project Structure

```text
parallel-sorting-visualizer/
├── package.json                   # Root convenience scripts (dev, build, backend)
├── .gitignore                     # Git ignore rules for node_modules, pycache, etc.
├── README.md                      # Complete academic project documentation
├── frontend/
│   ├── index.html                 # App shell with SEO and metadata
│   ├── package.json               # Frontend dependencies (React, Vite, Recharts, Lucide)
│   ├── vite.config.js             # Vite configuration with /api proxy
│   ├── .env.example               # Environment template (VITE_API_URL)
│   ├── public/
│   │   └── favicon.svg            # Custom SVG icon
│   └── src/
│       ├── main.jsx               # React entry point
│       ├── App.jsx                # Tab navigation and health check
│       ├── index.css              # Light theme design system and animations
│       ├── algorithms/
│       │   └── sortingGenerators.js  # Step-by-step state generators for 6 algorithms
│       ├── components/
│       │   ├── Navbar.jsx         # Header, college badge, tabs, backend status pill
│       │   ├── SortingPlayground.jsx  # Interactive visualization and playback engine
│       │   ├── ParallelExecution.jsx  # Multiprocessing worker lanes and merge tree
│       │   ├── PerformanceAnalysis.jsx# Recharts benchmark graphs & verification
│       │   ├── ArrayVisualizer.jsx# Dynamic vertical bar renderer
│       │   └── StatsCard.jsx      # Metric cards with icons
│       └── services/
│           └── api.js             # Client for Flask endpoints
└── backend/
    ├── app.py                     # Flask REST API entry point
    ├── algorithms.py              # Pure sequential sorting implementations
    ├── parallel_sort.py           # Multiprocessing parallel merge sort
    ├── benchmark.py               # Benchmarking, speedup, efficiency, verification
    ├── test_backend.py            # Unit tests for edge cases and multiprocessing
    └── requirements.txt           # Python dependencies (flask, flask-cors, gunicorn)
```

---

## 5. Formal Parallel Computing Formulas

### Speedup ($S$)
$$\text{Speedup } (S) = \frac{T_{\text{sequential}}}{T_{\text{parallel}}}$$
*Measures the performance improvement achieved by parallel execution over single-threaded execution.*

### Parallel Efficiency ($E$)
$$\text{Efficiency } (E) = \left( \frac{S}{P} \right) \times 100\%$$
*Where $P$ is the number of worker processes. $100\%$ indicates ideal linear speedup.*

### Amdahl's Law
$$S_{\max} = \frac{1}{(1 - p) + \frac{p}{P}}$$
*Where $p$ represents the parallelizable portion (worker chunk sorting), and $(1 - p)$ represents the sequential portion (array partitioning and final reduction merge).*

> **Academic Note on Overhead**: For smaller datasets ($N < 5{,}000$), sequential sorting is often faster because process spawning and IPC serialization take longer than the sorting itself. As $N$ grows ($N \ge 20{,}000$), the parallel chunk sorting dominates and delivers positive speedup ($S > 1.0$).

---

## 6. Installation & Local Setup

### Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (v3.10+)

### Quick Start (From Root)

1. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

2. **Install Backend Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Start the Backend Server**:
   ```bash
   # From root:
   npm run backend
   # Or directly:
   python backend/app.py
   ```
   *The Flask API starts on `http://localhost:5000`.*

4. **Start the Frontend Development Server**:
   ```bash
   # From root in a separate terminal:
   npm run dev
   ```
   *The Vite development server starts on `http://localhost:5173`.*

5. Open your browser at **`http://localhost:5173`**.

---

## 7. Backend API Documentation

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & CPU core count | None |
| `POST` | `/api/sort/sequential` | Executes sequential sort | `{"array": [8, 3, 6, 1], "algorithm": "merge"}` |
| `POST` | `/api/sort/parallel` | True multiprocessing sort | `{"array": [8, 3, 6, 1], "num_workers": 4}` |
| `POST` | `/api/benchmark` | Live single benchmark trial | `{"size": 20000, "num_workers": 4, "trials": 1}` |
| `POST` | `/api/benchmark/suite` | Benchmark across multiple sizes | `{"sizes": [1000, 5000, 20000], "num_workers": 4}` |

---

## 8. Running Automated Unit Tests

A full test suite is included in `backend/test_backend.py`. It tests:
- All 5 sequential sorting algorithms against edge cases:
  - Random arrays
  - Already sorted arrays
  - Reverse sorted arrays (worst case)
  - Arrays with duplicate numbers
  - Arrays with negative integers
  - Single-element arrays
  - Empty arrays
- Balanced array chunking
- Multiprocessing Parallel Merge Sort
- Correctness verification criteria (Sorted check, Equivalence check, Conservation check)
- Benchmark calculation

Run tests with:
```bash
python backend/test_backend.py
```
Output:
```text
......
----------------------------------------------------------------------
Ran 6 tests in 2.4s

OK
```

---

## 9. Deployment Instructions

### Frontend Deployment on Vercel
1. Push this repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Configure the build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the Environment Variable:
   - `VITE_API_URL` = `https://your-backend-app.onrender.com`
5. Click **Deploy**.

### Backend Deployment on Render
1. In [Render Dashboard](https://render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure service settings:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app -b 0.0.0.0:$PORT --workers 1 --threads 4`
     *(Note: Using 1 worker process with multiple threads or standard python app allows multiprocessing processes inside Render containers).*
4. Click **Create Web Service**.
5. Copy your Render URL (e.g., `https://parallel-sort-api.onrender.com`) and paste it into the `VITE_API_URL` setting in Vercel.

---

## 10. Report-Friendly Code Structure

For students preparing their college report or presentation slides, the core executable logic is intentionally modular and concise:
- [algorithms.py](file:///c:/Users/prashanth/PARALLEL%20SORTING%20ALGORITHM%20VISUALIZER/backend/algorithms.py): Clean, classical sorting algorithms (~65 lines).
- [parallel_sort.py](file:///c:/Users/prashanth/PARALLEL%20SORTING%20ALGORITHM%20VISUALIZER/backend/parallel_sort.py): Multiprocessing pool chunk distribution and reduction merge (~120 lines).
- [benchmark.py](file:///c:/Users/prashanth/PARALLEL%20SORTING%20ALGORITHM%20VISUALIZER/backend/benchmark.py): Microsecond benchmarking, Speedup/Efficiency formulas, and correctness checks (~110 lines).
- [app.py](file:///c:/Users/prashanth/PARALLEL%20SORTING%20ALGORITHM%20VISUALIZER/backend/app.py): Flask REST API routes with input sanitization (~140 lines).
