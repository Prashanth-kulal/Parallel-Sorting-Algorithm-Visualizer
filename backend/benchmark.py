"""
benchmark.py
============
Performance benchmarking and correctness verification module.

Compares Sequential Merge Sort vs Parallel Merge Sort.
Calculates:
- Speedup = T_sequential / T_parallel
- Efficiency = (Speedup / Number of Workers) * 100%
- Verification of sorting correctness, element conservation, and equivalence.
"""

import time
import random
from algorithms import merge_sort
from parallel_sort import parallel_merge_sort


def verify_correctness(original_arr, sequential_arr, parallel_arr):
    """
    Rigorously verifies sorting correctness:
    1. Is sorted: Ascending order check.
    2. Equivalence: Sequential and parallel produce identical arrays.
    3. Conservation: Count and values match original input without loss or corruption.
    """
    # 1. Is sorted check
    is_seq_sorted = all(sequential_arr[i] <= sequential_arr[i + 1] for i in range(len(sequential_arr) - 1))
    is_par_sorted = all(parallel_arr[i] <= parallel_arr[i + 1] for i in range(len(parallel_arr) - 1))

    # 2. Equivalence check
    is_identical = (sequential_arr == parallel_arr)

    # 3. Conservation check (multiset preservation)
    same_length = (len(original_arr) == len(sequential_arr) == len(parallel_arr))
    # Quick multiset verification: sorted version of original matches sequential
    # or sum / length check if large, but since sequential is sorted,
    # if sequential is identical to parallel and counts match, it is preserved.
    is_conserved = same_length and (sorted(original_arr) == sequential_arr)

    all_passed = is_seq_sorted and is_par_sorted and is_identical and is_conserved

    return {
        "all_passed": all_passed,
        "is_sorted": is_par_sorted,
        "is_identical": is_identical,
        "is_conserved": is_conserved,
        "element_count": len(original_arr)
    }


def run_benchmark(arr, num_workers=4, trials=1):
    """
    Executes benchmark comparison between Sequential Merge Sort and Parallel Merge Sort.
    Uses Python's time.perf_counter() for microsecond-precision timing.
    
    Parameters:
        arr (list): Array to sort.
        num_workers (int): Multiprocessing worker count.
        trials (int): Number of repeated trials (averaged for stability).
        
    Returns:
        dict: Benchmarking metrics, speedup, efficiency, and verification results.
    """
    trials = max(1, min(trials, 5))
    seq_times = []
    par_times = []
    last_seq_result = None
    last_par_result = None

    for _ in range(trials):
        test_copy_seq = list(arr)
        test_copy_par = list(arr)

        # 1. Sequential Merge Sort measurement
        t_seq_start = time.perf_counter()
        seq_sorted = merge_sort(test_copy_seq)
        t_seq_end = time.perf_counter()
        seq_times.append(t_seq_end - t_seq_start)
        last_seq_result = seq_sorted

        # 2. Parallel Merge Sort measurement
        t_par_start = time.perf_counter()
        par_res = parallel_merge_sort(test_copy_par, num_workers=num_workers, include_chunk_data=False)
        t_par_end = time.perf_counter()
        par_times.append(t_par_end - t_par_start)
        last_par_result = par_res["sorted_array"]

    avg_seq_time = sum(seq_times) / trials
    avg_par_time = sum(par_times) / trials

    effective_workers = min(num_workers, max(1, len(arr)))

    # Speedup = Sequential Execution Time / Parallel Execution Time
    speedup = (avg_seq_time / avg_par_time) if avg_par_time > 0 else 1.0

    # Parallel Efficiency (%) = (Speedup / Number of Workers) * 100
    efficiency = ((speedup / effective_workers) * 100) if effective_workers > 0 else 0.0

    # Verification checks
    verification = verify_correctness(arr, last_seq_result, last_par_result)

    return {
        "array_size": len(arr),
        "num_workers": effective_workers,
        "trials": trials,
        "sequential_time_seconds": avg_seq_time,
        "parallel_time_seconds": avg_par_time,
        "speedup": round(speedup, 4),
        "efficiency_percentage": round(efficiency, 2),
        "verification": verification,
        "timings_breakdown": par_res.get("timings", {}),
        "academic_note": (
            "For smaller datasets (e.g. < 5,000 items), sequential sort is typically faster due to "
            "Python multiprocessing IPC and process spawning overhead. For larger arrays, "
            "parallel execution achieves higher throughput and positive speedup."
        )
    }


def generate_benchmark_suite(sizes=None, num_workers=4):
    """
    Runs benchmark across multiple array sizes to generate data suitable for Recharts visual plots.
    """
    if sizes is None:
        sizes = [1000, 5000, 20000, 50000]
    
    suite_results = []
    for size in sizes:
        sample_arr = [random.randint(-10000, 10000) for _ in range(size)]
        res = run_benchmark(sample_arr, num_workers=num_workers, trials=1)
        suite_results.append({
            "size": size,
            "sequential_ms": round(res["sequential_time_seconds"] * 1000, 2),
            "parallel_ms": round(res["parallel_time_seconds"] * 1000, 2),
            "speedup": res["speedup"],
            "efficiency": res["efficiency_percentage"],
            "verified": res["verification"]["all_passed"]
        })
    return suite_results
