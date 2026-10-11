"""
parallel_sort.py
================
Parallel Merge Sort implementation utilizing Python's multiprocessing module.

Architecture:
1. Chunk Division: Balances an array of size N across P worker processes.
2. Concurrent Execution: Worker processes sort each chunk independently.
3. K-Way / Hierarchical Merging: Progressively merges sorted chunks into the final array.
4. Execution Tracing: Captures chunk boundaries, worker timings, and merge stages
   for academic presentation and visualizer display.
"""

import time
import os
import multiprocessing
from algorithms import merge_sort, merge


def _worker_sort(chunk_info):
    """
    Top-level worker task executed within a separate multiprocessing process.
    chunk_info: tuple (worker_id, chunk_list)
    Returns: dict with worker metrics and sorted chunk.
    """
    worker_id, chunk = chunk_info
    start_t = time.perf_counter()
    sorted_chunk = merge_sort(chunk)
    elapsed_t = time.perf_counter() - start_t
    return {
        "worker_id": worker_id,
        "input_chunk": chunk,
        "chunk_size": len(chunk),
        "sorted_chunk": sorted_chunk,
        "worker_time_seconds": elapsed_t
    }


def split_into_chunks(arr, num_chunks):
    """Divides an array into num_chunks balanced segments."""
    n = len(arr)
    if num_chunks <= 0:
        num_chunks = 1
    num_chunks = min(num_chunks, max(1, n))
    
    k, m = divmod(n, num_chunks)
    chunks = []
    start = 0
    for i in range(num_chunks):
        end = start + k + (1 if i < m else 0)
        chunks.append((i + 1, arr[start:end]))
        start = end
    return chunks


def hierarchical_merge(sorted_chunks, record_stages=True):
    """
    Merges multiple sorted chunks using a reduction tree.
    Returns: (final_sorted_array, list of merge stages for visualization)
    """
    if not sorted_chunks:
        return [], []
    if len(sorted_chunks) == 1:
        return sorted_chunks[0], []

    current_chunks = list(sorted_chunks)
    stages = []
    round_idx = 1

    while len(current_chunks) > 1:
        next_chunks = []
        round_steps = []
        for i in range(0, len(current_chunks), 2):
            if i + 1 < len(current_chunks):
                merged = merge(current_chunks[i], current_chunks[i + 1])
                round_steps.append({
                    "left_index": i,
                    "right_index": i + 1,
                    "left_size": len(current_chunks[i]),
                    "right_size": len(current_chunks[i + 1]),
                    "merged_size": len(merged)
                })
                next_chunks.append(merged)
            else:
                next_chunks.append(current_chunks[i])
                round_steps.append({
                    "left_index": i,
                    "right_index": None,
                    "left_size": len(current_chunks[i]),
                    "right_size": 0,
                    "merged_size": len(current_chunks[i]),
                    "passthrough": True
                })
        if record_stages:
            stages.append({
                "round": round_idx,
                "input_chunks_count": len(current_chunks),
                "output_chunks_count": len(next_chunks),
                "steps": round_steps
            })
        current_chunks = next_chunks
        round_idx += 1

    return current_chunks[0], stages


def parallel_merge_sort(arr, num_workers=None, include_chunk_data=True):
    """
    Executes Parallel Merge Sort using multiprocessing.Pool.
    
    Parameters:
        arr (list): The list of numbers to sort.
        num_workers (int): Number of worker processes (default: available CPU cores or 4).
        include_chunk_data (bool): If False, truncates chunk data in response to keep
                                   JSON payloads lightweight during heavy benchmarks.
    
    Returns:
        dict: Complete execution metadata, sorted array, timings, and worker logs.
    """
    if num_workers is None:
        num_workers = min(os.cpu_count() or 4, 4)
    else:
        num_workers = max(1, min(int(num_workers), 16))

    total_start = time.perf_counter()

    # Base case for empty or single-element list
    if len(arr) <= 1:
        elapsed = time.perf_counter() - total_start
        return {
            "sorted_array": list(arr),
            "num_workers": 1,
            "total_time_seconds": elapsed,
            "worker_results": [{
                "worker_id": 1,
                "chunk_size": len(arr),
                "input_chunk": list(arr) if include_chunk_data else [],
                "sorted_chunk": list(arr) if include_chunk_data else [],
                "worker_time_seconds": elapsed
            }],
            "merge_stages": []
        }

    # Effective workers should not exceed array length
    effective_workers = min(num_workers, len(arr))
    
    # 1. Chunk distribution
    chunk_start = time.perf_counter()
    chunks = split_into_chunks(arr, effective_workers)
    chunk_time = time.perf_counter() - chunk_start

    # 2. Parallel worker sorting via multiprocessing.Pool
    sort_start = time.perf_counter()
    with multiprocessing.Pool(processes=effective_workers) as pool:
        worker_results = pool.map(_worker_sort, chunks)
    parallel_sort_time = time.perf_counter() - sort_start

    # 3. Hierarchical reduction merge of sorted sublists
    merge_start = time.perf_counter()
    sorted_chunks_list = [res["sorted_chunk"] for res in worker_results]
    final_sorted, merge_stages = hierarchical_merge(sorted_chunks_list, record_stages=True)
    merge_time = time.perf_counter() - merge_start

    total_time = time.perf_counter() - total_start

    # Clean response for large payload optimizations if needed
    cleaned_worker_results = []
    for r in worker_results:
        cleaned_worker_results.append({
            "worker_id": r["worker_id"],
            "chunk_size": r["chunk_size"],
            "input_chunk": r["input_chunk"] if (include_chunk_data and len(arr) <= 200) else r["input_chunk"][:10],
            "sorted_chunk": r["sorted_chunk"] if (include_chunk_data and len(arr) <= 200) else r["sorted_chunk"][:10],
            "worker_time_seconds": r["worker_time_seconds"]
        })

    return {
        "sorted_array": final_sorted,
        "num_workers": effective_workers,
        "timings": {
            "total_time_seconds": total_time,
            "chunk_time_seconds": chunk_time,
            "parallel_sort_time_seconds": parallel_sort_time,
            "merge_time_seconds": merge_time
        },
        "worker_results": cleaned_worker_results,
        "merge_stages": merge_stages
    }
