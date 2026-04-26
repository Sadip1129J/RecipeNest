import api from './api';
export const statisticsService = {
  getAdminStats: () => api.get('/statistics/admin').then(r => r.data),
  getChefStats: () => api.get('/statistics/chef/me').then(r => r.data),
};
