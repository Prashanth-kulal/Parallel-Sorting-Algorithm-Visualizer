import React from 'react';

export default function StatsCard({ icon: Icon, color = 'blue', label, value, subtext }) {
  return (
    <div className="stat-card">
      {Icon && (
        <div className={`stat-icon ${color}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {subtext && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{subtext}</div>}
      </div>
    </div>
  );
}
