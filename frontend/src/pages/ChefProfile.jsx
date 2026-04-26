// ChefProfile.jsx — Refactored to pure Tailwind CSS
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Mail, Star, Globe, Camera, MessageCircle, Award, ChefHat } from 'lucide-react';
import { chefService } from '../services/chefService';
import { recipeService } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';

export default function ChefProfile() {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      chefService.getById(id),
      recipeService.getByChef(id),
    ]).then(([c, r]) => {
      setChef(c);
      setRecipes(r);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!chef) return <div className="container py-20 text-center"><p className="text-xl text-muted">Chef not found.</p></div>;

  const stats = [
    { label: 'Recipes', value: recipes.length, icon: ChefHat },
    { label: 'Avg Rating', value: recipes.length > 0 ? (recipes.reduce((acc, r) => acc + (r.ratingAverage || 0), 0) / recipes.length).toFixed(1) : '4.8', icon: Star },
    { label: 'Experience', value: '12+ Years', icon: Award },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* ─── Hero Header ─── */}
      <div className="bg-white border-b border-border shadow-sm pt-8 pb-12">
        <div className="container">
          <Link to="/chefs" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-10 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to All Chefs
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: Avatar & Stats */}
            <div className="flex flex-col items-center lg:items-start space-y-8 flex-shrink-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all" />
                <div className="relative w-48 h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden z-10">
                  <img
                    src={chef.profileImageUrl || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400'}
                    alt={chef.displayName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400'; }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 lg:gap-8 w-full">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-1.5 text-primary mb-1">
                      <Icon size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                    </div>
                    <p className="text-xl font-serif font-black text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Bio & Socials */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-serif font-bold text-foreground">
                  Chef {chef.displayName}
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  {chef.location && (
                    <div className="flex items-center gap-2 text-muted font-medium bg-secondary px-4 py-1.5 rounded-full text-sm">
                      <MapPin size={16} className="text-primary" />
                      {chef.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted font-medium bg-secondary px-4 py-1.5 rounded-full text-sm">
                    <Mail size={16} className="text-primary" />
                    Verified Chef
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-2xl mx-auto lg:mx-0">
                <p className="text-lg text-muted leading-relaxed">
                  {chef.bio || "A passionate culinary visionary dedicated to bringing exceptional flavours and creative techniques to every plate. Specialized in modern gastronomy and traditional techniques."}
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {chef.specialties?.map(s => (
                  <span key={s} className="px-5 py-2 bg-primary/5 text-primary border border-primary/10 rounded-xl text-sm font-bold">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 border-t border-border/50">
                <p className="text-xs text-subtle font-bold uppercase tracking-widest mr-2">Connect:</p>
                {[Camera, MessageCircle, Globe].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-secondary text-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                    <Icon size={18} />
                  </a>
                ))}
                <button className="btn btn-primary px-8 py-3 ml-auto hidden lg:flex shadow-lg shadow-primary/20">
                  Follow Chef
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Recipe Portfolio ─── */}
      <div className="container py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold text-sm uppercase tracking-widest">
              <ChefHat size={16} /> Recipe Portfolio
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold">Creations by {chef.displayName}</h2>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-muted">{recipes.length} Recipes Published</span>
            <div className="h-px w-20 bg-border hidden sm:block" />
          </div>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-border border-dashed">
            <ChefHat size={48} className="mx-auto text-border mb-4" />
            <p className="text-xl text-subtle font-serif italic">No recipes published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map(r => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
