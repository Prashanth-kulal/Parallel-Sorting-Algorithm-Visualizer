import React from 'react';
import { Crown, Split, ArrowRightLeft } from 'lucide-react';

export default function QuickSortView({
  array = [],
  comparing = [],
  swapping = [],
  sorted = new Set(),
  pivotIndex = null,
  pivotVal = null,
  low = 0,
  high = array.length - 1,
  boundaryI = -1,
  scanJ = null
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
      {/* Top Banner: Partition Range & Pivot Card */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '850px',
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
          <Split size={16} />
          <span>Active Partition: range [{low} .. {high}]</span>
        </div>

        {pivotVal !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)', fontWeight: 800 }}>
            <Crown size={16} />
            <span style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '0.15rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-secondary)' }}>
              Pivot: {pivotVal} (at index {pivotIndex})
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
          <span>Boundary i: [{boundaryI}] (elements ≤ Pivot)</span>
        </div>
      </div>

      {/* Main Boxes Container */}
      <div className="array-boxes-container">
        {array.map((value, idx) => {
          const isSorted = sorted.has(idx);
          const isPivot = pivotIndex === idx;
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isOutsidePartition = low !== null && high !== null && (idx < low || idx > high);

          let stateClass = '';
          let badgeText = null;

          if (isPivot) {
            stateClass = 'state-pivot';
            badgeText = 'PIVOT';
          } else if (isSwapping) {
            stateClass = 'state-swapping';
            badgeText = 'SWAP';
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
              className={`array-box ${stateClass} ${isOutsidePartition ? 'dimmed' : ''}`}
              title={`Index [${idx}]: Value ${value}`}
            >
              <div
                className="box-top-badge"
                style={{
                  color: isPivot ? 'var(--accent-secondary)' : isSwapping ? 'var(--accent-swap)' : isComparing ? 'var(--accent-warning)' : isSorted ? 'var(--accent-success)' : 'transparent'
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
  );
}
