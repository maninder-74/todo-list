import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';

const priorityMap = { high: '🔴', medium: '🟡', low: '🔵' };
const statusBadge = { pending: 'badge-pending', 'in-progress': 'badge-progress', completed: 'badge-completed' };
const priorityBadge = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TaskCard({ task, onEdit, onSuccess }) {
  const { toggleStatus, deleteTask } = useTasks();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isOverdue = task.dueDate && new Date() > new Date(task.dueDate) && task.status !== 'completed';

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleStatus(task);
      onSuccess(task.status === 'completed' ? 'Task marked as pending' : 'Task completed! 🎉');
    } catch (err) {
      onSuccess(err.message, 'error');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await deleteTask(task._id);
      onSuccess('Task deleted');
    } catch (err) {
      onSuccess(err.message, 'error');
      setDeleting(false);
    }
  };

  return (
    <div className="card fade-in" style={{
      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
      opacity: task.status === 'completed' ? 0.75 : 1,
      borderLeft: task.status === 'completed' ? '3px solid #4ade80' :
                  task.status === 'in-progress' ? '3px solid #a78bfa' : '3px solid var(--border)',
      transition: 'all .2s',
    }}>
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        style={{
          width: 22, height: 22, minWidth: 22, borderRadius: 6,
          border: `2px solid ${task.status === 'completed' ? '#4ade80' : 'var(--border)'}`,
          background: task.status === 'completed' ? '#4ade80' : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 2, transition: 'all .2s', fontSize: 12, color: '#0d0f14',
        }}
      >
        {task.status === 'completed' && '✓'}
        {toggling && <span className="spinner" style={{ width: 12, height: 12 }} />}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontWeight: 600, fontSize: '.95rem', lineHeight: 1.4, wordBreak: 'break-word',
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            color: task.status === 'completed' ? 'var(--muted)' : 'var(--text)',
          }}>
            {priorityMap[task.priority]} {task.title}
          </span>
        </div>

        {task.description && (
          <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>
            {task.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className={`badge ${statusBadge[task.status]}`}>{task.status}</span>
          <span className={`badge ${priorityBadge[task.priority]}`}>{task.priority}</span>
          {task.category && task.category !== 'General' && (
            <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>{task.category}</span>
          )}
          {task.dueDate && (
            <span style={{ fontSize: '.75rem', color: isOverdue ? '#f87171' : 'var(--muted)' }}>
              {isOverdue ? '⚠ Overdue: ' : '📅 '}{formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button className="btn-icon" onClick={() => onEdit(task)} title="Edit task" style={{ fontSize: 13 }}>✎</button>
        <button
          className="btn-icon"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete task"
          style={{ fontSize: 13, color: '#f87171', borderColor: 'rgba(248,113,113,.3)' }}
        >
          {deleting ? <span className="spinner" style={{ width: 12, height: 12 }} /> : '🗑'}
        </button>
      </div>
    </div>
  );
}
