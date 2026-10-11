import React, { useState } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  GitMerge,
  ArrowRight,
  Server,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { runParallelSort } from '../services/api';
import StatsCard from './StatsCard';
import { WORKER_COLORS } from '../algorithms/sortingGenerators';

export default function ParallelExecution() {
  const [inputArrayText, setInputArrayText] = useState('8, 3, 6, 1, 9, 2, 5, 4, 12, 7, 15, 10');
  const [numWorkers, setNumWorkers] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Execution result from backend
  const [executionResult, setExecutionResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // 0: Input, 1: Partitioned, 2: Worker Sorted, 3: Merged

  // Execute Parallel Sort on Backend
  const handleExecuteParallel = async () => {
    setError(null);
    setLoading(true);
    setActiveStep(1);

    try {
      const parsedArray = inputArrayText
        .split(/[\s,]+/)
        .map((x) => x.trim())
        .filter((x) => x !== '')
        .map((x) => {
          const n = parseInt(x, 10);
          if (isNaN(n)) throw new Error(`Invalid integer "${x}"`);
          return n;
        });

      if (parsedArray.length === 0) throw new Error('Array cannot be empty');

      // Call backend Python multiprocessing API
      const result = await runParallelSort(parsedArray, numWorkers);
      setExecutionResult(result);
      setActiveStep(3); // Completed all stages
    } catch (err) {
      setError(err.message || 'Parallel execution failed. Ensure the Flask backend is running on port 5000.');
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setExecutionResult(null);
    setActiveStep(0);
    setError(null);
  };

  const handleGenerateRandom = (size = 16) => {
    const randoms = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setInputArrayText(randoms.join(', '));
    handleReset();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header and Controls */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Cpu size={20} color="var(--accent-primary)" />
              Multiprocessing Parallel Execution Pipeline
            </div>
            <div className="card-subtitle">
              Authentic parallel processing executed across Python OS worker processes using <code>multiprocessing.Pool</code>.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              id="btn-run-parallel"
              className="btn btn-primary"
              onClick={handleExecuteParallel}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Zap size={16} className="spin" />
                  Dispatching to OS Workers...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Execute Parallel Sort
                </>
              )}
            </button>
            <button
              id="btn-reset-parallel"
              className="btn btn-outline"
              onClick={handleReset}
              disabled={loading}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Input Array to Sort:</label>
            <input
              id="input-parallel-array"
              type="text"
              className="form-input"
              value={inputArrayText}
              onChange={(e) => setInputArrayText(e.target.value)}
              placeholder="e.g. 8, 3, 6, 1, 9, 2, 5, 4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Worker Processes (P):</label>
            <select
              id="select-workers-count"
              className="form-select"
              value={numWorkers}
              onChange={(e) => setNumWorkers(parseInt(e.target.value, 10))}
              disabled={loading}
            >
              <option value={2}>2 Worker Processes</option>
              <option value={4}>4 Worker Processes</option>
              <option value={8}>8 Worker Processes</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleGenerateRandom(12)}
              disabled={loading}
            >
              12 Items
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleGenerateRandom(24)}
              disabled={loading}
            >
              24 Items
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleGenerateRandom(40)}
              disabled={loading}
            >
              40 Items
            </button>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.85rem 1.15rem', background: 'rgba(248, 113, 113, 0.12)', border: '1px solid rgba(248, 113, 113, 0.35)', borderRadius: 'var(--radius-md)', color: 'var(--accent-error)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={18} />
            <div>
              <strong>Execution Error:</strong> {error}
            </div>
          </div>
        )}
      </div>

      {/* Multiprocessing Pipeline Steps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, fontSize: '0.88rem', color: activeStep >= 0 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: activeStep >= 0 ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-secondary)', border: `1px solid ${activeStep >= 0 ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: activeStep >= 0 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>1</span>
          1. Balanced Chunking
        </div>
        <ArrowRight size={16} color="var(--border-strong)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, fontSize: '0.88rem', color: activeStep >= 1 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: activeStep >= 1 ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-secondary)', border: `1px solid ${activeStep >= 1 ? 'var(--accent-primary)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: activeStep >= 1 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>2</span>
          2. Concurrent Worker Sorting
        </div>
        <ArrowRight size={16} color="var(--border-strong)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600, fontSize: '0.88rem', color: activeStep >= 3 ? 'var(--accent-success)' : 'var(--text-secondary)' }}>
          <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: activeStep >= 3 ? 'rgba(34, 197, 94, 0.2)' : 'var(--bg-secondary)', border: `1px solid ${activeStep >= 3 ? 'var(--accent-success)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: activeStep >= 3 ? 'var(--accent-success)' : 'var(--text-secondary)' }}>3</span>
          3. Hierarchical Tree Reduction
        </div>
      </div>

      {/* Execution Metrics if Available */}
      {executionResult && (
        <div className="stats-grid">
          <StatsCard
            icon={Clock}
            color="blue"
            label="Total Execution Time"
            value={`${(executionResult.timings.total_time_seconds * 1000).toFixed(2)} ms`}
            subtext="Complete Python process lifecycle"
          />
          <StatsCard
            icon={Cpu}
            color="green"
            label="Worker Process Count"
            value={`${executionResult.num_workers} Workers`}
            subtext="Concurrent OS subprocesses"
          />
          <StatsCard
            icon={Zap}
            color="orange"
            label="Parallel Sort Time"
            value={`${(executionResult.timings.parallel_sort_time_seconds * 1000).toFixed(3)} ms`}
            subtext="Chunk sorting duration"
          />
          <StatsCard
            icon={GitMerge}
            color="purple"
            label="Hierarchical Merge Time"
            value={`${(executionResult.timings.merge_time_seconds * 1000).toFixed(3)} ms`}
            subtext="Tree reduction merge duration"
          />
        </div>
      )}

      {/* Worker Lanes Grid */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Server size={18} color="var(--accent-primary)" />
            Multiprocessing Worker Lanes
          </div>
          <span className="card-subtitle">
            {executionResult ? 'Displaying chunk distribution & genuine execution metrics' : 'Awaiting parallel execution'}
          </span>
        </div>

        <div className="worker-lanes-grid">
          {executionResult ? (
            executionResult.worker_results.map((worker, idx) => {
              const workerColor = WORKER_COLORS[idx % WORKER_COLORS.length];
              return (
                <div
                  key={worker.worker_id}
                  className="worker-card"
                  style={{ borderTopColor: workerColor, borderTopWidth: '3px' }}
                >
                  <div className="worker-header">
                    <div className="worker-badge">
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: workerColor,
                          boxShadow: `0 0 8px ${workerColor}`
                        }}
                      />
                      <span>Worker Process #{worker.worker_id}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: 'var(--accent-success)',
                        border: '1px solid rgba(34, 197, 94, 0.35)'
                      }}
                    >
                      Status: Sorted
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <strong>Assigned Chunk:</strong> ({worker.chunk_size} elements)
                  </div>

                  {/* Input Chunk */}
                  <div className="worker-chunk-preview">
                    {worker.input_chunk.map((val, i) => (
                      <span key={i} className="chunk-chip" style={{ borderLeft: `3px solid ${workerColor}` }}>
                        {val}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.75rem 0 0.5rem' }}>
                    <strong>Sorted Output Chunk:</strong>
                  </div>

                  {/* Sorted Chunk */}
                  <div className="worker-chunk-preview">
                    {worker.sorted_chunk.map((val, i) => (
                      <span
                        key={i}
                        className="chunk-chip"
                        style={{ borderColor: 'rgba(34, 197, 94, 0.4)', color: 'var(--accent-success)', fontWeight: 700 }}
                      >
                        {val}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Worker Execution Time:</span>
                    <strong style={{ color: 'var(--accent-primary)' }}>
                      {(worker.worker_time_seconds * 1000).toFixed(3)} ms
                    </strong>
                  </div>
                </div>
              );
            })
          ) : (
            // Placeholder lanes
            Array.from({ length: numWorkers }, (_, idx) => {
              const workerColor = WORKER_COLORS[idx % WORKER_COLORS.length];
              return (
                <div
                  key={idx}
                  className="worker-card"
                  style={{ opacity: 0.7, borderTopColor: workerColor, borderTopWidth: '3px' }}
                >
                  <div className="worker-header">
                    <div className="worker-badge">
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: workerColor }} />
                      <span>Worker Process #{idx + 1}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Idle / Standby</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                    Chunk will be dispatched upon clicking "Execute Parallel Sort".
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Merging Reduction Stage Visualization */}
      {executionResult && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <GitMerge size={18} color="var(--accent-success)" />
              Hierarchical Tree Reduction (K-Way Merge)
            </div>
            <span className="card-subtitle">
              Pairwise progressive merging of worker sub-arrays into the final sorted array
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {executionResult.merge_stages?.map((stage) => (
              <div
                key={stage.round}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.15rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  <span>Merge Reduction Round {stage.round}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    {stage.input_chunks_count} chunks → {stage.output_chunks_count} chunks
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                  {stage.steps.map((st, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem'
                      }}
                    >
                      {st.passthrough ? (
                        <span>Chunk {st.left_index + 1} carried over ({st.left_size} items)</span>
                      ) : (
                        <>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Chunk {st.left_index + 1} ({st.left_size})</span>
                          <span>+</span>
                          <span style={{ color: 'var(--accent-warning)', fontWeight: 600 }}>Chunk {st.right_index + 1} ({st.right_size})</span>
                          <ArrowRight size={14} color="var(--border-strong)" />
                          <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>Merged ({st.merged_size})</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Final Sorted Array Display */}
            <div style={{ marginTop: '0.5rem', padding: '1.15rem', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.35)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.65rem' }}>
                <CheckCircle2 size={18} />
                Final Output Array ({executionResult.sorted_array.length} Elements Sorted):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {executionResult.sorted_array.map((val, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.55rem',
                      background: 'var(--bg-card)',
                      border: '1px solid rgba(34, 197, 94, 0.5)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--accent-success)'
                    }}
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
