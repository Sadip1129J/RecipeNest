// Home.jsx — Refactored to pure Tailwind CSS
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChefHat, Star, ArrowRight, BookOpen, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { bookmarkService } from '../services/bookmarkService';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';

/* ── Animated Counter Hook ── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
          }, 16);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ── Stat Item ── */
function StatItem({ value, suffix = '', label }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="flex flex-col" ref={ref}>
      <span className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.2em] font-bold mt-1.5">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const [heroSearch, setHeroSearch] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    recipeService.getAll().then(data => {
      setRecipes(data.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));

    if (localStorage.getItem('token')) {
      bookmarkService.getMine().then(data => setSavedIds(data.map(r => r.id))).catch(() => {});
    }
  }, []);

  const onBookmarkChange = () => {
    if (localStorage.getItem('token')) {
      bookmarkService.getMine().then(data => setSavedIds(data.map(r => r.id))).catch(() => {});
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) navigate(`/recipes?q=${encodeURIComponent(heroSearch.trim())}`);
  };

  const categories = [
    { icon: '🍛', label: 'Curry', color: 'bg-amber-100 text-amber-600' },
    { icon: '🥟', label: 'Dumplings', color: 'bg-orange-100 text-orange-600' },
    { icon: '🍜', label: 'Noodles', color: 'bg-red-100 text-red-600' },
    { icon: '🥗', label: 'Salads', color: 'bg-emerald-100 text-emerald-600' },
    { icon: '🍰', label: 'Desserts', color: 'bg-pink-100 text-pink-600' },
    { icon: '🍲', label: 'Soups', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-24 overflow-hidden bg-white">
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600"
            alt="Fine cooking background"
            className="w-full h-full object-cover object-center opacity-40 sm:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/10 sm:via-white/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 animate-bounce-subtle">
              <Sparkles size={16} />
              <span>Nepal's #1 Recipe Platform</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-serif font-black text-foreground mb-6 leading-[1.1]">
              Discover the Art of
              <span className="block text-primary italic">Fine Cooking</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted mb-10 max-w-xl leading-relaxed">
              Connect with world-class chefs, explore curated recipes, and bring
              gourmet flavours to your kitchen.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleHeroSearch} className="relative max-w-xl mb-12">
              <div className="group relative flex items-center bg-white rounded-2xl shadow-xl shadow-primary/5 border border-border p-2 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
                <Search size={22} className="absolute left-6 text-subtle" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, chefs..."
                  className="w-full pl-14 pr-4 py-4 text-base bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder:text-subtle"
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                />
                <button type="submit" className="hidden sm:flex btn btn-primary px-8 py-3.5">
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/recipes" className="btn btn-primary px-8 py-4 shadow-lg shadow-primary/20">
                <BookOpen size={20} /> Explore Recipes
              </Link>
              <Link to="/register" className="btn btn-outline px-8 py-4 bg-white/50 backdrop-blur-sm">
                <ChefHat size={20} /> Join as Chef
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 sm:gap-16 mt-16 pt-12 border-t border-border">
              <StatItem value={1200} suffix="+" label="Recipes" />
              <StatItem value={350} suffix="+" label="Expert Chefs" />
              <StatItem value={50} suffix="k+" label="Happy Cooks" />
              <StatItem value={4} suffix=".9" label="Avg Rating" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                <Flame size={16} /> Popular Categories
              </span>
              <h2 className="text-4xl font-serif font-bold">Browse by Category</h2>
            </div>
            <Link to="/recipes" className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              View all <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map(cat => (
              <Link
                key={cat.label}
                to={`/recipes?q=${encodeURIComponent(cat.label)}`}
                className="group flex flex-col items-center justify-center p-8 bg-white border border-border rounded-[2rem] hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 mb-4 rounded-2xl ${cat.color.split(' ')[0]} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-24 bg-white border-y border-border">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="flex items-center justify-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
              <Star size={16} /> Why RecipeNest
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold">Everything You Need to Cook Like a Pro</h2>
            <p className="text-muted text-lg">
              From discovering recipes to connecting with expert chefs — we've got it all.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ChefHat,
                title: 'Expert Chefs',
                text: 'Learn from talented chefs who share their secrets, techniques, and signature dishes.',
                bg: 'bg-orange-50',
                iconColor: 'text-orange-600',
              },
              {
                icon: BookOpen,
                title: 'Curated Recipes',
                text: 'Handpicked recipes tested and perfected for your kitchen, from quick meals to elaborate feasts.',
                bg: 'bg-blue-50',
                iconColor: 'text-blue-600',
              },
              {
                icon: Star,
                title: 'Easy to Follow',
                text: 'Step-by-step instructions with photos, prep times, and serving guides — cook with confidence.',
                bg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
              },
            ].map(({ icon: Icon, title, text, bg, iconColor }) => (
              <div key={title} className="group p-10 bg-white border border-border rounded-[2.5rem] hover:border-primary hover:shadow-2xl transition-all duration-500">
                <div className={`w-16 h-16 mb-8 ${bg} ${iconColor} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{title}</h3>
                <p className="text-muted leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TRENDING RECIPES ═══════════ */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                <TrendingUp size={16} /> Trending Now
              </span>
              <h2 className="text-4xl font-serif font-bold">Recipes Everyone's Loving</h2>
            </div>
            <Link to="/recipes" className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              View all recipes <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? <Loading /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </section>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="relative overflow-hidden bg-foreground rounded-[3rem] p-12 sm:p-20 text-center">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight">
                Ready to Share Your Recipes?
              </h2>
              <p className="text-subtle text-lg sm:text-xl">
                Join our community of passionate chefs and food lovers. Share your
                culinary creations and inspire cooks around the world.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
                <Link to="/register" className="btn btn-primary px-10 py-5 text-lg shadow-xl shadow-primary/20">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <Link to="/chefs" className="btn btn-outline text-white border-white/20 hover:bg-white/10 px-10 py-5 text-lg">
                  Meet Our Chefs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
