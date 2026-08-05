import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Film, Image as ImageIcon, FileText, Pin, Eye, EyeOff, Upload, Link } from 'lucide-react';
import { useUpload } from '@workspace/object-storage-web';

interface Update {
  id: string;
  title?: string | null;
  caption: string;
  mediaType: 'video' | 'photo' | 'text';
  mediaUrl?: string | null;
  thumbnail?: string | null;
  published: boolean;
  pinned: boolean;
  createdAt: string;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
}

type FormData = {
  title: string;
  caption: string;
  mediaType: 'video' | 'photo' | 'text';
  mediaUrl: string;
  thumbnail: string;
  published: boolean;
  pinned: boolean;
  buttonLabel: string;
  buttonUrl: string;
};

const defaultForm: FormData = {
  title: '', caption: '', mediaType: 'text', mediaUrl: '',
  thumbnail: '', published: true, pinned: false,
  buttonLabel: '', buttonUrl: '',
};

const BASE = '/api';

function useUpdates() {
  return useQuery<Update[]>({
    queryKey: ['updates-admin'],
    queryFn: () => fetch(`${BASE}/updates`).then(r => r.json()),
  });
}

function useCreateUpdate() {
  return useMutation({
    mutationFn: (data: Partial<FormData>) =>
      fetch(`${BASE}/updates`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  });
}

function useUpdateUpdate() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormData> }) =>
      fetch(`${BASE}/updates/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  });
}

function useDeleteUpdate() {
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`${BASE}/updates/${id}`, { method: 'DELETE' }),
  });
}

const mediaTypeIcon = { video: Film, photo: ImageIcon, text: FileText };
const mediaTypeLabel = { video: 'Video', photo: 'Photo', text: 'Text Post' };
const mediaTypeColor = { video: 'text-purple-400', photo: 'text-blue-400', text: 'text-green-400' };

// ── Media upload widget ───────────────────────────────────────────────────────
function MediaUploadField({
  mediaType,
  value,
  onChange,
}: {
  mediaType: 'video' | 'photo';
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [fileName, setFileName] = useState('');

  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (response: { objectPath: string; metadata?: { name?: string } }) => {
      const servingUrl = `/api/storage${response.objectPath}`;
      onChange(servingUrl);
      setFileName(response.metadata?.name ?? '');
    },
  });

  const accept = mediaType === 'video' ? 'video/*' : 'image/*';
  const label = mediaType === 'video' ? 'Video' : 'Image';

  return (
    <div>
      <label className="block text-xs font-medium mb-2 text-muted-foreground">{label} Media</label>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-3 bg-muted/30 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            tab === 'upload' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload size={12} /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            tab === 'url' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Link size={12} /> Paste URL
        </button>
      </div>

      {tab === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFileName(file.name);
              await uploadFile(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-2 p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/60 hover:bg-primary/5 transition-all disabled:opacity-60 cursor-pointer"
          >
            <Upload size={24} className={isUploading ? 'text-primary animate-pulse' : 'text-muted-foreground'} />
            <span className="text-sm text-muted-foreground">
              {isUploading
                ? `Uploading… ${progress}%`
                : fileName
                ? fileName
                : `Click to choose a ${label.toLowerCase()} file`}
            </span>
            {!isUploading && (
              <span className="text-xs text-muted-foreground/60">
                {mediaType === 'video' ? 'MP4, WebM, MOV…' : 'JPG, PNG, WebP, GIF…'}
              </span>
            )}
          </button>
          {value && value.startsWith('/api/storage') && (
            <p className="text-xs text-green-400 mt-1.5">✓ Uploaded — saved to storage</p>
          )}
        </div>
      ) : (
        <input
          value={value}
          onChange={(e) => { onChange(e.target.value); setFileName(''); }}
          placeholder={mediaType === 'video' ? 'https://… .mp4 or YouTube embed' : 'https://… .jpg/.png'}
          className="w-full bg-muted/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      )}
    </div>
  );
}

// ── Local video preview (no database, blob URL only) ─────────────────────────
function LocalVideoPreview() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track the active blob URL in a ref so revocation never touches it during
  // React Strict Mode's effect cleanup cycle (which would invalidate the URL
  // before the <video> element has a chance to load it).
  const activeBlobRef = useRef<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // Only revoke on final unmount — never on re-renders or dep changes.
  useEffect(() => {
    return () => {
      if (activeBlobRef.current) URL.revokeObjectURL(activeBlobRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke the previous URL now (explicit, safe — not inside an effect).
    if (activeBlobRef.current) URL.revokeObjectURL(activeBlobRef.current);
    const url = URL.createObjectURL(file);
    activeBlobRef.current = url;
    setBlobUrl(url);
    setFileName(file.name);
    e.target.value = '';
  };

  const handleClear = () => {
    if (activeBlobRef.current) URL.revokeObjectURL(activeBlobRef.current);
    activeBlobRef.current = null;
    setBlobUrl(null);
    setFileName('');
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Film size={18} className="text-purple-400" />
            Local Video Preview
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick an MP4 file to preview it instantly — nothing is saved or uploaded.
          </p>
        </div>
        {blobUrl && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 rounded-lg transition-colors"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Drop zone / file picker */}
      {!blobUrl && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,video/mp4"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-3 p-10 border-2 border-dashed border-border rounded-xl hover:border-purple-400/60 hover:bg-purple-500/5 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Upload size={26} className="text-purple-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to choose an MP4 file</p>
              <p className="text-xs text-muted-foreground mt-0.5">Played locally in your browser — no upload required</p>
            </div>
          </button>
        </>
      )}

      {/* Video player */}
      {blobUrl && (
        <div className="space-y-3">
          <video
            key={blobUrl}
            src={blobUrl}
            controls
            controlsList="nodownload"
            className="w-full rounded-xl bg-black"
            style={{ maxHeight: '480px' }}
          >
            Your browser does not support HTML5 video.
          </video>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="truncate max-w-[70%]">📄 {fileName}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:underline shrink-0"
            >
              Choose another file
            </button>
          </div>
          {/* Hidden input so user can swap files */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp4,video/mp4"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}

export default function UpdatesManage() {
  const qc = useQueryClient();
  const { data: updates = [], isLoading } = useUpdates();
  const createUpdate = useCreateUpdate();
  const updateUpdate = useUpdateUpdate();
  const deleteUpdate = useDeleteUpdate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['updates-admin'] });
    qc.invalidateQueries({ queryKey: ['updates-public'] });
  };

  const resetForm = () => { setForm(defaultForm); setEditingId(null); };

  const openNew = () => { resetForm(); setIsModalOpen(true); };

  const openEdit = (u: Update) => {
    setForm({
      title: u.title || '',
      caption: u.caption,
      mediaType: u.mediaType,
      mediaUrl: u.mediaUrl || '',
      thumbnail: u.thumbnail || '',
      published: u.published,
      pinned: u.pinned,
      buttonLabel: u.buttonLabel || '',
      buttonUrl: u.buttonUrl || '',
    });
    setEditingId(u.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<FormData> = {
      ...form,
      title: (form.title || null) as any,
      mediaUrl: (form.mediaUrl || null) as any,
      thumbnail: (form.thumbnail || null) as any,
      buttonLabel: (form.buttonLabel || null) as any,
      buttonUrl: (form.buttonUrl || null) as any,
    };
    if (editingId) {
      updateUpdate.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { invalidate(); setIsModalOpen(false); },
      });
    } else {
      createUpdate.mutate(payload, {
        onSuccess: () => { invalidate(); setIsModalOpen(false); },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this update?')) return;
    deleteUpdate.mutate(id, { onSuccess: invalidate });
  };

  const handleTogglePublish = (u: Update) => {
    updateUpdate.mutate({ id: u.id, data: { published: !u.published } }, { onSuccess: invalidate });
  };

  const set = (k: keyof FormData, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Updates</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your TikTok-style feed — videos, photos & text posts</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {(['video', 'photo', 'text'] as const).map(type => {
          const Icon = mediaTypeIcon[type];
          const count = updates.filter(u => u.mediaType === type).length;
          return (
            <div key={type} className="glass-panel rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
                <Icon size={20} className={mediaTypeColor[type]} />
              </div>
              <div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-muted-foreground">{mediaTypeLabel[type]}s</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Local video preview */}
      <LocalVideoPreview />

      {/* Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/40 border-b border-border text-sm">
            <tr>
              <th className="p-4">Type</th>
              <th className="p-4">Caption</th>
              <th className="p-4">Media URL</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : updates.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Film size={32} className="opacity-40" />
                    <span>No updates yet — click <strong>New Post</strong> to add your first one.</span>
                  </div>
                </td>
              </tr>
            ) : (
              updates.map(u => {
                const Icon = mediaTypeIcon[u.mediaType];
                return (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={mediaTypeColor[u.mediaType]} />
                        <span className="text-sm">{mediaTypeLabel[u.mediaType]}</span>
                        {u.pinned && <Pin size={12} className="text-primary" />}
                      </div>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      {u.title && <div className="font-medium text-sm truncate">{u.title}</div>}
                      <div className="text-xs text-muted-foreground truncate">{u.caption}</div>
                    </td>
                    <td className="p-4 max-w-[160px]">
                      {u.mediaUrl ? (
                        <a href={u.mediaUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate block">
                          {u.mediaUrl}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {u.published
                        ? <span className="text-green-400 text-xs font-bold">Published</span>
                        : <span className="text-yellow-400 text-xs font-bold">Draft</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(u)}
                          title={u.published ? 'Unpublish' : 'Publish'}
                          className="p-2 bg-muted/60 hover:bg-white/20 rounded transition-colors"
                        >
                          {u.published ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 bg-muted/60 hover:bg-white/20 rounded transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Post' : 'New Update'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted/60 rounded-md">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Media type selector */}
              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">Post Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['video', 'photo', 'text'] as const).map(type => {
                    const Icon = mediaTypeIcon[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => set('mediaType', type)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          form.mediaType === type
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80'
                        }`}
                      >
                        <Icon size={22} />
                        <span className="text-sm font-medium">{mediaTypeLabel[type]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Title <span className="text-muted-foreground/60">(optional)</span></label>
                <input
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Short headline…"
                  className="w-full bg-muted/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">Caption / Text *</label>
                <textarea
                  required
                  rows={4}
                  value={form.caption}
                  onChange={e => set('caption', e.target.value)}
                  placeholder={form.mediaType === 'text' ? 'Write your post content here…' : 'Describe this update…'}
                  className="w-full bg-muted/40 border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Media upload/URL (video/photo only) */}
              {form.mediaType !== 'text' && (
                <MediaUploadField
                  mediaType={form.mediaType}
                  value={form.mediaUrl}
                  onChange={(url) => set('mediaUrl', url)}
                />
              )}

              {/* Thumbnail (video only) */}
              {form.mediaType === 'video' && (
                <div>
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">Thumbnail URL <span className="text-muted-foreground/60">(optional poster image)</span></label>
                  <input
                    value={form.thumbnail}
                    onChange={e => set('thumbnail', e.target.value)}
                    placeholder="https://… .jpg"
                    className="w-full bg-muted/40 border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              )}

              {/* Call-to-action button */}
              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
                <label className="block text-xs font-semibold text-foreground">
                  Call-to-Action Button <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Button label</label>
                    <input
                      value={form.buttonLabel}
                      onChange={e => set('buttonLabel', e.target.value)}
                      placeholder="e.g. Learn More"
                      className="w-full bg-muted/40 border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Button URL</label>
                    <input
                      value={form.buttonUrl}
                      onChange={e => set('buttonUrl', e.target.value)}
                      placeholder="https://…"
                      className="w-full bg-muted/40 border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Both fields required to show the button. Leave empty to hide it.</p>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input type="checkbox" checked={form.pinned} onChange={e => set('pinned', e.target.checked)} className="w-4 h-4 rounded accent-primary" />
                  <Pin size={14} className="text-primary" /> Pin to top
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={createUpdate.isPending || updateUpdate.isPending}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {createUpdate.isPending || updateUpdate.isPending ? 'Saving…' : editingId ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
