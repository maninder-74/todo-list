import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { taskService } from '../services/taskService';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  stats: { pending: 0, 'in-progress': 0, completed: 0, total: 0 },
  loading: false,
  statsLoading: false,
  error: null,
  filters: { status: '', priority: '', category: '', search: '', sortBy: 'createdAt', order: 'desc' },
  pagination: { page: 1, totalPages: 1, total: 0, limit: 20 },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':       return { ...state, loading: action.payload };
    case 'SET_STATS_LOADING': return { ...state, statsLoading: action.payload };
    case 'SET_ERROR':         return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':       return { ...state, error: null };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, pagination: { ...state.pagination, ...action.payload.pagination }, loading: false, error: null };
    case 'SET_STATS':
      return { ...state, stats: action.payload, statsLoading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t._id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTasks = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await taskService.getAllTasks({ ...state.filters, ...params });
      dispatch({
        type: 'SET_TASKS',
        payload: {
          tasks: res.tasks,
          pagination: { page: res.page, totalPages: res.totalPages, total: res.total, limit: res.limit },
        },
      });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [state.filters]);

  const fetchStats = useCallback(async () => {
    dispatch({ type: 'SET_STATS_LOADING', payload: true });
    try {
      const res = await taskService.getStats();
      dispatch({ type: 'SET_STATS', payload: res.stats });
    } catch (err) {
      console.error('Stats fetch error:', err.message);
      dispatch({ type: 'SET_STATS_LOADING', payload: false });
    }
  }, []);

  const createTask = async (taskData) => {
    const res = await taskService.createTask(taskData);
    dispatch({ type: 'ADD_TASK', payload: res.task });
    fetchStats();
    return res.task;
  };

  const updateTask = async (id, taskData) => {
    const res = await taskService.updateTask(id, taskData);
    dispatch({ type: 'UPDATE_TASK', payload: res.task });
    fetchStats();
    return res.task;
  };

  const toggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    const res = await taskService.patchTask(task._id, { status: nextStatus });
    dispatch({ type: 'UPDATE_TASK', payload: res.task });
    fetchStats();
    return res.task;
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    dispatch({ type: 'DELETE_TASK', payload: id });
    fetchStats();
  };

  const bulkDelete = async (status) => {
    await taskService.bulkDelete(status);
    await fetchTasks();
    fetchStats();
  };

  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <TaskContext.Provider value={{
      ...state,
      fetchTasks, fetchStats, createTask, updateTask, toggleStatus,
      deleteTask, bulkDelete, setFilters, clearError,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
