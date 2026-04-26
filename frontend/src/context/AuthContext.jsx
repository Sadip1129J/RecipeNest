// AuthContext.jsx — global auth state using React Context
// Stores user info and JWT token. Token is stored in localStorage.
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { id, fullName, email, role, ... }
  const [loading, setLoading] = useState(true); // true while checking token on mount

  // On app load: check if a token exists and fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getMe()
        .then(me => setUser(me))
        .catch(() => {
          // Token invalid/expired — clear it
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login: call API, save token, set user
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  // Register: call API, save token, set user
  const register = async (fullName, email, password, role) => {
    const data = await authService.register(fullName, email, password, role);
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  // Logout: clear token, clear user state
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Helper booleans for role checks
  const isAdmin = user?.role === 'Admin';
  const isChef = user?.role === 'Chef' || user?.role === 'Admin';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, isAdmin, isChef, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook — use this in any component to get auth state
export function useAuth() {
  return useContext(AuthContext);
}
