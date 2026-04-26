// RecipeCard.jsx — Refactored to pure Tailwind CSS
import { Link } from 'react-router-dom';
import { Clock, Star, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookmarkService } from '../services/bookmarkService';
import { useState, useEffect } from 'react';

export default function RecipeCard({ recipe, savedIds = [], onBookmarkChange }) {
  const { isLoggedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync state with props
  useEffect(() => {
    setIsSaved(savedIds.includes(recipe.id));
  }, [savedIds, recipe.id]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { alert('Please log in to bookmark recipes.'); return; }
    setSaving(true);
    try {
      if (isSaved) {
        await bookmarkService.remove(recipe.id);
        setIsSaved(false);
      } else {
        await bookmarkService.add(recipe.id);
        setIsSaved(true);
      }
      onBookmarkChange?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image Wrap */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600'}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600'; }}
        />
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {recipe.ratingAverage?.toFixed(1) || '4.5'}
        </div>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-foreground px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
          <Clock size={12} className="text-primary" />
          {recipe.prepTime || '30 min'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-serif text-lg font-bold leading-tight mb-4 flex-1">
          <Link to={`/recipes/${recipe.id}`} className="hover:text-primary transition-colors line-clamp-2">
            {recipe.title}
          </Link>
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
              <img 
                src={`https://i.pravatar.cc/150?u=${recipe.chefName}`} 
                alt={recipe.chefName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="text-xs font-medium text-muted">by {recipe.chefName}</span>
          </div>
          
          <button
            onClick={handleBookmark}
            disabled={saving}
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
          >
            <Bookmark 
              size={18} 
              className={`transition-all ${isSaved ? 'fill-primary text-primary scale-110' : 'text-subtle'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
