// App.jsx — all routes with role-based protection
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import Chefs from './pages/Chefs';
import ChefProfile from './pages/ChefProfile';
import UserDashboard from './pages/UserDashboard';
import ChefDashboard from './pages/ChefDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfileSettings from './pages/ProfileSettings';

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/admin-dashboard';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/chefs" element={<Chefs />} />
        <Route path="/chefs/:id" element={<ChefProfile />} />

        {/* Protected: User */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute roles={['User']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Protected: Chef */}
        <Route path="/chef-dashboard" element={
          <ProtectedRoute roles={['Chef']}>
            <ChefDashboard />
          </ProtectedRoute>
        } />

        {/* Protected: Admin */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute roles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Protected: All authenticated users */}
        <Route path="/profile-settings" element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        } />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
