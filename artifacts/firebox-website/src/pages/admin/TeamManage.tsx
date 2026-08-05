import React from 'react';
import { useListTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember } from '@workspace/api-client-react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { FilePickerInput } from '../../components/admin/FilePickerInput';

export default function TeamManage() {
  const queryClient = useQueryClient();
  const { data: members = [], isLoading } = useListTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState({
    name: '', role: '', bio: '', avatarUrl: '',
    linkedinUrl: '', githubUrl: '', twitterUrl: '', sortOrder: 0,
  });

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', avatarUrl: '', linkedinUrl: '', githubUrl: '', twitterUrl: '', sortOrder: 0 });
    setEditingId(null);
  };

  const handleOpenEdit = (m: any) => {
    setFormData({
      name: m.name, role: m.role || '', bio: m.bio || '',
      avatarUrl: m.avatarUrl || '', linkedinUrl: m.linkedinUrl || '',
      githubUrl: m.githubUrl || '', twitterUrl: m.twitterUrl || '',
      sortOrder: m.sortOrder || 0,
    });
    setEditingId(m.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invalidate = () => { queryClient.invalidateQueries({ queryKey: ['listTeamMembers'] }); setIsModalOpen(false); };
    if (editingId) {
      updateMember.mutate({ id: editingId, data: formData }, { onSuccess: invalidate });
    } else {
      createMember.mutate({ data: formData }, { onSuccess: invalidate });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Remove this team member?')) return;
    deleteMember.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listTeamMembers'] }) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-purple-600 text-foreground font-bold rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors">
          <Plus size={18} /> Add Member
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(members as any[]).map((m: any) => (
            <div key={m.id} className="bg-muted/40 border border-border rounded-md p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {m.avatarUrl ? (
                  <img src={m.avatarUrl} alt={m.name} className="w-12 h-12 rounded-md object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold text-lg">
                    {m.name?.[0]}
                  </div>
                )}
                <div>
                  <div className="font-bold">{m.name}</div>
                  <div className="text-sm text-muted-foreground">{m.role}</div>
                </div>
              </div>
              {m.bio && <p className="text-sm text-muted-foreground line-clamp-2">{m.bio}</p>}
              <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                <button onClick={() => handleOpenEdit(m)} className="flex-1 py-1.5 text-sm rounded-lg bg-muted/40 hover:bg-muted/60 flex items-center justify-center gap-1 text-blue-400"><Edit2 size={14} /> Edit</button>
                <button onClick={() => handleDelete(m.id)} className="flex-1 py-1.5 text-sm rounded-lg bg-muted/40 hover:bg-muted/60 flex items-center justify-center gap-1 text-red-400"><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
          {(members as any[]).length === 0 && <div className="col-span-full p-8 text-center text-muted-foreground/70">No team members yet.</div>}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-border rounded-md p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Member' : 'Add Team Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/60 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: 'Name', required: true },
                { key: 'role', label: 'Role / Title' },
                { key: 'linkedinUrl', label: 'LinkedIn URL' },
                { key: 'githubUrl', label: 'GitHub URL' },
                { key: 'twitterUrl', label: 'Twitter / X URL' },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm text-muted-foreground mb-1">{label}</label>
                  <input value={(formData as any)[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} required={required} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-purple-500" />
                </div>
              ))}
              <FilePickerInput label="Avatar Photo" value={formData.avatarUrl} onChange={url => setFormData(p => ({ ...p, avatarUrl: url }))} accept="image/*" previewType="image" />
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Bio</label>
                <textarea rows={3} value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Sort Order</label>
                <input type="number" value={formData.sortOrder} onChange={e => setFormData(p => ({ ...p, sortOrder: Number(e.target.value) }))} className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground outline-none focus:border-purple-500" />
              </div>
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
