"""
algorithms.py
=============
Sequential implementations of fundamental sorting algorithms:
1. Bubble Sort
2. Selection Sort
3. Insertion Sort
4. Merge Sort
5. Quick Sort

Designed for clarity, academic demonstration, and report friendliness.
"""

def bubble_sort(arr):
    """Sorts an array using Bubble Sort (O(n^2))."""
    a = list(arr)
    n = len(a)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    return a


def selection_sort(arr):
    """Sorts an array using Selection Sort (O(n^2))."""
    a = list(arr)
    n = len(a)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if a[j] < a[min_idx]:
                min_idx = j
        a[i], a[min_idx] = a[min_idx], a[i]
    return a


def insertion_sort(arr):
    """Sorts an array using Insertion Sort (O(n^2))."""
    a = list(arr)
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a


def merge(left, right):
    """Merges two sorted sub-arrays into a single sorted list."""
    merged = []
    i = j = 0
    len_left, len_right = len(left), len(right)
    while i < len_left and j < len_right:
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    if i < len_left:
        merged.extend(left[i:])
    if j < len_right:
        merged.extend(right[j:])
    return merged


def merge_sort(arr):
    """Sorts an array using standard Sequential Merge Sort (O(n log n))."""
    if len(arr) <= 1:
        return list(arr)
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)


def quick_sort(arr):
    """Sorts an array using Quick Sort with median/mid pivot (O(n log n))."""
    if len(arr) <= 1:
        return list(arr)
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
