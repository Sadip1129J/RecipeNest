// Recipes.jsx — Refactored to pure Tailwind CSS
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Utensils, X } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { categoryService } from '../services/categoryService';
import { bookmarkService } from '../services/bookmarkService';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'All');

  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    categoryService.getAll().then(data => setCategories(data)).catch(() => {});
    if (localStorage.getItem('token')) {
      bookmarkService.getMine().then(data => setSavedIds(data.map(r => r.id))).catch(() => {});
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = activeCategory === 'All' ? '' : activeCategory;
    recipeService.getAll(search, q).then(data => {
      setRecipes(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, activeCategory]);

  const onBookmarkChange = () => {
    if (localStorage.getItem('token')) {
      bookmarkService.getMine().then(data => setSavedIds(data.map(r => r.id))).catch(() => {});
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    updateParams(val, activeCategory);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    updateParams(search, cat);
  };

  const updateParams = (q, cat) => {
    const params = {};
    if (q) params.q = q;
    if (cat !== 'All') params.cat = cat;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('All');
    setSearchParams({});
  };

  return (
    <div className="bg-background min-h-screen">
      {/* ─── Hero Section ─── */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="container py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            <Utensils size={14} /> Our Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
            Explore <span className="text-primary italic">Exquisite</span> Recipes
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Discover a curated selection of gourmet dishes from world-class chefs. Filter by category or search by ingredient to find your next masterpiece.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ─── Sidebar Filters ─── */}
          <aside className="w-full lg:w-64 space-y-8 sticky top-24">
            {/* Search Box */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-subtle uppercase tracking-widest px-2">Quick Search</label>
              <SearchBar value={search} onChange={handleSearch} placeholder="Title, ingredient..." />
            </div>

            {/* Category Filter */}
            <CategoryFilter 
              categories={categories} 
              activeCategory={activeCategory} 
              onCategoryClick={handleCategoryClick} 
            />

            {/* Clear All */}
            {(search || activeCategory !== 'All') && (
              <button 
                onClick={clearFilters}
                className="w-full py-3 text-xs font-bold text-destructive hover:bg-red-50 rounded-xl transition-colors border border-dashed border-red-200"
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* ─── Main Recipe Feed ─── */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold font-serif">
                {activeCategory !== 'All' ? `${activeCategory} Recipes` : 'Latest Creations'}
              </h2>
              <span className="text-xs font-bold text-subtle bg-secondary px-3 py-1 rounded-full uppercase">
                {recipes.length} Results
              </span>
            </div>

            {loading ? (
              <Loading />
            ) : recipes.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-border">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-subtle">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">No matching recipes</h3>
                <p className="text-muted mb-8">We couldn't find any recipes matching your current filters.</p>
                <button onClick={clearFilters} className="btn btn-primary px-10">Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {recipes.map(r => (
                  <RecipeCard 
                    key={r.id} 
                    recipe={r} 
                    savedIds={savedIds} 
                    onBookmarkChange={onBookmarkChange} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
