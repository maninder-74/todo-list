import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

const defaultForm = { title: '', description: '', status: 'pending', priority: 'medium', category: 'General', dueDate: '' };

export default function TaskForm({ editingTask, onClose, onSuccess }) {
  const { createTask, updateTask } = useTasks();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'pending',
        priority: editingTask.priority || 'medium',
        category: editingTask.category || 'General',
        dueDate: editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTask]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length > 200) errs.title = 'Title too long (max 200 chars)';
    if (form.description.length > 1000) errs.description = 'Description too long (max 1000 chars)';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setErrors({});
    try {
      const payload = { ...form, dueDate: form.dueDate || null };
      if (editingTask) {
        await updateTask(editingTask._id, payload);
        onSuccess('Task updated successfully! ✏️');
      } else {
        await createTask(payload);
        onSuccess('Task created successfully! 🎉');
      }
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      backdropFilter: 'blur(4px)',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.1rem' }}>{editingTask ? '✏️ Edit Task' : '+ New Task'}</h2>
          <button onClick={onClose} className="btn-icon" style={{ fontSize: 18 }}>×</button>
        </div>

        {errors.submit && (
          <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: '.875rem' }}>
            ⚠ {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Title <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              className={`input ${errors.title ? 'input-error' : ''}`}
              style={errors.title ? { borderColor: '#f87171' } : {}}
              name="title" value={form.title} onChange={handleChange}
              placeholder="What needs to be done?"
              autoFocus
            />
            {errors.title && <p style={{ fontSize: '.75rem', color: '#f87171', marginTop: 4 }}>{errors.title}</p>}
          </div>

          <div>
            <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea
              className="input"
              name="description" value={form.description} onChange={handleChange}
              placeholder="Add more details…"
              rows={3}
              style={{ resize: 'vertical', minHeight: 70 }}
            />
            {errors.description && <p style={{ fontSize: '.75rem', color: '#f87171', marginTop: 4 }}>{errors.description}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Status</label>
              <select className="input" name="status" value={form.status} onChange={handleChange}>
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">⚡ In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Priority</label>
              <select className="input" name="priority" value={form.priority} onChange={handleChange}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Category</label>
              <input
                className="input" name="category" value={form.category}
                onChange={handleChange} placeholder="e.g. Work, Personal"
              />
            </div>
            <div>
              <label style={{ fontSize: '.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Due Date</label>
              <input className="input" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <><span className="spinner" /> Saving…</> : editingTask ? '✓ Update Task' : '+ Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
