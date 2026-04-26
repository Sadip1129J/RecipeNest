// ChefDashboard.jsx — Refactored to pure Tailwind CSS
import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  BarChart3, 
  ArrowUpRight, 
  Star,
  UtensilsCrossed,
  Filter,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import RecipeForm from '../components/RecipeForm';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

export default function ChefDashboard() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form/Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [deletingRecipeId, setDeletingRecipeId] = useState(null);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getMine();
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!deletingRecipeId) return;
    try {
      await recipeService.delete(deletingRecipeId);
      setRecipes(recipes.filter(r => r.id !== deletingRecipeId));
    } catch (err) { console.error(err); }
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
      fetchMyRecipes();
    } catch (err) { console.error(err); }
  };

  const stats = [
    { label: 'My Recipes', value: recipes.length, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Views', value: '1,240', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Rating', value: recipes.length > 0 ? (recipes.reduce((acc, r) => acc + (r.ratingAverage || 0), 0) / recipes.length).toFixed(1) : '4.8', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Reviews', value: recipes.reduce((acc, r) => acc + (r.ratingCount || 0), 0), icon: UtensilsCrossed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  if (loading && recipes.length === 0) return <Loading />;

  return (
    <div className="admin-layout">
      <Sidebar role="Chef" />
      
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-serif">Chef Portfolio Manager</h1>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Welcome back, Chef {user?.fullName}</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
              <input 
                type="text" placeholder="Search my recipes..."
                className="pl-10 pr-4 py-2 bg-secondary rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/profile-settings" className="p-2.5 bg-secondary text-muted rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
              <Edit3 size={20} />
            </Link>
          </div>
        </header>

        <div className="admin-content">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((s, i) => (
              <div key={i} className="admin-stat-card group hover:scale-[1.02] transition-all">
                <div className={`p-4 ${s.bg} ${s.color} rounded-2xl group-hover:rotate-6 transition-transform`}>
                  <s.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-subtle uppercase tracking-widest">{s.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-foreground">{s.value}</span>
                    {i === 0 && <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5"><ArrowUpRight size={10} /> +2</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Resource View */}
          <div className="bg-white border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-8 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-white to-secondary/30">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-bold text-foreground">My Culinary Portfolio</h2>
                <p className="text-sm text-muted">Manage your shared recipes and track their performance.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => { setEditingRecipe(null); setIsFormOpen(true); }}
                  className="flex-1 sm:flex-none btn btn-primary py-3.5 px-8 gap-2 shadow-xl shadow-primary/20"
                >
                  <Plus size={18} /> Create New Recipe
                </button>
              </div>
            </div>

            {/* Table / Form Content */}
            <div className="p-8">
              {isFormOpen ? (
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                      {editingRecipe ? <Edit3 size={24} /> : <Plus size={24} />}
                    </div>
                    <h2 className="text-2xl font-serif font-bold">
                      {editingRecipe ? 'Refine Your Masterpiece' : 'Share a New Creation'}
                    </h2>
                  </div>
                  <RecipeForm 
                    initialData={editingRecipe}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setIsFormOpen(false); setEditingRecipe(null); }}
                  />
                </div>
              ) : recipes.length === 0 ? (
                <div className="py-20 text-center space-y-6">
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto text-subtle">
                    <BookOpen size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-serif">No recipes published yet</h3>
                    <p className="text-muted max-w-sm mx-auto leading-relaxed">
                      Start your journey by sharing your first culinary creation with the RecipeNest community.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsFormOpen(true)}
                    className="btn btn-outline px-8 py-3"
                  >
                    Add Your First Recipe
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recipes.map(r => (
                    <div key={r.id} className="group relative bg-white border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="aspect-video overflow-hidden">
                        <img src={r.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold font-serif text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{r.title}</h3>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                            <Star size={14} className="fill-amber-500" />
                            {r.ratingAverage?.toFixed(1) || '4.5'}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-subtle uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Clock size={12} /> {r.prepTime}</span>
                          <span className="flex items-center gap-1">Published: {new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => { setEditingRecipe(r); setIsFormOpen(true); }}
                            className="flex-1 btn bg-secondary text-muted hover:bg-primary hover:text-white transition-all text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => setDeletingRecipeId(r.id)}
                            className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <Link to={`/recipes/${r.id}`} className="p-2.5 bg-secondary text-muted hover:bg-foreground hover:text-white rounded-xl transition-all" title="View Public">
                            <Eye size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal 
        isOpen={!!deletingRecipeId}
        onClose={() => setDeletingRecipeId(null)}
        onConfirm={handleDeleteRecipe}
        title="Remove Recipe"
        message="Are you sure you want to remove this recipe from your portfolio? This will permanently delete the recipe and all its reviews."
        confirmText="Confirm Delete"
      />
    </div>
  );
}
