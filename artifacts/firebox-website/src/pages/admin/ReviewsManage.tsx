import React from 'react';
import { useListReviews, useUpdateReview, useDeleteReview } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2, Star, MessageSquare } from 'lucide-react';

export default function ReviewsManage() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useListReviews();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const handleUpdate = (id: string, updates: any) => {
    updateReview.mutate({ id, data: updates }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listReviews'] })
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete review?')) {
      deleteReview.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listReviews'] })
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Moderate Reviews</h1>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? <div className="p-8">Loading...</div> : 
         reviews.length === 0 ? <div className="p-8 glass-panel text-white/50">No reviews yet.</div> :
         reviews.map(r => (
           <div key={r.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6">
             <div className="flex-1">
               <div className="flex items-center gap-3 mb-2">
                 <div className="flex text-yellow-400">
                   {[1,2,3,4,5].map(s => <Star key={s} fill={s <= r.rating ? "currentColor" : "none"} size={16} />)}
                 </div>
                 <span className="font-bold">{r.name}</span>
                 <span className="text-xs px-2 py-0.5 rounded bg-white/10">{r.status}</span>
                 {r.featured && <span className="text-xs px-2 py-0.5 rounded bg-secondary/20 text-secondary">Featured</span>}
               </div>
               <p className="text-white/80 italic mb-4">"{r.testimonial}"</p>
               
               {/* Admin Reply Form simple */}
               <div className="bg-black/20 p-3 rounded-lg flex items-start gap-2">
                 <MessageSquare size={16} className="mt-2 text-white/40" />
                 <textarea 
                   placeholder="Add public admin reply..." 
                   className="w-full bg-transparent text-sm resize-none outline-none text-white/80" 
                   rows={2}
                   defaultValue={r.adminReply || ''}
                   onBlur={(e) => {
                     if (e.target.value !== (r.adminReply || '')) {
                       handleUpdate(r.id, { adminReply: e.target.value });
                     }
                   }}
                 />
               </div>
             </div>

             <div className="flex md:flex-col gap-2 shrink-0">
               {r.status === 'pending' && (
                 <>
                   <button onClick={() => handleUpdate(r.id, { status: 'approved' })} className="px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded text-sm flex items-center justify-center gap-1"><Check size={16}/> Approve</button>
                   <button onClick={() => handleUpdate(r.id, { status: 'rejected' })} className="px-3 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white rounded text-sm flex items-center justify-center gap-1"><X size={16}/> Reject</button>
                 </>
               )}
               {r.status === 'approved' && (
                 <button onClick={() => handleUpdate(r.id, { featured: !r.featured })} className="px-3 py-2 bg-secondary/20 text-secondary hover:bg-secondary hover:text-white rounded text-sm flex items-center justify-center gap-1"><Star size={16}/> {r.featured ? 'Unfeature' : 'Feature'}</button>
               )}
               <button onClick={() => handleDelete(r.id)} className="px-3 py-2 bg-destructive/20 text-destructive hover:bg-destructive hover:text-white rounded text-sm flex items-center justify-center gap-1 mt-auto"><Trash2 size={16}/> Delete</button>
             </div>
           </div>
         ))
        }
      </div>
    </div>
  );
}
