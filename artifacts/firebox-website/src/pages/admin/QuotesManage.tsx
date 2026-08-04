import React from 'react';
import { useListQuoteRequests, useUpdateQuoteRequest, useDeleteQuoteRequest } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

export default function QuotesManage() {
  const queryClient = useQueryClient();
  const { data: quotes = [], isLoading } = useListQuoteRequests();
  const updateQuote = useUpdateQuoteRequest();
  const deleteQuote = useDeleteQuoteRequest();

  const handleUpdateStatus = (id: string, status: string) => {
    updateQuote.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listQuoteRequests'] })
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete quote request?')) {
      deleteQuote.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listQuoteRequests'] })
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-3xl font-display font-bold">Quote Requests</h1>

      <div className="space-y-4">
        {isLoading ? <div className="p-8">Loading...</div> : 
         quotes.length === 0 ? <div className="p-8 glass-panel rounded-md text-muted-foreground">No requests.</div> :
         quotes.map(q => (
           <div key={q.id} className="glass-panel p-6 rounded-md border-l-4 border-l-secondary">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <div className="flex items-center gap-3 mb-1">
                   <h3 className="font-bold text-lg">{q.projectType}</h3>
                   <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-xs rounded-md">{q.budget || 'Any Budget'}</span>
                 </div>
                 <div className="text-sm text-muted-foreground">From: {q.name} ({q.email}) • {q.phone || 'No phone'}</div>
               </div>
               <div className="text-right">
                 <div className="text-sm text-muted-foreground/70 mb-2">{new Date(q.createdAt).toLocaleDateString()}</div>
                 <select 
                   value={q.status} 
                   onChange={(e) => handleUpdateStatus(q.id, e.target.value)}
                   className="bg-black/50 border border-border rounded px-2 py-1 text-sm outline-none"
                 >
                   <option value="pending">Pending</option>
                   <option value="contacted">Contacted</option>
                   <option value="rejected">Rejected</option>
                   <option value="approved">Approved/Won</option>
                 </select>
               </div>
             </div>
             <p className="text-foreground/80 whitespace-pre-wrap mb-4 bg-black/20 p-4 rounded-lg">{q.description}</p>
             <div className="flex justify-end">
               <button onClick={() => handleDelete(q.id)} className="px-3 py-1.5 bg-destructive/20 text-destructive hover:bg-destructive hover:text-foreground rounded text-sm flex items-center gap-1">
                 <Trash2 size={14}/> Delete
               </button>
             </div>
           </div>
         ))
        }
      </div>
    </div>
  );
}
