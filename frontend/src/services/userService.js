import api from './api';
export const userService = {
  getProfile: () => api.get('/users/profile').then(r => r.data),
  updateProfile: (data) => api.put('/users/profile', data).then(r => r.data),
  getAllUsers: () => api.get('/users/admin/all').then(r => r.data),
  deleteUser: (id) => api.delete(`/users/admin/${id}`).then(r => r.data),
};
