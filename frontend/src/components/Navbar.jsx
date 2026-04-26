// Navbar.jsx — Refactored to pure Tailwind CSS
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/admin-dashboard';
    if (user.role === 'Chef') return '/chef-dashboard';
    return '/user-dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const roleStyles = { 
    Admin: 'bg-purple-100 text-purple-700', 
    Chef: 'bg-blue-100 text-blue-700', 
    User: 'bg-gray-100 text-gray-700' 
  };

  const navLinks = [
    { key: 'home', label: 'Home', to: '/' },
    { key: 'recipes', label: 'Browse Recipes', to: '/recipes' },
    { key: 'categories', label: 'Categories', to: '/recipes' },
    { key: 'chefs', label: 'Chefs', to: '/chefs' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 28C16 28 12 23 12 18C12 13 16 9 21 9C22.5 5.5 26 3 30 3C34 3 37.5 5.5 39 9C44 9 48 13 48 18C48 23 44 28 38 28" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M14 36C14 36 18 42 32 42C46 42 50 36 50 36" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M11 40C11 40 16 48 32 48C48 48 53 40 53 40" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
              <path d="M9 44C9 44 15 53 32 53C49 53 55 44 55 44" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
              <path d="M30 30C30 30 29 28 31 27C33 26 33 28 33 28C33 28 33 26 35 27C37 28 36 30 36 30L33 34L30 30Z" fill="#EA580C"/>
            </svg>
          </div>
          <span className="font-serif text-xl font-bold tracking-tight">
            <span className="text-foreground">Recipe</span><span className="text-primary">Nest</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link 
              key={l.key} 
              to={l.to} 
              className={`text-[15px] font-medium transition-colors hover:text-primary ${isActive(l.to) ? 'text-primary' : 'text-muted'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-secondary rounded-full mr-2">
                <span className="text-xs font-semibold text-foreground">{user.fullName}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleStyles[user.role] || roleStyles.User}`}>
                  {user.role}
                </span>
              </div>
              <Link to={getDashboardPath()} className="btn btn-outline btn-sm gap-2">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button 
                className="p-2 text-muted hover:text-destructive hover:bg-red-50 rounded-full transition-all" 
                onClick={handleLogout} 
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm px-6">Register</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden p-2 text-muted hover:bg-secondary rounded-xl transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map(l => (
            <Link 
              key={l.key} 
              to={l.to} 
              className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive(l.to) ? 'bg-primary/5 text-primary' : 'text-muted hover:bg-secondary'}`}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border space-y-2">
            {isLoggedIn ? (
              <>
                <Link 
                  to={getDashboardPath()} 
                  className="flex items-center justify-center gap-2 w-full btn btn-outline" 
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button 
                  className="w-full btn bg-red-50 text-red-600 hover:bg-red-100" 
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block w-full text-center btn btn-outline" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="block w-full text-center btn btn-primary" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
