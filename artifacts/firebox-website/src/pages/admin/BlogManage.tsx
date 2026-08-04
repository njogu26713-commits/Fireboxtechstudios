import React from 'react';
import { useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from '@workspace/api-client-react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function BlogManage() {
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useListBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: '', content: '', excerpt: '', category: '', 
    featuredImageUrl: '', published: true, authorName: '', tags: ''
  });

  const resetForm = () => {
    setFormData({ title: '', content: '', excerpt: '', category: '', featuredImageUrl: '', published: true, authorName: '', tags: '' });
    setEditingId(null);
  };

  const handleOpenEdit = (p: any) => {
    setFormData({
      title: p.title, content: p.content, excerpt: p.excerpt || '', category: p.category,
      featuredImageUrl: p.featuredImageUrl || '', published: p.published,
      authorName: p.authorName || '', tags: p.tags || ''
    });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePost.mutate({ id: editingId, data: formData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['listBlogPosts'] }); setIsModalOpen(false); }
      });
    } else {
      createPost.mutate({ data: formData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['listBlogPosts'] }); setIsModalOpen(false); }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Manage Blog</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg flex items-center gap-2">
          <Plus size={18} /> Add Post
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10 text-sm">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={5} className="p-8 text-center text-white/50">Loading...</td></tr> : 
             posts.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-white/50">No posts.</td></tr> :
             posts.map(p => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="p-4 font-medium">{p.title}</td>
                <td className="p-4 text-sm text-white/60">{p.category}</td>
                <td className="p-4 text-sm text-white/60">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{p.published ? <span className="text-green-400 text-xs font-bold">Published</span> : <span className="text-yellow-400 text-xs font-bold">Draft</span>}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleOpenEdit(p)} className="p-2 bg-white/10 hover:bg-white/20 rounded"><Edit2 size={16}/></button>
                  <button onClick={() => confirm('Delete post?') && deletePost.mutate({id:p.id},{onSuccess:()=>queryClient.invalidateQueries({queryKey:['listBlogPosts']})})} className="p-2 bg-destructive/20 text-destructive rounded"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs mb-1">Title</label><input required value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm" /></div>
                <div><label className="block text-xs mb-1">Category</label><input required value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm" /></div>
              </div>
              <div><label className="block text-xs mb-1">Excerpt</label><textarea value={formData.excerpt} onChange={e=>setFormData({...formData,excerpt:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm resize-none"></textarea></div>
              <div><label className="block text-xs mb-1">Content (HTML)</label><textarea required rows={10} value={formData.content} onChange={e=>setFormData({...formData,content:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm font-mono resize-none"></textarea></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs mb-1">Image URL</label><input value={formData.featuredImageUrl} onChange={e=>setFormData({...formData,featuredImageUrl:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm" /></div>
                <div><label className="block text-xs mb-1">Author Name</label><input value={formData.authorName} onChange={e=>setFormData({...formData,authorName:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm" /></div>
                <div><label className="block text-xs mb-1">Tags (csv)</label><input value={formData.tags} onChange={e=>setFormData({...formData,tags:e.target.value})} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm" /></div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.published} onChange={e=>setFormData({...formData,published:e.target.checked})} /> Published</label>
              <div className="flex justify-end pt-4"><button type="submit" className="px-6 py-2 bg-green-500 text-white font-bold rounded">Save Post</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
