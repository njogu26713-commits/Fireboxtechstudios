import React, { useState } from 'react';
import { useListPublicReviews, useCreateReview } from '@workspace/api-client-react';
import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function Reviews() {
  const { data: reviewsData, isLoading } = useListPublicReviews();
  const createReview = useCreateReview();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    testimonial: ''
  });

  const reviews = reviewsData?.reviews || [];
  const average = reviewsData?.averageRating || 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReview.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Review Submitted", description: "Thank you! Your review is pending approval." });
        setFormData({ name: '', email: '', rating: 5, testimonial: '' });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to submit review.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 pb-24">
      <div className="max-w-4xl mx-auto text-center mb-16 pt-12">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Client <span className="text-primary">Love</span></h1>
        <p className="text-xl text-muted-foreground mb-8">See what our clients say about working with FireboxTechStudios.</p>
        
        <div className="inline-flex flex-col items-center justify-center p-6 glass-panel rounded-3xl">
          <div className="text-5xl font-display font-bold text-foreground mb-2">{average.toFixed(1)}</div>
          <div className="flex gap-1 text-primary mb-2">
            {[1,2,3,4,5].map(s => <Star key={s} fill={s <= Math.round(average) ? "currentColor" : "none"} size={24} />)}
          </div>
          <div className="text-sm font-mono text-muted-foreground">Based on {reviewsData?.totalCount || 0} reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="glass-panel h-40 rounded-3xl animate-pulse" />)
          ) : reviews.length > 0 ? (
            reviews.map((review, i) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-3xl relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg">{review.name}</h3>
                  <div className="flex gap-1 text-primary">
                    {[1,2,3,4,5].map(s => <Star key={s} fill={s <= review.rating ? "currentColor" : "none"} size={16} />)}
                  </div>
                </div>
                <p className="text-foreground/80 leading-relaxed italic">"{review.testimonial}"</p>
                
                {review.adminReply && (
                  <div className="mt-6 pt-4 border-t border-border flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <MessageSquare size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary mb-1">Firebox Team</div>
                      <p className="text-sm text-muted-foreground">{review.adminReply}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12">No reviews yet. Be the first!</div>
          )}
        </div>

        {/* Submit Form */}
        <div>
          <div className="glass-panel-glow p-8 rounded-3xl sticky top-24">
            <h3 className="text-2xl font-display font-bold mb-6">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Email (private)</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button type="button" key={s} onClick={() => setFormData({...formData, rating: s})} className={`text-2xl ${s <= formData.rating ? 'text-primary' : 'text-foreground/20'}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Review</label>
                <textarea required rows={4} value={formData.testimonial} onChange={e => setFormData({...formData, testimonial: e.target.value})} className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground resize-none"></textarea>
              </div>
              <button disabled={createReview.isPending} type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                {createReview.isPending ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
