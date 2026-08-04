import React from 'react';
import {
  useListFaqItems, useCreateFaqItem, useUpdateFaqItem, useDeleteFaqItem,
  useListTrustedClients, useCreateTrustedClient, useUpdateTrustedClient, useDeleteTrustedClient,
} from '@workspace/api-client-react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function FaqManage() {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading: faqLoading } = useListFaqItems();
  const { data: clients = [], isLoading: clientLoading } = useListTrustedClients();

  const createFaq = useCreateFaqItem();
  const updateFaq = useUpdateFaqItem();
  const deleteFaq = useDeleteFaqItem();
  const createClient = useCreateTrustedClient();
  const updateClient = useUpdateTrustedClient();
  const deleteClient = useDeleteTrustedClient();

  const [tab, setTab] = React.useState<'faq' | 'clients'>('faq');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [faqForm, setFaqForm] = React.useState({ question: '', answer: '', category: '', sortOrder: 0 });
  const [clientForm, setClientForm] = React.useState({ name: '', logoUrl: '', websiteUrl: '', sortOrder: 0 });

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invalidate = () => { queryClient.invalidateQueries({ queryKey: ['listFaqItems'] }); setIsModalOpen(false); };
    if (editingId) {
      updateFaq.mutate({ id: editingId, data: faqForm }, { onSuccess: invalidate });
    } else {
      createFaq.mutate({ data: faqForm }, { onSuccess: invalidate });
    }
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invalidate = () => { queryClient.invalidateQueries({ queryKey: ['listTrustedClients'] }); setIsModalOpen(false); };
    if (editingId) {
      updateClient.mutate({ id: editingId, data: clientForm }, { onSuccess: invalidate });
    } else {
      createClient.mutate({ data: clientForm }, { onSuccess: invalidate });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">FAQ & Trusted Clients</h1>

      <div className="flex gap-2 border-b border-border pb-4">
        {(['faq', 'clients'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-purple-600 text-white' : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'}`}>
            {t === 'faq' ? 'FAQ Items' : 'Trusted Clients'}
          </button>
        ))}
      </div>

      {tab === 'faq' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setFaqForm({ question: '', answer: '', category: '', sortOrder: 0 }); setEditingId(null); setIsModalOpen(true); }} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors">
              <Plus size={18} /> Add FAQ
            </button>
          </div>
          {faqLoading ? <div className="text-muted-foreground">Loading...</div> : (
            <div className="space-y-3">
              {(faqs as any[]).map((f: any) => (
                <div key={f.id} className="bg-muted/40 border border-border rounded-md p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-medium">{f.question}</div>
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{f.answer}</div>
                      {f.category && <span className="text-xs text-purple-400 mt-1 inline-block">{f.category}</span>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setFaqForm({ question: f.question, answer: f.answer, category: f.category || '', sortOrder: f.sortOrder || 0 }); setEditingId(f.id); setIsModalOpen(true); }} className="p-2 hover:bg-muted/60 rounded-lg text-blue-400"><Edit2 size={16} /></button>
                      <button onClick={() => { if (!confirm('Delete FAQ?')) return; deleteFaq.mutate({ id: f.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listFaqItems'] }) }); }} className="p-2 hover:bg-muted/60 rounded-lg text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {(faqs as any[]).length === 0 && <div className="p-8 text-center text-muted-foreground/70">No FAQ items yet.</div>}
            </div>
          )}
        </div>
      )}

      {tab === 'clients' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setClientForm({ name: '', logoUrl: '', websiteUrl: '', sortOrder: 0 }); setEditingId(null); setIsModalOpen(true); }} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors">
              <Plus size={18} /> Add Client
            </button>
          </div>
          {clientLoading ? <div className="text-muted-foreground">Loading...</div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(clients as any[]).map((c: any) => (
                <div key={c.id} className="bg-muted/40 border border-border rounded-md p-4 flex items-center gap-4">
                  {c.logoUrl && <img src={c.logoUrl} alt={c.name} className="w-12 h-12 object-contain rounded-lg bg-muted/40 p-1" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.name}</div>
                    {c.websiteUrl && <a href={c.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate block">{c.websiteUrl}</a>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setClientForm({ name: c.name, logoUrl: c.logoUrl || '', websiteUrl: c.websiteUrl || '', sortOrder: c.sortOrder || 0 }); setEditingId(c.id); setIsModalOpen(true); }} className="p-2 hover:bg-muted/60 rounded-lg text-blue-400"><Edit2 size={16} /></button>
                    <button onClick={() => { if (!confirm('Delete client?')) return; deleteClient.mutate({ id: c.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listTrustedClients'] }) }); }} className="p-2 hover:bg-muted/60 rounded-lg text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {(clients as any[]).length === 0 && <div className="col-span-full p-8 text-center text-muted-foreground/70">No trusted clients yet.</div>}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-border rounded-md p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} {tab === 'faq' ? 'FAQ Item' : 'Client'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/60 rounded-lg"><X size={18} /></button>
            </div>

            {tab === 'faq' ? (
              <form onSubmit={handleFaqSubmit} className="space-y-4">
                {[{ key: 'question', label: 'Question', required: true }, { key: 'category', label: 'Category' }].map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="block text-sm text-muted-foreground mb-1">{label}</label>
                    <input value={(faqForm as any)[key]} onChange={e => setFaqForm(p => ({ ...p, [key]: e.target.value }))} required={required} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Answer</label>
                  <textarea rows={4} value={faqForm.answer} onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))} required className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg bg-muted/40 hover:bg-muted/60">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-bold">Save</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleClientSubmit} className="space-y-4">
                {[{ key: 'name', label: 'Client Name', required: true }, { key: 'logoUrl', label: 'Logo URL' }, { key: 'websiteUrl', label: 'Website URL' }].map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="block text-sm text-muted-foreground mb-1">{label}</label>
                    <input value={(clientForm as any)[key]} onChange={e => setClientForm(p => ({ ...p, [key]: e.target.value }))} required={required} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                  </div>
                ))}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg bg-muted/40 hover:bg-muted/60">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-bold">Save</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
