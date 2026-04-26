import api from './api';

export const statsService = {
  getSummary: () => api.get('/statistics/admin').then(res => res.data),
  getChefStats: () => api.get('/statistics/chef/me').then(res => res.data)
};
