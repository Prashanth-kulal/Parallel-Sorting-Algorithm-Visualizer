import React from 'react';
import { GitFork, ArrowDown, GitMerge } from 'lucide-react';

export default function MergeSortView({
  array = [],
  comparing = [],
  swapping = [],
  sorted = new Set(),
  subrange = null,
  leftSubarray = [],
  rightSubarray = [],
  leftPointer = null,
  rightPointer = null,
  mergedBuffer = []
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
      {/* Divide & Subarrays Row */}
      {subrange && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '900px',
            marginBottom: '1.25rem',
            padding: '1rem',
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            flexWrap: 'wrap'
          }}
        >
          {/* Left Subarray Group */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Left Subarray ({leftSubarray.length} items)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {leftSubarray.map((val, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '48px',
                    height: '56px',
                    background: leftPointer === idx ? 'rgba(56, 189, 248, 0.25)' : 'var(--bg-elevated)',
                    border: leftPointer === idx ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: leftPointer === idx ? 'var(--accent-primary)' : 'var(--text-primary)',
                    boxShadow: leftPointer === idx ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                    transform: leftPointer === idx ? 'scale(1.06)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <span>{val}</span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>L[{idx}]</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--accent-warning)', fontWeight: 700, fontSize: '0.75rem' }}>
            <GitMerge size={20} />
            <span>MERGE</span>
          </div>

          {/* Right Subarray Group */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-warning)', textTransform: 'uppercase' }}>
              Right Subarray ({rightSubarray.length} items)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {rightSubarray.map((val, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '48px',
                    height: '56px',
                    background: rightPointer === idx ? 'rgba(251, 191, 36, 0.25)' : 'var(--bg-elevated)',
                    border: rightPointer === idx ? '2px solid var(--accent-warning)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: rightPointer === idx ? 'var(--accent-warning)' : 'var(--text-primary)',
                    boxShadow: rightPointer === idx ? '0 0 12px rgba(251, 191, 36, 0.5)' : 'none',
                    transform: rightPointer === idx ? 'scale(1.06)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <span>{val}</span>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>R[{idx}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Base Array Row */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
          Target Array State:
        </span>

        <div className="array-boxes-container">
          {array.map((value, idx) => {
            const isSorted = sorted.has(idx);
            const isComparing = comparing.includes(idx);
            const isWriting = swapping.includes(idx);
            const isInActiveSubrange = subrange && idx >= subrange[0] && idx <= subrange[1];

            let stateClass = '';
            let badgeText = null;

            if (isWriting) {
              stateClass = 'state-swapping';
              badgeText = 'WRITE';
            } else if (isComparing) {
              stateClass = 'state-comparing';
              badgeText = 'CMP';
            } else if (isSorted) {
              stateClass = 'state-sorted';
              badgeText = '✓ SORTED';
            }

            return (
              <div
                key={idx}
                className={`array-box ${stateClass} ${subrange && !isInActiveSubrange ? 'dimmed' : ''}`}
                title={`Index [${idx}]: Value ${value}`}
              >
                <div
                  className="box-top-badge"
                  style={{
                    color: isWriting ? 'var(--accent-swap)' : isComparing ? 'var(--accent-warning)' : isSorted ? 'var(--accent-success)' : 'transparent'
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
