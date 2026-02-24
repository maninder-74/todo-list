import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, loading, onEdit, onSuccess }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{
            height: 90, background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
          }} />
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 20px', color: 'var(--muted)',
        border: '2px dashed var(--border)', borderRadius: 'var(--radius)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--text)' }}>No tasks found</h3>
        <p style={{ fontSize: '.875rem' }}>Create a new task or adjust your filters</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tasks.map((task, i) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onSuccess={onSuccess}
          style={{ animationDelay: `${i * 0.04}s` }}
        />
      ))}
    </div>
  );
}
