"""
app.py
======
Flask backend for the Parallel Sorting Algorithm Visualizer.
Exposes clean REST APIs for sequential sorting, multiprocessing parallel sorting,
and live performance benchmarking.
"""

import os
import random
import multiprocessing
from flask import Flask, request, jsonify
from flask_cors import CORS

from algorithms import (
    bubble_sort,
    selection_sort,
    insertion_sort,
    merge_sort,
    quick_sort
)
from parallel_sort import parallel_merge_sort
from benchmark import run_benchmark, generate_benchmark_suite, verify_correctness

app = Flask(__name__)
# Enable CORS for local Vite dev server and production deployments
CORS(app, resources={r"/api/*": {"origins": "*"}})

ALGORITHMS = {
    "bubble": bubble_sort,
    "selection": selection_sort,
    "insertion": insertion_sort,
    "merge": merge_sort,
    "quick": quick_sort
}


def sanitize_array_input(data):
    """Validates and parses integer array from request body."""
    raw = data.get("array")
    if raw is None:
        raise ValueError("Missing 'array' field in request payload.")
    if not isinstance(raw, list):
        raise ValueError("'array' must be a JSON array of integers.")
    if len(raw) > 500000:
        raise ValueError("Array exceeds maximum supported size of 500,000 elements.")
    try:
        return [int(x) for x in raw]
    except (ValueError, TypeError):
        raise ValueError("All array elements must be valid integers.")


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health status and system capabilities."""
    return jsonify({
        "status": "healthy",
        "cpu_count": os.cpu_count() or 4,
        "supported_algorithms": list(ALGORITHMS.keys()) + ["parallel_merge"],
        "message": "Parallel Sorting Visualizer API is active."
    })


@app.route("/api/sort/sequential", methods=["POST"])
def sort_sequential():
    """Executes a sequential sorting algorithm."""
    try:
        data = request.get_json(force=True)
        arr = sanitize_array_input(data)
        algo_name = data.get("algorithm", "merge").lower()

        if algo_name not in ALGORITHMS:
            return jsonify({
                "error": f"Invalid algorithm '{algo_name}'. Choose from: {list(ALGORITHMS.keys())}"
            }), 400

        # Run sort
        sort_fn = ALGORITHMS[algo_name]
        sorted_arr = sort_fn(arr)

        # Verification
        verification = {
            "is_sorted": all(sorted_arr[i] <= sorted_arr[i + 1] for i in range(len(sorted_arr) - 1)),
            "length_preserved": len(arr) == len(sorted_arr)
        }

        return jsonify({
            "success": True,
            "algorithm": algo_name,
            "original_size": len(arr),
            "sorted_array": sorted_arr if len(sorted_arr) <= 500 else sorted_arr[:500],
            "verification": verification
        })
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route("/api/sort/parallel", methods=["POST"])
def sort_parallel():
    """Executes Parallel Merge Sort using multiprocessing."""
    try:
        data = request.get_json(force=True)
        arr = sanitize_array_input(data)
        
        num_workers = data.get("num_workers", 4)
        try:
            num_workers = int(num_workers)
        except (ValueError, TypeError):
            num_workers = 4
        num_workers = max(1, min(num_workers, 16))

        result = parallel_merge_sort(arr, num_workers=num_workers, include_chunk_data=True)

        # Verify correctness
        sorted_arr = result["sorted_array"]
        is_sorted = all(sorted_arr[i] <= sorted_arr[i + 1] for i in range(len(sorted_arr) - 1))
        is_conserved = (len(sorted_arr) == len(arr)) and (sorted(arr) == sorted_arr)

        return jsonify({
            "success": True,
            "original_size": len(arr),
            "num_workers": result["num_workers"],
            "sorted_array": sorted_arr if len(sorted_arr) <= 500 else sorted_arr[:500],
            "timings": result.get("timings", {}),
            "worker_results": result["worker_results"],
            "merge_stages": result["merge_stages"],
            "verification": {
                "all_passed": is_sorted and is_conserved,
                "is_sorted": is_sorted,
                "is_conserved": is_conserved
            }
        })
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route("/api/benchmark", methods=["POST"])
def benchmark_endpoint():
    """
    Executes live comparison between Sequential and Parallel Merge Sort.
    Accepts either an explicit array or generates one from a requested size.
    """
    try:
        data = request.get_json(force=True) or {}
        num_workers = int(data.get("num_workers", 4))
        trials = int(data.get("trials", 1))

        if "array" in data:
            arr = sanitize_array_input(data)
        else:
            size = int(data.get("size", 10000))
            size = max(10, min(size, 200000))
            arr = [random.randint(-100000, 100000) for _ in range(size)]

        benchmark_result = run_benchmark(arr, num_workers=num_workers, trials=trials)
        return jsonify({
            "success": True,
            "data": benchmark_result
        })
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route("/api/benchmark/suite", methods=["POST"])
def benchmark_suite_endpoint():
    """
    Executes benchmark across an array of sizes to provide data for charts.
    """
    try:
        data = request.get_json(force=True) or {}
        num_workers = int(data.get("num_workers", 4))
        custom_sizes = data.get("sizes", [1000, 5000, 15000, 30000])
        
        # Clamp sizes
        sanitized_sizes = []
        for s in custom_sizes:
            try:
                val = max(100, min(int(s), 100000))
                sanitized_sizes.append(val)
            except (ValueError, TypeError):
                continue

        if not sanitized_sizes:
            sanitized_sizes = [1000, 5000, 15000, 30000]

        suite = generate_benchmark_suite(sizes=sanitized_sizes, num_workers=num_workers)
        return jsonify({
            "success": True,
            "num_workers": num_workers,
            "results": suite
        })
    except Exception as e:
        return jsonify({"error": f"Benchmark suite failed: {str(e)}"}), 500


if __name__ == "__main__":
    # Required for Windows multiprocessing compatibility
    multiprocessing.freeze_support()
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Parallel Sorting Visualizer backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
