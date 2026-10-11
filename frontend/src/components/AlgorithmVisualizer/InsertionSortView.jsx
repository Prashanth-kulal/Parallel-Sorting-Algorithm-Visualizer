import React from 'react';
import { KeyRound, ArrowRight, CornerDownRight } from 'lucide-react';

export default function InsertionSortView({
  array = [],
  comparing = [],
  swapping = [],
  sorted = new Set(),
  sortedBoundary = 1,
  keyVal = null,
  keyOriginalIndex = null,
  emptySlot = null,
  shiftingIndex = null
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
      {/* Floating Key Box Card */}
      {keyVal !== null && (
        <div className="key-card-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-swap)', fontWeight: 800, fontSize: '0.85rem' }}>
            <KeyRound size={18} />
            <span>EXTRACTED KEY:</span>
          </div>

          <div
            style={{
              width: '46px',
              height: '46px',
              background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.35), rgba(251, 113, 133, 0.15))',
              border: '2px solid var(--accent-swap)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#FFE4E6',
              fontFamily: 'JetBrains Mono',
              boxShadow: '0 0 16px rgba(251, 113, 133, 0.6)'
            }}
          >
            {keyVal}
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Comparing against sorted partition [0..{keyOriginalIndex - 1}]
          </div>

          {emptySlot !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, marginLeft: 'auto' }}>
              <CornerDownRight size={16} />
              <span>Target Gap: slot [{emptySlot}]</span>
            </div>
          )}
        </div>
      )}

      {/* Main Boxes Container */}
      <div className="array-boxes-container">
        {array.map((value, idx) => {
          const isSorted = sorted.has(idx);
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isShifting = shiftingIndex === idx;
          const isSlot = emptySlot === idx;

          let stateClass = '';
          let badgeText = null;

          if (isShifting) {
            stateClass = 'state-swapping';
            badgeText = 'SHIFT →';
          } else if (isSwapping) {
            stateClass = 'state-swapping';
            badgeText = 'INSERT';
          } else if (isSlot && keyVal !== null) {
            stateClass = 'state-comparing';
            badgeText = 'GAP';
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
              style={{
                borderStyle: isSlot && keyVal !== null ? 'dashed' : 'solid',
                borderColor: isSlot && keyVal !== null ? 'var(--accent-primary)' : undefined
              }}
              title={`Index [${idx}]: Value ${value}`}
            >
              <div
                className="box-top-badge"
                style={{
                  color: isShifting || isSwapping ? 'var(--accent-swap)' : isSlot ? 'var(--accent-primary)' : isSorted ? 'var(--accent-success)' : isComparing ? 'var(--accent-warning)' : 'transparent'
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
