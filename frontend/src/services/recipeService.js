import api from './api';

export const recipeService = {
  getAll: (query = '', category = '') =>
    api.get('/recipes', { params: { query, category } }).then(r => r.data),

  getById: (id) => api.get(`/recipes/${id}`).then(r => r.data),

  getMine: () => api.get('/recipes/me').then(r => r.data),

  getByChef: (chefId) => api.get(`/recipes/chef/${chefId}`).then(r => r.data),
  
  getAllAdmin: () => api.get('/recipes/admin/all').then(r => r.data),
  
  updateStatus: (id, status) => api.patch(`/recipes/${id}/status`, status, {
    headers: { 'Content-Type': 'application/json' }
  }).then(r => r.data),

  create: (data) => api.post('/recipes', data).then(r => r.data),

  update: (id, data) => api.put(`/recipes/${id}`, data).then(r => r.data),

  delete: (id) => api.delete(`/recipes/${id}`).then(r => r.data),
};
