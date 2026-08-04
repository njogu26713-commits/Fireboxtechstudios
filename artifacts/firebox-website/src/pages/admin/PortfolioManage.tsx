import React, { useState } from 'react';
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@workspace/api-client-react';
import { Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function PortfolioManage() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useListProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', technologies: '', screenshotUrls: '', 
    videoUrl: '', githubUrl: '', liveDemoUrl: '', published: true, featured: false
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', category: '', technologies: '', screenshotUrls: '', videoUrl: '', githubUrl: '', liveDemoUrl: '', published: true, featured: false });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: any) => {
    setFormData({
      title: proj.title, description: proj.description, category: proj.category || '',
      technologies: proj.technologies || '', screenshotUrls: proj.screenshotUrls || '',
      videoUrl: proj.videoUrl || '', githubUrl: proj.githubUrl || '', liveDemoUrl: proj.liveDemoUrl || '',
      published: proj.published, featured: proj.featured
    });
    setEditingId(proj.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProject.mutate({ id: editingId, data: formData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['listProjects'] }); setIsModalOpen(false); }
      });
    } else {
      createProject.mutate({ data: formData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['listProjects'] }); setIsModalOpen(false); }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) {
      deleteProject.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listProjects'] })
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Manage Portfolio</h1>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-secondary text-white font-bold rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/40 border-b border-border text-sm">
            <tr>
              <th className="p-4">Project</th>
              <th className="p-4">Category</th>
              <th className="p-4">Links</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No projects found.</td></tr>
            ) : (
              projects.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-muted/60 rounded text-xs">{p.category || 'None'}</span></td>
                  <td className="p-4 flex gap-2">
                    {p.liveDemoUrl && <a href={p.liveDemoUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300"><ExternalLink size={16}/></a>}
                  </td>
                  <td className="p-4">
                    {p.published ? <span className="text-green-400 text-xs font-bold">Published</span> : <span className="text-yellow-400 text-xs font-bold">Draft</span>}
                    {p.featured && <span className="ml-2 text-secondary text-xs font-bold">Featured</span>}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(p)} className="p-2 bg-muted/60 hover:bg-white/20 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 bg-destructive/20 text-destructive hover:bg-destructive hover:text-foreground rounded"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/60 rounded-md"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1">Title</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-secondary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Category</label>
                  <input value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-secondary focus:outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-1">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-secondary focus:outline-none resize-none"></textarea>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Technologies (comma separated)</label>
                <input value={formData.technologies} onChange={e=>setFormData({...formData, technologies: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-secondary focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-muted-foreground mb-1">Screenshot URLs (comma separated)</label>
                <input value={formData.screenshotUrls} onChange={e=>setFormData({...formData, screenshotUrls: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-secondary focus:outline-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1">Video URL</label>
                  <input value={formData.videoUrl} onChange={e=>setFormData({...formData, videoUrl: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-secondary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Live Demo URL</label>
                  <input value={formData.liveDemoUrl} onChange={e=>setFormData({...formData, liveDemoUrl: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-secondary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">GitHub URL</label>
                  <input value={formData.githubUrl} onChange={e=>setFormData({...formData, githubUrl: e.target.value})} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-white focus:border-secondary focus:outline-none" />
                </div>
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.published} onChange={e=>setFormData({...formData, published: e.target.checked})} className="rounded text-secondary focus:ring-secondary" />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e=>setFormData({...formData, featured: e.target.checked})} className="rounded text-secondary focus:ring-secondary" />
                  <span>Featured Project</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted/60 rounded-lg font-medium hover:bg-white/20">Cancel</button>
                <button type="submit" disabled={createProject.isPending || updateProject.isPending} className="px-6 py-2 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90">
                  {editingId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
