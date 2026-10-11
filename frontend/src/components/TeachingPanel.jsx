import React from 'react';
import {
  BookOpen,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Compass
} from 'lucide-react';

export default function TeachingPanel({
  stepNumber = 0,
  totalSteps = 0,
  operation = 'Ready',
  elementsInvolved = '',
  why = '',
  whatChanged = '',
  whatNext = '',
  algorithmName = ''
}) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginTop: '1.25rem',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}
          >
            <BookOpen size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Teaching Mode: Step-by-Step Educational Explanation
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Detailed academic walkthrough for classroom lecture demonstration ({algorithmName})
            </span>
          </div>
        </div>

        {/* Step Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--accent-primary)'
          }}
        >
          <span>Step {stepNumber}</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{totalSteps || '—'}</span>
        </div>
      </div>

      {/* Grid of Explanation Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Card 1: Current Operation & Elements Involved */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
            <Compass size={16} />
            Current Operation
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
            {operation}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Elements Involved:</strong>{' '}
            <span style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>
              {elementsInvolved || 'None'}
            </span>
          </div>
        </div>

        {/* Card 2: Why This Operation Is Happening */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-warning)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
            <HelpCircle size={16} />
            Why Is This Happening?
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {why || 'Waiting to start sorting.'}
          </div>
        </div>

        {/* Card 3: What Changed In The Array */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
            <CheckCircle2 size={16} />
            What Changed?
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {whatChanged || 'Initial array loaded.'}
          </div>
        </div>

        {/* Card 4: What Happens Next */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
            <Lightbulb size={16} />
            What Happens Next?
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {whatNext || 'Click "Start Sorting" or "Next Step" to begin.'}
          </div>
        </div>
      </div>
    </div>
  );
}
