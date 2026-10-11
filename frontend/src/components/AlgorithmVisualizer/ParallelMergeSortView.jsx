import React from 'react';
import { Cpu, GitMerge, Layers } from 'lucide-react';
import { WORKER_COLORS } from '../../algorithms/sortingGenerators';

export default function ParallelMergeSortView({
  array = [],
  comparing = [],
  swapping = [],
  sorted = new Set(),
  workerChunks = [],
  activeWorkerId = null,
  reductionRound = null
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
      {/* Top Banner: Worker Lanes Summary */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '900px',
          marginBottom: '1rem',
          padding: '0.45rem 1rem',
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
          <Cpu size={16} />
          <span>Parallel Chunks: {workerChunks.length} Worker Processes</span>
        </div>

        {activeWorkerId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
            <span>Active Process: Worker #{activeWorkerId} sorting</span>
          </div>
        )}

        {reductionRound && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-success)', fontWeight: 700 }}>
            <GitMerge size={16} />
            <span>Reduction Round {reductionRound} Merging</span>
          </div>
        )}
      </div>

      {/* Worker Lanes Card Deck */}
      {workerChunks.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
            gap: '0.85rem',
            width: '100%',
            maxWidth: '900px',
            marginBottom: '1.25rem'
          }}
        >
          {workerChunks.map((chunk) => {
            const isActive = activeWorkerId === chunk.workerId;
            return (
              <div
                key={chunk.workerId}
                style={{
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-secondary)',
                  border: `2px solid ${isActive ? chunk.color : 'var(--border-subtle)'}`,
                  borderTop: `4px solid ${chunk.color}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  boxShadow: isActive ? `0 0 16px ${chunk.color}44` : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.82rem', color: chunk.color }}>
                    Worker #{chunk.workerId}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    [{chunk.start}..{chunk.end - 1}]
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {chunk.items.map((val, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '0.2rem 0.45rem',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Base Array Display */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
          Global Shared Memory Array:
        </span>

        <div className="array-boxes-container">
          {array.map((value, idx) => {
            const isSorted = sorted.has(idx);
            const isComparing = comparing.includes(idx);
            const isSwapping = swapping.includes(idx);

            // Find worker color
            let chunkColor = null;
            let workerId = null;
            for (const c of workerChunks) {
              if (idx >= c.start && idx < c.end) {
                chunkColor = c.color;
                workerId = c.workerId;
                break;
              }
            }

            let stateClass = '';
            let badgeText = workerId ? `W${workerId}` : null;

            if (isSwapping) {
              stateClass = 'state-swapping';
              badgeText = 'WRITE';
            } else if (isComparing) {
              stateClass = 'state-comparing';
              badgeText = 'CMP';
            } else if (isSorted) {
              stateClass = 'state-sorted';
              badgeText = '✓';
            }

            return (
              <div
                key={idx}
                className={`array-box ${stateClass}`}
                style={{
                  borderColor: chunkColor && !stateClass ? chunkColor : undefined
                }}
                title={`Index [${idx}]: Value ${value} | Worker ${workerId}`}
              >
                <div
                  className="box-top-badge"
                  style={{
                    color: isSwapping ? 'var(--accent-swap)' : isComparing ? 'var(--accent-warning)' : isSorted ? 'var(--accent-success)' : chunkColor || 'transparent'
                  }}
                >
                  {badgeText || '·'}
                </div>

                <div className="box-value">{value}</div>

                <div className="box-index">idx: {idx}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
