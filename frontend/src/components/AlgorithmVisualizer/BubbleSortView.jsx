import React from 'react';

export default function BubbleSortView({
  array = [],
  comparing = [],
  swapping = [],
  sorted = new Set(),
  sortedBoundary = array.length
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
      {/* Top Guide: Adjacent Pair & Sorted Boundary Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '850px',
          marginBottom: '1rem',
          padding: '0.4rem 1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Comparing Adjacent:</span>
          {comparing.length === 2 ? (
            <span style={{ color: 'var(--accent-warning)', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>
              array[{comparing[0]}] ({array[comparing[0]]}) ⇄ array[{comparing[1]}] ({array[comparing[1]]})
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>None</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Sorted Partition:</span>
          <span style={{ color: 'var(--accent-success)', fontWeight: 700 }}>
            {sorted.size > 0 ? `Indices [${Math.min(...Array.from(sorted))}..${array.length - 1}] (${sorted.size} elements)` : 'None yet'}
          </span>
        </div>
      </div>

      {/* Main Boxes Container */}
      <div className="array-boxes-container">
        {array.map((value, idx) => {
          const isSorted = sorted.has(idx);
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);

          let stateClass = '';
          let badgeText = null;

          if (isSwapping) {
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
              className={`array-box ${stateClass}`}
              title={`Index [${idx}]: Value ${value}`}
            >
              <div
                className="box-top-badge"
                style={{
                  color: isSwapping ? 'var(--accent-swap)' : isComparing ? 'var(--accent-warning)' : isSorted ? 'var(--accent-success)' : 'transparent'
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
