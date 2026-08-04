import React, { useState } from 'react';
import { useListServices, useCreateService, useUpdateService, useDeleteService } from '@workspace/api-client-react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function ServicesManage() {
  const queryClient = useQueryClient();
  const { data: services = [], isLoading } = useListServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', published: true, featured: false,
    icon: '', bannerUrl: '', galleryUrls: '', pricing: '', buttonText: '', destinationUrl: ''
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', category: '', published: true, featured: false, icon: '', bannerUrl: '', galleryUrls: '', pricing: '', buttonText: '', destinationUrl: '' });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: any) => {
    setFormData({
      title: service.title, description: service.description, category: service.category,
      published: service.published, featured: service.featured,
      icon: service.icon || '', bannerUrl: service.bannerUrl || '',
      galleryUrls: service.galleryUrls || '', pricing: service.pricing || '',
      buttonText: service.buttonText || '', destinationUrl: service.destinationUrl || ''
    });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateService.mutate({ id: editingId, data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listServices'] });
          setIsModalOpen(false);
        }
      });
    } else {
      createService.mutate({ data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listServices'] });
          setIsModalOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listServices'] })
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Manage Services</h1>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-primary text-background font-bold rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/40 border-b border-border text-sm">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No services found.</td></tr>
            ) : (
              services.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4 font-medium">{s.title}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-muted/60 rounded text-xs">{s.category}</span></td>
                  <td className="p-4">
                    {s.published ? <span className="text-green-400 text-xs font-bold">Published</span> : <span className="text-yellow-400 text-xs font-bold">Draft</span>}
                  </td>
                  <td className="p-4">{s.featured ? 'Yes' : 'No'}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenEdit(s)} className="p-2 bg-muted/60 hover:bg-white/20 rounded"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 bg-destructive/20 text-destructive hover:bg-destructive hover:text-foreground rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/60 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1">Title</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Category</label>
                  <input required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-1">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none resize-none"></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1">Banner Image URL</label>
                  <input value={formData.bannerUrl} onChange={e=>setFormData({...formData, bannerUrl: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Gallery URLs (comma separated)</label>
                  <input value={formData.galleryUrls} onChange={e=>setFormData({...formData, galleryUrls: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1">Pricing (e.g. $5k+)</label>
                  <input value={formData.pricing} onChange={e=>setFormData({...formData, pricing: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Button Text</label>
                  <input value={formData.buttonText} onChange={e=>setFormData({...formData, buttonText: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Destination URL (External)</label>
                  <input value={formData.destinationUrl} onChange={e=>setFormData({...formData, destinationUrl: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.published} onChange={e=>setFormData({...formData, published: e.target.checked})} className="rounded text-primary focus:ring-primary" />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e=>setFormData({...formData, featured: e.target.checked})} className="rounded text-primary focus:ring-primary" />
                  <span>Featured Service</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted/60 rounded-lg font-medium hover:bg-white/20">Cancel</button>
                <button type="submit" disabled={createService.isPending || updateService.isPending} className="px-6 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90">
                  {editingId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
