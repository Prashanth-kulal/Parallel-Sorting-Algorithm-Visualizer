import React from 'react';
import { Star, Target, Search } from 'lucide-react';

export default function SelectionSortView({
  array = [],
  comparing = [],
  swapping = [],
  sorted = new Set(),
  targetIdx = 0,
  minCandidate = null,
  minVal = null,
  scanPointer = null
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
      {/* Top Banner: Target vs Current Minimum */}
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
          <Target size={16} />
          <span>Target Slot: index [{targetIdx}] (where min will be placed)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
          <Star size={16} fill="var(--accent-warning)" />
          <span>Current Minimum: {minVal !== null ? `${minVal} (at index ${minCandidate})` : 'Scanning...'}</span>
        </div>

        {scanPointer !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Search size={14} />
            <span>Scanning index [{scanPointer}] ({array[scanPointer]})</span>
          </div>
        )}
      </div>

      {/* Main Boxes Container with Partition Boundary Divider */}
      <div className="array-boxes-container">
        {array.map((value, idx) => {
          const isSorted = sorted.has(idx);
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isMin = minCandidate === idx;
          const isTarget = targetIdx === idx;
          const isScanning = scanPointer === idx;

          let stateClass = '';
          let badgeText = null;

          if (isSwapping) {
            stateClass = 'state-swapping';
            badgeText = 'SWAP';
          } else if (isMin && !isSorted) {
            stateClass = 'state-comparing state-min';
            badgeText = '★ MIN';
          } else if (isComparing) {
            stateClass = 'state-comparing';
            badgeText = 'SCAN';
          } else if (isSorted) {
            stateClass = 'state-sorted';
            badgeText = '✓ SORTED';
          } else if (isTarget) {
            badgeText = 'TARGET';
          }

          return (
            <div
              key={idx}
              className={`array-box ${stateClass}`}
              style={{
                borderStyle: isTarget && !isSorted ? 'dashed' : 'solid',
                borderColor: isMin ? 'var(--accent-warning)' : isTarget && !isSorted ? 'var(--accent-primary)' : undefined
              }}
              title={`Index [${idx}]: Value ${value}`}
            >
              <div
                className="box-top-badge"
                style={{
                  color: isSwapping ? 'var(--accent-swap)' : isMin ? 'var(--accent-warning)' : isSorted ? 'var(--accent-success)' : isTarget ? 'var(--accent-primary)' : 'transparent'
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
