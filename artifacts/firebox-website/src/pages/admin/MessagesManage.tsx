import React from 'react';
import { useListContactMessages, useUpdateContactMessage, useDeleteContactMessage, useListQuoteRequests, useUpdateQuoteRequest, useDeleteQuoteRequest } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Trash2, MailOpen } from 'lucide-react';

export default function MessagesManage() {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useListContactMessages();
  const updateMessage = useUpdateContactMessage();
  const deleteMessage = useDeleteContactMessage();

  const handleMarkRead = (id: string, read: boolean) => {
    updateMessage.mutate({ id, data: { read } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listContactMessages'] })
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete message?')) {
      deleteMessage.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listContactMessages'] })
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-3xl font-display font-bold">Contact Messages</h1>

      <div className="space-y-4">
        {isLoading ? <div className="p-8">Loading...</div> : 
         messages.length === 0 ? <div className="p-8 glass-panel rounded-md text-muted-foreground">No messages.</div> :
         messages.map(msg => (
           <div key={msg.id} className={`glass-panel p-6 rounded-md border-l-4 ${msg.read ? 'border-l-white/10 opacity-70' : 'border-l-primary'}`}>
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="font-bold text-lg">{msg.subject}</h3>
                 <div className="text-sm text-muted-foreground">From: {msg.name} ({msg.email}) • {msg.phone || 'No phone'}</div>
               </div>
               <div className="text-sm text-muted-foreground/70">{new Date(msg.createdAt).toLocaleString()}</div>
             </div>
             <p className="text-foreground/80 whitespace-pre-wrap mb-4 bg-black/20 p-4 rounded-lg">{msg.message}</p>
             <div className="flex justify-end gap-2">
               <button onClick={() => handleMarkRead(msg.id, !msg.read)} className="px-3 py-1.5 bg-muted/60 hover:bg-white/20 rounded text-sm flex items-center gap-1">
                 {msg.read ? 'Mark Unread' : <><Check size={14}/> Mark Read</>}
               </button>
               <button onClick={() => handleDelete(msg.id)} className="px-3 py-1.5 bg-destructive/20 text-destructive hover:bg-destructive hover:text-foreground rounded text-sm flex items-center gap-1">
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
