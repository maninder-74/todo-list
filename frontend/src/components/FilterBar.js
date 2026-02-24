import React, { useState } from 'react';

export default function FilterBar({ filters, onFilterChange, onRefresh }) {
  const [searchVal, setSearchVal] = useState(filters.search || '');

  const handleSearch = (e) => {
    if (e.key === 'Enter') onFilterChange({ search: searchVal, page: 1 });
  };

  const handleReset = () => {
    setSearchVal('');
    onFilterChange({ status: '', priority: '', category: '', search: '', sortBy: 'createdAt', order: 'desc' });
  };

  return (
    <div className="card" style={{ marginBottom: 20, padding: '14px 16px' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14 }}>🔍</span>
          <input
            className="input"
            style={{ paddingLeft: 34 }}
            placeholder="Search tasks… (Enter)"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        <select
          className="input"
          style={{ width: 'auto', flex: '0 1 140px' }}
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="input"
          style={{ width: 'auto', flex: '0 1 140px' }}
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value, page: 1 })}
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="input"
          style={{ width: 'auto', flex: '0 1 160px' }}
          value={`${filters.sortBy}:${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split(':');
            onFilterChange({ sortBy, order });
          }}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="dueDate:asc">Due Date ↑</option>
          <option value="dueDate:desc">Due Date ↓</option>
          <option value="priority:desc">Priority ↓</option>
          <option value="title:asc">Title A–Z</option>
        </select>

        <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset filters">↺ Reset</button>
        <button className="btn-icon" onClick={onRefresh} title="Refresh">⟳</button>
      </div>
    </div>
  );
}
