"""
test_backend.py
===============
Comprehensive unit tests for the sorting algorithms, multiprocessing parallel sort,
benchmark calculation, and correctness verification functions.
"""

import unittest
from algorithms import (
    bubble_sort,
    selection_sort,
    insertion_sort,
    merge_sort,
    quick_sort
)
from parallel_sort import parallel_merge_sort, split_into_chunks, hierarchical_merge
from benchmark import verify_correctness, run_benchmark


class TestSortingAlgorithms(unittest.TestCase):

    def setUp(self):
        self.test_cases = {
            "random": [8, 3, 6, 1, 9, 2, 5, 4],
            "already_sorted": [1, 2, 3, 4, 5, 6, 7, 8],
            "reverse_sorted": [9, 8, 7, 6, 5, 4, 3, 2, 1],
            "duplicates": [4, 2, 7, 2, 9, 4, 1, 2],
            "negatives": [-5, 12, -3, 0, 8, -1, 4],
            "single_element": [42],
            "empty": []
        }
        self.algorithms = [
            ("Bubble Sort", bubble_sort),
            ("Selection Sort", selection_sort),
            ("Insertion Sort", insertion_sort),
            ("Merge Sort", merge_sort),
            ("Quick Sort", quick_sort)
        ]

    def test_sequential_algorithms(self):
        for name, fn in self.algorithms:
            for case_name, arr in self.test_cases.items():
                expected = sorted(arr)
                result = fn(arr)
                self.assertEqual(
                    result, expected,
                    f"Algorithm {name} failed on case {case_name}: {arr} -> {result}"
                )

    def test_chunking(self):
        arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        chunks = split_into_chunks(arr, 3)
        self.assertEqual(len(chunks), 3)
        reconstructed = []
        for _, c in chunks:
            reconstructed.extend(c)
        self.assertEqual(reconstructed, arr)

    def test_hierarchical_merge(self):
        chunks = [[1, 5, 9], [2, 6, 10], [3, 7], [4, 8]]
        merged, stages = hierarchical_merge(chunks)
        self.assertEqual(merged, list(range(1, 11)))
        self.assertGreaterEqual(len(stages), 1)

    def test_parallel_merge_sort_edge_cases(self):
        for case_name, arr in self.test_cases.items():
            expected = sorted(arr)
            res = parallel_merge_sort(arr, num_workers=2)
            self.assertEqual(
                res["sorted_array"], expected,
                f"Parallel sort failed on case {case_name}"
            )

    def test_correctness_verification(self):
        original = [5, -2, 8, 1, 3]
        correct = [-2, 1, 3, 5, 8]
        tampered = [-2, 1, 3, 5, 9]  # altered element

        valid = verify_correctness(original, correct, correct)
        self.assertTrue(valid["all_passed"])
        self.assertTrue(valid["is_sorted"])
        self.assertTrue(valid["is_identical"])
        self.assertTrue(valid["is_conserved"])

        invalid = verify_correctness(original, correct, tampered)
        self.assertFalse(invalid["all_passed"])
        self.assertFalse(invalid["is_identical"])

    def test_benchmark_runner(self):
        sample = [random_val for random_val in range(100, 0, -1)]
        res = run_benchmark(sample, num_workers=2, trials=1)
        self.assertEqual(res["array_size"], 100)
        self.assertIn("speedup", res)
        self.assertIn("efficiency_percentage", res)
        self.assertTrue(res["verification"]["all_passed"])


if __name__ == "__main__":
    unittest.main()
