import React from 'react';
import { useListTutorials, useCreateTutorial, useUpdateTutorial, useDeleteTutorial } from '@workspace/api-client-react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function TutorialsManage() {
  const queryClient = useQueryClient();
  const { data: tutorials = [], isLoading } = useListTutorials();
  const createTutorial = useCreateTutorial();
  const updateTutorial = useUpdateTutorial();
  const deleteTutorial = useDeleteTutorial();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: '', description: '', category: '', thumbnailUrl: '',
    videoUrl: '', youtubeEmbedUrl: '', duration: '', difficulty: 'beginner',
    published: true,
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', category: '', thumbnailUrl: '', videoUrl: '', youtubeEmbedUrl: '', duration: '', difficulty: 'beginner', published: true });
    setEditingId(null);
  };

  const handleOpenEdit = (t: any) => {
    setFormData({
      title: t.title, description: t.description || '', category: t.category || '',
      thumbnailUrl: t.thumbnailUrl || '', videoUrl: t.videoUrl || '',
      youtubeEmbedUrl: t.youtubeEmbedUrl || '', duration: t.duration || '',
      difficulty: t.difficulty || 'beginner', published: t.published,
    });
    setEditingId(t.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invalidate = () => { queryClient.invalidateQueries({ queryKey: ['listTutorials'] }); setIsModalOpen(false); };
    if (editingId) {
      updateTutorial.mutate({ id: editingId, data: formData }, { onSuccess: invalidate });
    } else {
      createTutorial.mutate({ data: formData }, { onSuccess: invalidate });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this tutorial?')) return;
    deleteTutorial.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listTutorials'] }) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Tutorials</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-purple-600 text-foreground font-bold rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors">
          <Plus size={18} /> Add Tutorial
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-muted/40 border border-border rounded-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/40 border-b border-border text-sm text-muted-foreground">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(tutorials as any[]).map((t: any) => (
                <tr key={t.id} className="hover:bg-muted/40">
                  <td className="p-4 font-medium">{t.title}</td>
                  <td className="p-4 text-muted-foreground">{t.category}</td>
                  <td className="p-4 text-muted-foreground capitalize">{t.difficulty}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-md ${t.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {t.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenEdit(t)} className="p-2 hover:bg-muted/60 rounded-lg transition-colors text-blue-400"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-muted/60 rounded-lg transition-colors text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(tutorials as any[]).length === 0 && <div className="p-8 text-center text-muted-foreground/70">No tutorials yet. Add your first tutorial.</div>}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-border rounded-md p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Tutorial' : 'Add Tutorial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/60 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'title', label: 'Title', required: true },
                { key: 'category', label: 'Category' },
                { key: 'thumbnailUrl', label: 'Thumbnail URL' },
                { key: 'videoUrl', label: 'Video URL' },
                { key: 'youtubeEmbedUrl', label: 'YouTube Embed URL' },
                { key: 'duration', label: 'Duration (e.g. 15 min)' },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm text-muted-foreground mb-1">{label}</label>
                  <input
                    value={(formData as any)[key]}
                    onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                    required={required}
                    className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-purple-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Difficulty</label>
                <select value={formData.difficulty} onChange={e => setFormData(p => ({ ...p, difficulty: e.target.value }))} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-purple-500">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.published} onChange={e => setFormData(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4" />
                <span className="text-sm text-foreground/80">Published</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-bold transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
