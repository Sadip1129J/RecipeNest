// UserDashboard.jsx — Refactored to pure Tailwind CSS
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Heart, 
  Clock, 
  Star, 
  Trash2, 
  UtensilsCrossed,
  ArrowRight,
  Settings,
  ChefHat
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { bookmarkService } from '../services/bookmarkService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location, loading]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [bks, rvs] = await Promise.all([
        bookmarkService.getMine(),
        reviewService.getMine()
      ]);
      setBookmarks(bks);
      setReviews(rvs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      await bookmarkService.remove(id);
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading && bookmarks.length === 0) return <Loading />;

  return (
    <div className="admin-layout">
      <Sidebar role={user?.role} />
      
      <main className="admin-main">
        {/* Header */}
        <header className="admin-topbar">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-serif">Personal Dashboard</h1>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Happy Cooking, {user?.fullName}</p>
          </div>
          <div className="ml-auto">
            <Link to="/profile-settings" className="btn btn-outline btn-sm gap-2">
              <Settings size={14} /> Account Settings
            </Link>
          </div>
        </header>

        <div className="admin-content">
          {/* Welcome Card */}
          <div className="relative overflow-hidden bg-foreground rounded-[2.5rem] p-10 text-white mb-10">
            <div className="relative z-10 space-y-4 max-w-lg">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight">
                Your Culinary Collection is Growing!
              </h2>
              <p className="text-subtle text-sm leading-relaxed">
                You have saved {bookmarks.length} hand-crafted recipes and shared your feedback on {reviews.length} dishes. Keep exploring new tastes!
              </p>
              <div className="pt-4">
                <Link to="/recipes" className="btn btn-primary px-8 py-3.5 inline-flex">
                  Discover More Recipes <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent opacity-50" />
            <ChefHat size={300} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Saved Recipes Section */}
            <div className="space-y-6" id="saved-recipes">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                  <Heart size={20} className="text-primary fill-primary" /> Saved Recipes
                </h3>
                <Link to="/recipes" className="text-xs font-bold text-primary hover:underline">Explore all</Link>
              </div>

              <div className="space-y-4">
                {bookmarks.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-border border-dashed rounded-[2rem]">
                    <Heart size={40} className="mx-auto text-border mb-4" />
                    <p className="text-subtle font-medium">Your collection is empty.</p>
                  </div>
                ) : (
                  bookmarks.map(recipe => (
                    <div key={recipe.id} className="group bg-white p-4 border border-border rounded-3xl flex items-center gap-4 hover:shadow-lg transition-all duration-300">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                        <img src={recipe.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{recipe.categoryName}</p>
                        <h4 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{recipe.title}</h4>
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-subtle uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Clock size={12} /> {recipe.prepTime}</span>
                          <span className="flex items-center gap-1"><ChefHat size={12} /> {recipe.chefName}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={`/recipes/${recipe.id}`} className="p-2.5 bg-secondary text-muted hover:bg-primary hover:text-white rounded-xl transition-all" title="View Recipe">
                          <ArrowRight size={18} />
                        </Link>
                        <button 
                          onClick={() => handleRemoveBookmark(recipe.id)}
                          className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all" 
                          title="Remove Bookmark"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Reviews Section */}
            <div className="space-y-6" id="my-reviews">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                  <UtensilsCrossed size={20} className="text-primary" /> My Reviews
                </h3>
                <span className="text-xs font-bold text-subtle">{reviews.length} Total</span>
              </div>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-border border-dashed rounded-[2rem]">
                    <UtensilsCrossed size={40} className="mx-auto text-border mb-4" />
                    <p className="text-subtle font-medium">No reviews written yet.</p>
                  </div>
                ) : (
                  reviews.map(rv => (
                    <div key={rv.id} className="bg-white p-6 border border-border rounded-[2rem] space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-subtle uppercase tracking-widest mb-1">Reviewed on {new Date(rv.createdAt).toLocaleDateString()}</p>
                          <h4 className="font-bold text-foreground line-clamp-1">{rv.recipeTitle}</h4>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(n => (
                            <Star key={n} size={12} className={n <= rv.rating ? 'fill-amber-400 text-amber-400' : 'text-border'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted italic leading-relaxed line-clamp-2">"{rv.comment}"</p>
                      <Link to={`/recipes/${rv.recipeId}`} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        View Recipe <ArrowRight size={12} />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
