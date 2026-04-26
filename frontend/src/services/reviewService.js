import api from './api';
export const reviewService = {
  getByRecipe: (recipeId) => api.get(`/reviews/recipe/${recipeId}`).then(r => r.data),
  create: (recipeId, data) => api.post(`/reviews/recipe/${recipeId}`, data).then(r => r.data),
};
