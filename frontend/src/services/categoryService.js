import api from './api';
export const categoryService = {
  getAll: () => api.get('/categories').then(r => r.data),
  getWithCounts: () => api.get('/categories/with-counts').then(r => r.data),
  create: (name) => api.post('/categories', { name }).then(r => r.data),
  delete: (id) => api.delete(`/categories/${id}`).then(r => r.data),
};
