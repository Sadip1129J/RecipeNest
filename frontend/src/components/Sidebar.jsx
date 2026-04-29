// Sidebar.jsx — Reusable Sidebar for Admin, Chef, and User dashboards
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  UtensilsCrossed,
  Tags,
  BarChart3,
  Heart,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ role, className = '' }) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path) => {
    const [pathname, hash] = path.split('#');
    if (hash) {
      return location.pathname === pathname && location.hash === `#${hash}`;
    }
    return location.pathname === pathname && !location.hash;
  };

  // Configuration based on role
  const menuConfigs = {
    Admin: [
      { label: 'Overview', to: '/admin-dashboard', icon: LayoutDashboard },
      { label: 'Manage Recipes', to: '/admin-dashboard#recipes', icon: BookOpen },
      { label: 'Manage Users', to: '/admin-dashboard#users', icon: Users },
      { label: 'Categories', to: '/admin-dashboard#categories', icon: Tags },
      { label: 'Analytics', to: '/admin-dashboard#stats', icon: BarChart3 },
      { label: 'Profile Settings', to: '/profile-settings', icon: Settings },
    ],
    Chef: [
      { label: 'My Portfolio', to: '/chef-dashboard', icon: LayoutDashboard },
      { label: 'My Recipes', to: '/chef-dashboard#recipes', icon: UtensilsCrossed },
      { label: 'Saved Recipes', to: '/user-dashboard#saved-recipes', icon: Heart },
      { label: 'Profile Settings', to: '/profile-settings', icon: Settings },
    ],
    User: [
      { label: 'My Dashboard', to: '/user-dashboard', icon: LayoutDashboard },
      { label: 'Saved Recipes', to: '/user-dashboard#saved-recipes', icon: Heart },
      { label: 'My Reviews', to: '/user-dashboard#my-reviews', icon: UtensilsCrossed },
      { label: 'Profile Settings', to: '/profile-settings', icon: Settings },
    ]
  };

  const menuItems = menuConfigs[role] || menuConfigs.User;

  return (
    <aside className={`admin-sidebar ${className}`}>
      {/* Brand */}
      <div className="p-8 border-b border-border mb-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary/5 rounded-xl">
            <UtensilsCrossed size={24} className="text-primary" />
          </div>
          <span className="font-serif text-xl font-bold">Recipe<span className="text-primary">Nest</span></span>
        </Link>
      </div>

      {/* Profile Summary */}
      <div className="px-6 py-4 mb-6">
        <div className="flex items-center gap-4 p-4 bg-secondary rounded-2xl">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt={user.fullName} 
              className="w-12 h-12 rounded-full object-cover border border-primary/20" 
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-lg">
              {user?.fullName?.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{user?.fullName}</p>
            <p className="text-[10px] font-bold text-subtle uppercase tracking-wider">{role} Account</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                active 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-muted hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              <ChevronRight size={16} className={`transition-transform ${active ? 'opacity-100 rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
            </Link>
          );
        })}
      </nav>

      {/* Footer / Home / Logout */}
      <div className="p-6 border-t border-border mt-auto space-y-2">
        <Link 
          to="/"
          className="flex items-center gap-3 w-full p-4 text-sm font-semibold text-muted hover:bg-secondary hover:text-foreground rounded-2xl transition-colors"
        >
          <Home size={20} />
          <span>Back to Main Page</span>
        </Link>
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full p-4 text-sm font-semibold text-destructive hover:bg-red-50 rounded-2xl transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
