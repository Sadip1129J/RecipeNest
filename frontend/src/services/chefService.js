import api from './api';
export const chefService = {
  getAll: (query = '') => api.get('/chefs', { params: { query } }).then(r => r.data),
  getById: (id) => api.get(`/chefs/${id}`).then(r => r.data),
  getMyProfile: () => api.get('/chefs/me/profile').then(r => r.data),
  updateMyProfile: (data) => api.put('/chefs/me/profile', data).then(r => r.data),
};
