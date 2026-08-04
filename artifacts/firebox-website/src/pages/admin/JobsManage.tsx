import React from 'react';
import { useListJobs, useCreateJob, useUpdateJob, useDeleteJob } from '@workspace/api-client-react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function JobsManage() {
  const queryClient = useQueryClient();
  const { data: jobs = [], isLoading } = useListJobs();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: '', department: '', type: 'full-time', location: '',
    description: '', requirements: '', salaryRange: '', applicationUrl: '', active: true,
  });

  const resetForm = () => {
    setFormData({ title: '', department: '', type: 'full-time', location: '', description: '', requirements: '', salaryRange: '', applicationUrl: '', active: true });
    setEditingId(null);
  };

  const handleOpenEdit = (j: any) => {
    setFormData({
      title: j.title, department: j.department || '', type: j.type || 'full-time',
      location: j.location || '', description: j.description || '',
      requirements: j.requirements || '', salaryRange: j.salaryRange || '',
      applicationUrl: j.applicationUrl || '', active: j.active !== false,
    });
    setEditingId(j.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invalidate = () => { queryClient.invalidateQueries({ queryKey: ['listJobs'] }); setIsModalOpen(false); };
    if (editingId) {
      updateJob.mutate({ id: editingId, data: formData }, { onSuccess: invalidate });
    } else {
      createJob.mutate({ data: formData }, { onSuccess: invalidate });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    deleteJob.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listJobs'] }) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Job Postings</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors">
          <Plus size={18} /> Add Job
        </button>
      </div>

      {isLoading ? (
        <div className="text-white/60">Loading...</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10 text-sm text-white/60">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Department</th>
                <th className="p-4">Type</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(jobs as any[]).map((j: any) => (
                <tr key={j.id} className="hover:bg-white/5">
                  <td className="p-4 font-medium">{j.title}</td>
                  <td className="p-4 text-white/60">{j.department}</td>
                  <td className="p-4 text-white/60 capitalize">{j.type}</td>
                  <td className="p-4 text-white/60">{j.location}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${j.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {j.active ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenEdit(j)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(j.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(jobs as any[]).length === 0 && <div className="p-8 text-center text-white/40">No job postings yet.</div>}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Job' : 'Add Job Posting'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'title', label: 'Job Title', required: true },
                { key: 'department', label: 'Department' },
                { key: 'location', label: 'Location' },
                { key: 'salaryRange', label: 'Salary Range' },
                { key: 'applicationUrl', label: 'Application URL' },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm text-white/60 mb-1">{label}</label>
                  <input value={(formData as any)[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} required={required} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-white/60 mb-1">Employment Type</label>
                <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500">
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Requirements</label>
                <textarea rows={3} value={formData.requirements} onChange={e => setFormData(p => ({ ...p, requirements: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-purple-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.active} onChange={e => setFormData(p => ({ ...p, active: e.target.checked }))} className="w-4 h-4" />
                <span className="text-sm text-white/80">Active (visible to applicants)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
