import { useState } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '../services/reviewService';

export default function ReviewForm({ recipeId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setSubmitMsg('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    setSubmitMsg('');
    try {
      const rv = await reviewService.create(recipeId, { rating, comment });
      setRating(0);
      setComment('');
      setSubmitMsg('Review submitted successfully!');
      if (onReviewAdded) {
        onReviewAdded(rv);
      }
    } catch (err) {
      setSubmitMsg('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm space-y-6">
      <h3 className="text-xl font-bold">Write a Review</h3>
      <form onSubmit={handleReview} className="space-y-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="transition-transform active:scale-90"
            >
              <Star
                size={28}
                className={`${
                  n <= rating ? 'fill-amber-400 text-amber-400' : 'text-border'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        <textarea
          className="w-full p-4 bg-secondary rounded-2xl border-none text-foreground placeholder:text-subtle focus:ring-2 focus:ring-primary/20 min-h-[120px]"
          placeholder="Share your experience cooking this recipe..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {submitMsg && (
          <p
            className={`text-sm font-medium ${
              submitMsg.includes('Error') || submitMsg.includes('Please')
                ? 'text-destructive'
                : 'text-emerald-600'
            }`}
          >
            {submitMsg}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary px-10 py-3 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Post Review'}
        </button>
      </form>
    </div>
  );
}
