// AdminDashboard.jsx — Refactored to pure Tailwind CSS
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  MoreVertical,
  Tags
} from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { userService } from '../services/userService';
import { categoryService } from '../services/categoryService';
import { statisticsService } from '../services/statisticsService';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import RecipeForm from '../components/RecipeForm';
import ConfirmModal from '../components/ConfirmModal';
import Loading from '../components/Loading';

export default function AdminDashboard() {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('recipes'); // recipes, users, categories, stats, moderation
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]); // Includes pending
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form/Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [deleteData, setDeleteData] = useState(null); // { id, type: 'recipe'|'user'|'category' }
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', message: '' }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const hash = location.hash.substring(1);
    if (['recipes', 'users', 'categories', 'stats'].includes(hash)) {
      setActiveTab(hash);
      // Optional: scroll to the main content area
      const element = document.getElementById('admin-resource-view');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else if (!hash) {
      setActiveTab('recipes');
    }
  }, [location.hash]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch core resources individually to prevent one failure from blocking everything
      const results = await Promise.allSettled([
        recipeService.getAll(),
        userService.getAllUsers(),
        categoryService.getAll(),
        statisticsService.getAdminStats()
      ]);

      if (results[0].status === 'fulfilled') setRecipes(results[0].value);
      if (results[1].status === 'fulfilled') setUsers(results[1].value);
      if (results[2].status === 'fulfilled') setCategories(results[2].value);
      if (results[3].status === 'fulfilled') setStats(results[3].value);

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      if (deleteData.type === 'recipe') {
        await recipeService.delete(deleteData.id);
        setRecipes(recipes.filter(r => r.id !== deleteData.id));
        setAlert({ type: 'success', message: 'Recipe successfully deleted.' });
      } else if (deleteData.type === 'user') {
        await userService.deleteUser(deleteData.id);
        setUsers(users.filter(u => u.id !== deleteData.id));
        setAlert({ type: 'success', message: 'User successfully deleted.' });
      } else if (deleteData.type === 'category') {
        await categoryService.delete(deleteData.id);
        setCategories(categories.filter(c => c.id !== deleteData.id));
        setAlert({ type: 'success', message: 'Category successfully deleted.' });
      }
      fetchData(); // Refresh stats
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: `Failed to delete ${deleteData.type}.` });
    } finally {
      setDeleteData(null);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingRecipe) {
        await recipeService.update(editingRecipe.id, data);
      } else {
        await recipeService.create(data);
      }
      setIsFormOpen(false);
      setEditingRecipe(null);
      fetchData();
    } catch (err) { console.error(err); }
  };


  if (loading && recipes.length === 0) return <Loading />;

  return (
    <div className="admin-layout">
      <Sidebar role={user?.role} className={!isSidebarOpen ? 'collapsed' : 'open'} />
      
      <main className={`admin-main ${!isSidebarOpen ? 'full-width' : ''}`}>
        {/* Top Header */}
        <header className="admin-topbar">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-muted hover:bg-secondary rounded-xl transition-colors"
          >
            <MoreVertical size={20} className={!isSidebarOpen ? '' : 'rotate-90'} />
          </button>
          <h1 className="text-xl font-bold font-serif">Administrator Control Panel</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
              <input 
                type="text" placeholder="Search resources..."
                className="pl-10 pr-4 py-2 bg-secondary rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2.5 bg-secondary text-muted rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
              <Plus size={20} />
            </button>
          </div>
        </header>

        <div className="admin-content">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Recipes', value: stats?.totalRecipes || 0, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50', trend: '+12%' },
              { label: 'Active Chefs', value: stats?.totalChefs || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5%' },
              { label: 'Platform Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+18%' },
              { label: 'Avg Rating', value: stats?.averageRating?.toFixed(1) || '4.8', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Stable' },
            ].map((s, i) => (
              <div key={i} className="admin-stat-card group">
                <div className={`p-4 ${s.bg} ${s.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                  <s.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-subtle uppercase tracking-widest">{s.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-foreground">{s.value}</span>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight size={10} /> {s.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mb-8 bg-secondary/50 p-1 rounded-2xl w-fit">
            {[
              { id: 'recipes', label: 'Recipes', icon: BookOpen },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'categories', label: 'Categories', icon: Tags },
              { id: 'stats', label: 'Analytics', icon: BarChart3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Main Resource View */}
          <div id="admin-resource-view" className="bg-white border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold font-serif capitalize">{activeTab} Management</h2>
                <span className="px-3 py-1 bg-secondary text-muted rounded-full text-xs font-bold">
                  {activeTab === 'recipes' ? recipes.length : 
                   activeTab === 'users' ? users.length : categories.length} total
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {alert && (
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold ${alert.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {alert.message}
                  </div>
                )}
                <button className="flex-1 sm:flex-none btn btn-outline btn-sm gap-2">
                  <Filter size={14} /> Filter
                </button>
                {activeTab === 'recipes' && (
                  <button 
                    onClick={() => { setEditingRecipe(null); setIsFormOpen(true); }}
                    className="flex-1 sm:flex-none btn btn-primary btn-sm gap-2"
                  >
                    <Plus size={14} /> Add New
                  </button>
                )}
              </div>
            </div>

            {/* Table / Form Content */}
            <div className="p-6">
              {isFormOpen ? (
                <RecipeForm 
                  initialData={editingRecipe}
                  onSubmit={handleFormSubmit}
                  onCancel={() => { setIsFormOpen(false); setEditingRecipe(null); }}
                />
              ) : activeTab === 'stats' ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 bg-secondary/30 rounded-[2rem] border border-border">
                      <h4 className="text-lg font-serif font-bold mb-6">User Growth</h4>
                      <div className="h-48 flex items-end gap-2 px-4">
                        {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-4 text-[10px] font-bold text-subtle px-2">
                        <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                      </div>
                    </div>
                    <div className="p-8 bg-secondary/30 rounded-[2rem] border border-border">
                      <h4 className="text-lg font-serif font-bold mb-6">Recipe Popularity</h4>
                      <div className="space-y-4">
                        {recipes.slice(0, 4).map(r => (
                          <div key={r.id} className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate max-w-[200px]">{r.title}</span>
                            <div className="flex-1 mx-4 h-1.5 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${(r.ratingAverage / 5) * 100}%` }} />
                            </div>
                            <span className="text-xs font-bold">{r.ratingAverage.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="pb-4 text-xs font-bold text-subtle uppercase tracking-wider px-4">Resource</th>
                        <th className="pb-4 text-xs font-bold text-subtle uppercase tracking-wider px-4">Meta</th>
                        <th className="pb-4 text-xs font-bold text-subtle uppercase tracking-wider px-4">Status</th>
                        <th className="pb-4 text-xs font-bold text-subtle uppercase tracking-wider px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeTab === 'recipes' && recipes.map(r => (
                        <tr key={r.id} className="group hover:bg-secondary/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden">
                                <img src={r.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-foreground">{r.title}</p>
                                <p className="text-xs text-muted">by Chef {r.chefName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-xs font-bold text-foreground">{r.categoryName}</p>
                            <p className="text-[10px] text-subtle uppercase tracking-wider mt-0.5">{r.prepTime} • {r.servings} Servings</p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setEditingRecipe(r); setIsFormOpen(true); }}
                                className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                title="Edit Recipe"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => setDeleteData({ id: r.id, type: 'recipe' })}
                                className="p-2 text-muted hover:text-destructive hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Recipe"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {activeTab === 'users' && users.map(u => (
                        <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-4">
                              {u.profileImageUrl ? (
                                <img src={u.profileImageUrl} alt={u.fullName} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                  {u.fullName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-sm text-foreground">{u.fullName}</p>
                                <p className="text-xs text-muted">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-xs font-bold text-foreground">Joined {new Date().toLocaleDateString()}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                              u.role === 'Chef' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => setDeleteData({ id: u.id, type: 'user' })}
                              className="p-2 text-muted hover:text-destructive hover:bg-red-50 rounded-lg transition-all"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'categories' && categories.map(c => (
                        <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="py-4 px-4 font-bold text-foreground">{c.name}</td>
                          <td className="py-4 px-4 text-xs text-muted">{c.id}</td>
                          <td className="py-4 px-4 text-xs">Active</td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => setDeleteData({ id: c.id, type: 'category' })}
                              className="p-2 text-muted hover:text-destructive hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Category"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteData?.type}`}
        message={
          deleteData?.type === 'recipe' ? "Are you sure you want to delete this recipe? This action cannot be undone and will remove all associated reviews." :
          deleteData?.type === 'user' ? "Are you sure you want to delete this user? This action cannot be undone." :
          "Are you sure you want to delete this category?"
        }
        confirmText="Delete Forever"
      />
    </div>
  );
}
