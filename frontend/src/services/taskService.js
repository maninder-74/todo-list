import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);


export const taskService = {

  getAllTasks: (params = {}) => api.get('/tasks', { params }),

  getTaskById: (id) => api.get(`/tasks/${id}`),

  getStats: () => api.get('/tasks/stats'),

  createTask: (taskData) => api.post('/tasks', taskData),

  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),

  patchTask: (id, updates) => api.patch(`/tasks/${id}`, updates),

  deleteTask: (id) => api.delete(`/tasks/${id}`),

  bulkDelete: (status) => api.delete('/tasks', { params: { status } }),
};
