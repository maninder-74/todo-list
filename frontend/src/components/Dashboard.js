import React, { useEffect, useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import StatsBar from './StatsBar';
import FilterBar from './FilterBar';
import Toast from './Toast';

export default function Dashboard() {
  const {
    tasks, loading, error, stats, filters, pagination,
    fetchTasks, fetchStats, bulkDelete, setFilters, clearError,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => { fetchTasks(); fetchStats(); }, []); 

  useEffect(() => { fetchTasks(); }, [filters]); 

  const handleEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditingTask(null); };

  const handleBulkDelete = async () => {
    if (!window.confirm('Delete all completed tasks? This cannot be undone.')) return;
    try {
      await bulkDelete('completed');
      showToast('All completed tasks deleted!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        padding: '20px 32px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>✓</div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>TaskFlow</h1>
            <p style={{ fontSize: '.72rem', color: 'var(--muted)', lineHeight: 1 }}>
              {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {stats.completed > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={handleBulkDelete}>
              🗑 Clear Completed ({stats.completed})
            </button>
          )}
          <button className="btn btn-primary" onClick={() => { setEditingTask(null); setShowForm(true); }}>
            + New Task
          </button>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 920, width: '100%', margin: '0 auto', padding: '28px 24px' }}>
  
        <StatsBar stats={stats} />


        {error && (
          <div style={{
            background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>⚠ {error}</span>
            <button onClick={clearError} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
        )}

            <FilterBar filters={filters} onFilterChange={setFilters} onRefresh={fetchTasks} />

    
        {showForm && (
          <TaskForm
            editingTask={editingTask}
            onClose={handleCloseForm}
            onSuccess={(msg) => { showToast(msg); fetchStats(); }}
          />
        )}

      
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleEdit}
          onSuccess={showToast}
        />

    
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchTasks({ page: p })}
                className="btn btn-ghost btn-sm"
                style={pagination.page === p ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' } : {}}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
