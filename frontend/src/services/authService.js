// authService.js — login, register, and logout API calls
import api from './api';

export const authService = {
  // Login: returns { token, id, fullName, email, role, ... }
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(res => res.data),

  // Register: returns same shape as login
  register: (fullName, email, password, role = 'User') =>
    api.post('/auth/register', { fullName, email, password, role }).then(res => res.data),

  // Get currently logged-in user from token
  getMe: () =>
    api.get('/auth/me').then(res => res.data),
};
