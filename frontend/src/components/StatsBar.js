import React from 'react';

const statCards = [
  { key: 'total',       label: 'Total',       emoji: '📋', color: '#6c63ff' },
  { key: 'pending',     label: 'Pending',     emoji: '⏳', color: '#fb923c' },
  { key: 'in-progress', label: 'In Progress', emoji: '⚡', color: '#a78bfa' },
  { key: 'completed',   label: 'Completed',   emoji: '✅', color: '#4ade80' },
];

export default function StatsBar({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
      {statCards.map(({ key, label, emoji, color }) => (
        <div key={key} className="card fade-in" style={{ padding: '16px 18px', borderLeft: `3px solid ${color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 20 }}>{emoji}</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Syne', color }}>{stats[key] ?? 0}</span>
          </div>
          <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: 4 }}>{label}</p>
        </div>
      ))}
    </div>
  );
}
