import React, { useState } from 'react';
import {
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BarChart3,
  Cpu,
  Zap,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { runBenchmark, runBenchmarkSuite } from '../services/api';
import StatsCard from './StatsCard';

const SIZE_PRESETS = [
  { label: 'Small (2,000 items)', value: 2000 },
  { label: 'Medium (15,000 items)', value: 15000 },
  { label: 'Large (50,000 items)', value: 50000 },
  { label: 'Extra Large (100,000 items)', value: 100000 }
];

export default function PerformanceAnalysis() {
  const [arraySize, setArraySize] = useState(20000);
  const [numWorkers, setNumWorkers] = useState(4);
  const [trials, setTrials] = useState(1);
  const [loading, setLoading] = useState(false);
  const [suiteLoading, setSuiteLoading] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [chartData, setChartData] = useState([
    { size: '1,000', sequential_ms: 0.8, parallel_ms: 11.5, speedup: 0.07 },
    { size: '5,000', sequential_ms: 4.6, parallel_ms: 15.2, speedup: 0.30 },
    { size: '20,000', sequential_ms: 22.8, parallel_ms: 18.1, speedup: 1.26 },
    { size: '50,000', sequential_ms: 65.4, parallel_ms: 28.9, speedup: 2.26 }
  ]);
  const [hasRunSuite, setHasRunSuite] = useState(false);
  const [error, setError] = useState(null);

  // Run single benchmark
  const handleRunBenchmark = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await runBenchmark({
        size: arraySize,
        numWorkers,
        trials
      });
      setBenchmarkData(data);
    } catch (err) {
      setError(err.message || 'Benchmark execution failed. Ensure the Flask backend is active on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Run full benchmark suite for charts
  const handleRunSuite = async () => {
    setError(null);
    setSuiteLoading(true);
    try {
      const results = await runBenchmarkSuite({
        sizes: [1000, 5000, 20000, 50000],
        numWorkers
      });
      const formatted = results.map((r) => ({
        size: r.size.toLocaleString(),
        sequential_ms: r.sequential_ms,
        parallel_ms: r.parallel_ms,
        speedup: r.speedup
      }));
      setChartData(formatted);
      setHasRunSuite(true);
    } catch (err) {
      setError(err.message || 'Benchmark suite execution failed. Ensure the Flask backend is active on port 5000.');
    } finally {
      setSuiteLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Configuration Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <TrendingUp size={20} color="var(--accent-primary)" />
              Performance Benchmark: Sequential vs Parallel Merge Sort
            </div>
            <div className="card-subtitle">
              Fair benchmark comparing single-thread Merge Sort against Python multiprocessing on identical input arrays using <code>time.perf_counter()</code>.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              id="btn-run-benchmark"
              className="btn btn-primary"
              onClick={handleRunBenchmark}
              disabled={loading || suiteLoading}
            >
              <Zap size={16} />
              {loading ? 'Running Benchmark...' : 'Run Single Benchmark'}
            </button>
            <button
              id="btn-run-suite"
              className="btn btn-success"
              onClick={handleRunSuite}
              disabled={loading || suiteLoading}
            >
              <BarChart3 size={16} />
              {suiteLoading ? 'Profiling Suite...' : 'Run Full Size Suite (Charts)'}
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group">
            <label className="form-label">Array Size (Elements):</label>
            <input
              id="input-benchmark-size"
              type="number"
              min="100"
              max="200000"
              step="1000"
              className="form-input"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value, 10) || 1000)}
              disabled={loading || suiteLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preset Array Sizes:</label>
            <select
              className="form-select"
              onChange={(e) => setArraySize(parseInt(e.target.value, 10))}
              disabled={loading || suiteLoading}
              value={arraySize}
            >
              {SIZE_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Worker Processes (P):</label>
            <select
              id="select-benchmark-workers"
              className="form-select"
              value={numWorkers}
              onChange={(e) => setNumWorkers(parseInt(e.target.value, 10))}
              disabled={loading || suiteLoading}
            >
              <option value={2}>2 Worker Processes</option>
              <option value={4}>4 Worker Processes</option>
              <option value={8}>8 Worker Processes</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Repeated Trials (Averaging):</label>
            <select
              className="form-select"
              value={trials}
              onChange={(e) => setTrials(parseInt(e.target.value, 10))}
              disabled={loading || suiteLoading}
            >
              <option value={1}>1 Trial</option>
              <option value={3}>3 Trials (Averaged)</option>
              <option value={5}>5 Trials (Averaged)</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.85rem 1.15rem', background: 'rgba(248, 113, 113, 0.12)', border: '1px solid rgba(248, 113, 113, 0.35)', borderRadius: 'var(--radius-md)', color: 'var(--accent-error)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={18} />
            <div>
              <strong>Benchmark Error:</strong> {error}
            </div>
          </div>
        )}
      </div>

      {/* Benchmark Metric Cards */}
      {benchmarkData && (
        <>
          <div className="stats-grid">
            <StatsCard
              icon={TrendingUp}
              color={benchmarkData.speedup >= 1.0 ? 'green' : 'orange'}
              label="Measured Speedup"
              value={`${benchmarkData.speedup}x`}
              subtext="T_sequential / T_parallel"
            />
            <StatsCard
              icon={Zap}
              color="blue"
              label="Parallel Efficiency"
              value={`${benchmarkData.efficiency_percentage}%`}
              subtext={`(Speedup / ${benchmarkData.num_workers} Workers) × 100`}
            />
            <StatsCard
              icon={Clock}
              color="orange"
              label="Sequential Time"
              value={`${(benchmarkData.sequential_time_seconds * 1000).toFixed(2)} ms`}
              subtext={`Array size: ${benchmarkData.array_size.toLocaleString()} items`}
            />
            <StatsCard
              icon={Cpu}
              color="green"
              label="Parallel Time"
              value={`${(benchmarkData.parallel_time_seconds * 1000).toFixed(2)} ms`}
              subtext={`Using ${benchmarkData.num_workers} OS worker processes`}
            />
          </div>

          {/* Correctness Verification Checklist Card */}
          <div className="card" style={{ borderColor: benchmarkData.verification?.all_passed ? 'rgba(34, 197, 94, 0.4)' : 'rgba(248, 113, 113, 0.4)' }}>
            <div className="card-header">
              <div className="card-title">
                <ShieldCheck size={20} color="var(--accent-success)" />
                Academic Correctness Verification
              </div>
              <span className={`verification-badge ${benchmarkData.verification?.all_passed ? 'success' : 'failure'}`}>
                {benchmarkData.verification?.all_passed ? (
                  <>
                    <CheckCircle2 size={16} /> All Correctness Tests Passed
                  </>
                ) : (
                  <>
                    <XCircle size={16} /> Verification Failed
                  </>
                )}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {/* Check 1: Ascending Sorted Order */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {benchmarkData.verification?.is_sorted ? (
                  <CheckCircle2 size={22} color="var(--accent-success)" />
                ) : (
                  <XCircle size={22} color="var(--accent-error)" />
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>1. Ascending Sorted Order</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Array satisfies A[i] ≤ A[i+1] for all indices
                  </div>
                </div>
              </div>

              {/* Check 2: Sequential vs Parallel Equivalence */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {benchmarkData.verification?.is_identical ? (
                  <CheckCircle2 size={22} color="var(--accent-success)" />
                ) : (
                  <XCircle size={22} color="var(--accent-error)" />
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>2. Algorithm Equivalence</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Parallel output strictly equals sequential output
                  </div>
                </div>
              </div>

              {/* Check 3: Element Conservation */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {benchmarkData.verification?.is_conserved ? (
                  <CheckCircle2 size={22} color="var(--accent-success)" />
                ) : (
                  <XCircle size={22} color="var(--accent-error)" />
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>3. Element Conservation</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Zero elements lost, duplicated, or corrupted ({benchmarkData.verification?.element_count.toLocaleString()} elements)
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Notes / Multiprocessing overhead note */}
            <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--accent-primary)', display: 'flex', gap: '0.65rem' }}>
              <BookOpen size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Academic Principle (Amdahl's Law & IPC Overhead): </strong>
                {benchmarkData.academic_note}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Visual Recharts Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.25rem' }}>
        {/* Chart 1: Execution Time Comparison */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <BarChart3 size={18} color="var(--accent-primary)" />
                Execution Time Comparison (ms)
              </div>
              <div className="card-subtitle">
                {hasRunSuite ? 'Live benchmark suite results' : 'Representative benchmark profile'}
              </div>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2B3545" />
                <XAxis dataKey="size" stroke="#A7B0C0" label={{ value: 'Array Size (Elements)', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#A7B0C0' }} />
                <YAxis stroke="#A7B0C0" label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#A7B0C0' }} />
                <Tooltip
                  formatter={(val) => [`${val} ms`, '']}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #3E4C63', color: '#F8FAFC' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#F8FAFC' }} />
                <Bar dataKey="sequential_ms" name="Sequential Merge Sort" fill="#FB7185" radius={[4, 4, 0, 0]} />
                <Bar dataKey="parallel_ms" name="Parallel Merge Sort" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Speedup Curve */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp size={18} color="var(--accent-secondary)" />
                Speedup Scaling Curve (T_seq / T_par)
              </div>
              <div className="card-subtitle">
                Values &gt; 1.0 indicate effective speedup over sequential execution
              </div>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2B3545" />
                <XAxis dataKey="size" stroke="#A7B0C0" label={{ value: 'Array Size (Elements)', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#A7B0C0' }} />
                <YAxis stroke="#A7B0C0" label={{ value: 'Speedup Factor', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#A7B0C0' }} />
                <Tooltip
                  formatter={(val) => [`${val}x`, 'Speedup']}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #3E4C63', color: '#F8FAFC' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#F8FAFC' }} />
                <Line
                  type="monotone"
                  dataKey="speedup"
                  name="Speedup Factor"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#8B5CF6' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* College Project Report Formulas Reference Card */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: '0.65rem' }}>
          <BookOpen size={18} color="var(--accent-primary)" />
          Formal Parallel Computing Formulas for Project Report
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>1. Speedup (S):</strong>
            <div className="mono" style={{ margin: '0.35rem 0', color: 'var(--accent-primary)' }}>
              S = T_sequential / T_parallel
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
              Quantifies performance gains achieved by distributing work across worker processes.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>2. Parallel Efficiency (E):</strong>
            <div className="mono" style={{ margin: '0.35rem 0', color: 'var(--accent-success)' }}>
              E = (S / P) × 100%
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
              Evaluates processing utilization per worker core. 100% indicates ideal linear scaling.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>3. Amdahl's Law Limitation:</strong>
            <div className="mono" style={{ margin: '0.35rem 0', color: 'var(--accent-warning)' }}>
              S_max = 1 / ((1 - p) + p / P)
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
              Where p is the parallel portion of work, and (1 - p) is the non-parallelizable sequential merging phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
