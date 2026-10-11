/**
 * api.js
 * ======
 * Frontend API client communicating with Flask backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      error: err.message,
      message: 'Backend server is not reachable on ' + API_BASE_URL
    };
  }
}

export async function runSequentialSort(array, algorithm = 'merge') {
  const res = await fetch(`${API_BASE_URL}/api/sort/sequential`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ array, algorithm })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Sequential sort failed.');
  return data;
}

export async function runParallelSort(array, numWorkers = 4) {
  const res = await fetch(`${API_BASE_URL}/api/sort/parallel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ array, num_workers: numWorkers })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Parallel sort failed.');
  return data;
}

export async function runBenchmark({ array, size, numWorkers = 4, trials = 1 }) {
  const payload = {
    num_workers: numWorkers,
    trials
  };
  if (array && array.length > 0) {
    payload.array = array;
  } else if (size) {
    payload.size = size;
  }

  const res = await fetch(`${API_BASE_URL}/api/benchmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Benchmark failed.');
  return data.data;
}

export async function runBenchmarkSuite({ sizes, numWorkers = 4 }) {
  const res = await fetch(`${API_BASE_URL}/api/benchmark/suite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sizes, num_workers: numWorkers })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Benchmark suite failed.');
  return data.results;
}
