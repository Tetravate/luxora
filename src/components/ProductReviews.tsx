import { useState, useMemo } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';

export function ProductReviews({ productId }: { productId: string }) {
  const { reviews, addReview, voteReviewHelpful } = useAdminStore();
  const { user, addToast, orders } = useStore();
  const location = useLocation();

  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [visibleCount, setVisibleCount] = useState(5);

  const productReviews = useMemo(() => 
    reviews.filter(r => r.productId === productId && r.status === 'Approved'),
    [reviews, productId]
  );

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  }, [productReviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    productReviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating as keyof typeof counts]++;
    });
    return counts;
  }, [productReviews]);

  const hasPurchased = useMemo(() => {
    if (!user?.isLoggedIn) return false;
    return orders.some(o => o.items.some(i => i.productId === productId || i.name.includes(productId))); // Loose check
  }, [user, orders, productId]);

  const hasReviewed = useMemo(() => {
    if (!user?.isLoggedIn) return false;
    return reviews.some(r => r.productId === productId && r.customerId === user.id);
  }, [user, reviews, productId]);

  const filteredReviews = useMemo(() => {
    let result = [...productReviews];
    if (filterRating) {
      result = result.filter(r => r.rating === filterRating);
    }
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'helpful') return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
      return 0;
    });
    return result;
  }, [productReviews, filterRating, sortBy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      addToast('Please select a star rating.', 'error');
      return;
    }
    if (comment.trim().length < 10) {
      addToast('Review must be at least 10 characters long.', 'error');
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      addReview({
        id: `rev-${Date.now()}`,
        productId,
        customerId: user?.id,
        customerName: user?.name || 'Anonymous',
        rating,
        title,
        comment,
        date: new Date().toISOString(),
        status: 'Approved', // Auto-approve for demo, in real world might be 'Pending'
        verifiedPurchase: hasPurchased,
        helpfulVotes: 0
      });
      setIsSubmitting(false);
      setIsWriting(false);
      setTitle('');
      setComment('');
      setRating(5);
      addToast('Review submitted successfully!', 'success');
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E7E3DC] p-6 lg:p-10 mb-16 shadow-xs">
      <h2 className="text-2xl font-serif font-bold text-[#111111] mb-8">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Summary and Action */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col items-start gap-2 pb-6 border-b border-[#E7E3DC]">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-serif font-bold text-[#111111]">{averageRating.toFixed(1)}</span>
              <div className="flex flex-col">
                <div className="flex text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={cn("fill-current", i < Math.round(averageRating) ? "text-amber-400" : "text-gray-200")} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#777777]">Based on {productReviews.length} reviews</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingCounts[star as keyof typeof ratingCounts];
              const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
              return (
                <button 
                  key={star} 
                  onClick={() => setFilterRating(filterRating === star ? null : star)}
                  className="flex items-center gap-3 group text-xs text-[#777777] hover:text-[#111111]"
                >
                  <span className="w-10 font-medium whitespace-nowrap">{star} stars</span>
                  <div className="flex-1 h-2.5 bg-[#F7F5F1] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                  <span className="w-8 text-right font-medium">{Math.round(percentage)}%</span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#E7E3DC]">
            <h3 className="font-bold text-[#111111] text-sm mb-2">Review this product</h3>
            <p className="text-xs text-[#777777] mb-4">Share your thoughts with other customers</p>
            {user?.isLoggedIn ? (
              hasReviewed ? (
                <div className="bg-[#F7F5F1] p-3 rounded-xl text-xs text-[#777777] flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-600" /> You've already reviewed this item
                </div>
              ) : (
                <button 
                  onClick={() => setIsWriting(!isWriting)}
                  className="w-full py-3 border-2 border-[#111111] text-[#111111] text-xs font-bold rounded-xl hover:bg-[#111111] hover:text-white transition-all"
                >
                  Write a Review
                </button>
              )
            ) : (
              <Link 
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                className="w-full block text-center py-3 border border-[#E7E3DC] text-[#111111] text-xs font-bold rounded-xl hover:bg-[#F7F5F1] transition-all"
              >
                Sign in to write a review
              </Link>
            )}
          </div>
        </div>

        {/* Right: Reviews List & Form */}
        <div className="lg:col-span-8">
          
          {/* Write Review Form */}
          {isWriting && (
            <div className="mb-8 p-6 bg-[#F7F5F1] rounded-2xl border border-[#E7E3DC] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#111111] text-base">Write your review</h3>
                <button onClick={() => setIsWriting(false)} className="text-[#777777] hover:text-[#111111] text-xs font-semibold">Cancel</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-2">Overall Rating *</label>
                  <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          className={cn(
                            "transition-colors", 
                            star <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1">Add a headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="What's most important to know?"
                    className="w-full px-4 py-2.5 bg-white rounded-xl text-xs border border-[#E7E3DC] focus:border-[#111111] focus:outline-none"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1">Add a written review *</label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="What did you like or dislike? What did you use this product for?"
                    className="w-full px-4 py-3 bg-white rounded-xl text-xs border border-[#E7E3DC] focus:border-[#111111] focus:outline-none min-h-[120px] resize-y"
                    required
                    minLength={10}
                  />
                </div>
                
                {!hasPurchased && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded-xl text-xs">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>You haven't purchased this item from us. Your review will not receive a "Verified Purchase" badge.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0 || comment.length < 10}
                  className="px-6 py-3 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* Filters and List */}
          {productReviews.length > 0 ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#111111] text-sm">
                  {filterRating ? `Showing ${filterRating}-star reviews` : 'Top Reviews'}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#777777]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs bg-[#F7F5F1] border border-[#E7E3DC] rounded-lg px-2 py-1.5 font-medium text-[#111111] focus:outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="helpful">Most helpful</option>
                    <option value="highest">Highest rated</option>
                    <option value="lowest">Lowest rated</option>
                  </select>
                </div>
              </div>

              {filterRating && filteredReviews.length === 0 && (
                <p className="text-sm text-[#777777] py-8 text-center">No reviews found matching {filterRating} stars.</p>
              )}

              <div className="space-y-6">
                {filteredReviews.slice(0, visibleCount).map((review) => (
                  <div key={review.id} className="pb-6 border-b border-[#E7E3DC] last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E7E3DC] flex items-center justify-center text-xs font-bold text-[#111111]">
                          {review.customerName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#111111] text-sm">{review.customerName}</span>
                            {review.verifiedPurchase && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                <CheckCircle size={10} /> Verified
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#777777]">
                            {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={cn("fill-current", i < review.rating ? "text-amber-400" : "text-gray-200")} />
                        ))}
                      </div>
                      {review.title && <span className="font-bold text-[#111111] text-sm">{review.title}</span>}
                    </div>

                    <p className="text-sm text-[#171717] leading-relaxed mb-4">{review.comment}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-[#777777] font-medium">{review.helpfulVotes || 0} people found this helpful</span>
                      <button 
                        onClick={() => voteReviewHelpful(review.id)}
                        className="flex items-center gap-1.5 font-bold text-[#777777] hover:text-[#111111] px-3 py-1.5 rounded-lg border border-[#E7E3DC] hover:bg-[#F7F5F1] transition-colors"
                      >
                        <ThumbsUp size={14} /> Helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < filteredReviews.length && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 5)}
                  className="w-full py-3 border border-[#E7E3DC] text-[#111111] text-xs font-bold rounded-xl hover:bg-[#F7F5F1] transition-colors mt-2"
                >
                  Load More Reviews
                </button>
              )}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-[#F7F5F1] rounded-2xl border border-dashed border-[#E7E3DC]">
              <MessageSquare size={32} className="text-[#777777] mb-3" />
              <h3 className="font-bold text-[#111111] text-base mb-1">No reviews yet</h3>
              <p className="text-xs text-[#777777] max-w-sm mb-4">Be the first to share your thoughts about this product. Your review helps others make informed decisions.</p>
              {!user?.isLoggedIn && (
                <Link to="/login" className="text-xs font-bold text-[#111111] hover:underline">
                  Sign in to write a review
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
