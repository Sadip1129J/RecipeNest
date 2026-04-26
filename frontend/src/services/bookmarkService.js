import api from './api';
export const bookmarkService = {
  getMine: () => api.get('/bookmarks/me').then(r => r.data),
  add: (recipeId) => api.post(`/bookmarks/${recipeId}`).then(r => r.data),
  remove: (recipeId) => api.delete(`/bookmarks/${recipeId}`).then(r => r.data),
};
