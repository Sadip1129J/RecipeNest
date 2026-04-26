// RecipeDetails.jsx — Refactored to pure Tailwind CSS
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowLeft, Bookmark, CheckCircle2, ChevronRight, Share2, Printer } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { reviewService } from '../services/reviewService';
import { bookmarkService } from '../services/bookmarkService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ReviewForm from '../components/ReviewForm';

export default function RecipeDetails() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      recipeService.getById(id),
      reviewService.getByRecipe(id),
      isLoggedIn ? bookmarkService.getMine() : Promise.resolve([]),
    ]).then(([r, rv, bks]) => {
      setRecipe(r);
      setReviews(rv);
      if (isLoggedIn) {
        setIsSaved(bks.some(b => b.id === id));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, isLoggedIn]);

  const handleBookmark = async () => {
    if (!isLoggedIn) { alert('Please log in to bookmark.'); return; }
    try {
      if (isSaved) {
        await bookmarkService.remove(id);
        setIsSaved(false);
      } else {
        await bookmarkService.add(id);
        setIsSaved(true);
      }
    } catch (err) { console.error(err); }
  };

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
    recipeService.getById(id).then(setRecipe);
  };

  if (loading) return <Loading />;
  if (!recipe) return <div className="container py-20 text-center"><p className="text-xl text-muted">Recipe not found.</p></div>;

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* ─── Header Section ─── */}
      <div className="bg-white border-b border-border shadow-sm mb-8">
        <div className="container py-6">
          <Link to="/recipes" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Recipes
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                  {recipe.categoryName}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                  <Star size={16} className="fill-amber-500" />
                  {recipe.ratingAverage?.toFixed(1) || '4.5'}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                {recipe.title}
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-border overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${recipe.chefName}`} alt={recipe.chefName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-subtle font-medium uppercase tracking-wider">Created By</p>
                  <Link to={`/chefs/${recipe.chefId}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                    Chef {recipe.chefName}
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleBookmark}
                className={`btn gap-2 ${isSaved ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20' : 'bg-white border border-border text-foreground hover:bg-secondary'}`}
              >
                <Bookmark size={18} className={isSaved ? 'fill-white' : ''} />
                {isSaved ? 'Saved' : 'Save Recipe'}
              </button>
              <button className="p-3 bg-secondary text-muted rounded-full hover:text-foreground transition-colors" title="Share">
                <Share2 size={18} />
              </button>
              <button className="p-3 bg-secondary text-muted rounded-full hover:text-foreground transition-colors" title="Print">
                <Printer size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* ─── Main Content (2/3) ─── */}
          <div className="lg:col-span-2 space-y-12">
            {/* Hero Image */}
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200'}
                alt={recipe.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200'; }}
              />
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted leading-relaxed italic">
                "{recipe.description}"
              </p>
            </div>

            {/* Ingredients & Instructions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
              {/* Ingredients */}
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold border-b border-border pb-4 flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={24} />
                  Ingredients
                </h2>
                <ul className="space-y-4">
                  {recipe.ingredients?.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-foreground font-medium">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold border-b border-border pb-4 flex items-center gap-3">
                  <Clock className="text-primary" size={24} />
                  Instructions
                </h2>
                <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/50">
                  {recipe.instructions?.map((step, i) => (
                    <div key={i} className="relative pl-10">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-md z-10">
                        {i + 1}
                      </div>
                      <p className="text-muted leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-12 space-y-10 border-t border-border">
              <div className="flex items-end justify-between">
                <h2 className="text-3xl font-serif font-bold text-foreground">
                  Reviews & Ratings <span className="text-subtle font-sans font-normal text-lg">({reviews.length})</span>
                </h2>
              </div>

              {/* Review Input */}
              {isLoggedIn ? (
                <ReviewForm recipeId={id} onReviewAdded={handleReviewAdded} />
              ) : (
                <div className="bg-primary/5 p-8 rounded-3xl text-center space-y-3">
                  <p className="text-muted font-medium">Want to share your experience?</p>
                  <Link to="/login" className="btn btn-primary px-8">Please login to write a review.</Link>
                </div>
              )}

              {/* Review List */}
              <div className="space-y-6">
                {reviews.map(rv => (
                  <div key={rv.id} className="p-8 bg-white border border-border rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                          {rv.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground leading-none">{rv.userName}</p>
                          <p className="text-xs text-subtle mt-1">{new Date(rv.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} size={14} className={n <= rv.rating ? 'fill-amber-400 text-amber-400' : 'text-border'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted leading-relaxed">{rv.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-subtle italic">No reviews yet. Be the first to cook and rate this dish!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Sidebar Info (1/3) ─── */}
          <div className="space-y-6 sticky top-24">
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm space-y-8">
              <h3 className="text-xl font-serif font-bold">Quick Details</h3>
              <div className="space-y-6">
                {[
                  { icon: Clock, label: 'Prep Time', value: recipe.prepTime },
                  { icon: Users, label: 'Servings', value: `${recipe.servings} People` },
                  { icon: Star, label: 'Rating', value: `${recipe.ratingAverage?.toFixed(1) || '4.5'} stars` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                        <Icon size={20} />
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags card */}
            {recipe.tags?.length > 0 && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
                <h3 className="text-xl font-serif font-bold mb-6">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map(t => (
                    <span key={t} className="px-4 py-1.5 bg-secondary text-muted rounded-full text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* CTA card */}
            <div className="bg-foreground p-8 rounded-[2.5rem] text-white space-y-6">
              <h3 className="text-xl font-serif font-bold leading-tight">Love this recipe?</h3>
              <p className="text-subtle text-sm">Save it to your profile or share it with your friends and family.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleBookmark}
                  className="w-full btn btn-primary py-4"
                >
                  {isSaved ? 'Recipe Saved' : 'Bookmark Recipe'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
