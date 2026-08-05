import React from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Pin, Film, ImageIcon, FileText, ArrowLeft, Share2, Check } from 'lucide-react';

interface Update {
  id: string;
  title?: string | null;
  caption: string;
  mediaType: 'video' | 'photo' | 'text';
  mediaUrl?: string | null;
  thumbnail?: string | null;
  pinned: boolean;
  createdAt: string;
}

function useUpdate(id: string) {
  return useQuery<Update>({
    queryKey: ['update', id],
    queryFn: () =>
      fetch(`/api/updates/${id}`).then((r) => {
        if (!r.ok) throw new Error('Update not found');
        return r.json();
      }),
    enabled: !!id,
  });
}

function ShareButton({ id }: { id: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/updates/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors"
      title="Copy share link"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Share2 size={13} />}
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}

export default function UpdatePost() {
  const { id } = useParams<{ id: string }>();

  const { data: update, isLoading, isError } = useUpdate(id ?? '');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (isError || !update) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white px-6">
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="font-bold text-xl text-gray-800">Post not found</h2>
          <p className="text-gray-500 text-sm">This update may have been removed or the link is incorrect.</p>
          <Link href="/updates" className="inline-block text-sm text-primary hover:underline">
            ← Back to Updates
          </Link>
        </div>
      </div>
    );
  }

  const typeIcon =
    update.mediaType === 'video' ? <Film size={14} className="text-gray-400" /> :
    update.mediaType === 'photo' ? <ImageIcon size={14} className="text-gray-400" /> :
    <FileText size={14} className="text-gray-400" />;

  const typeLabel =
    update.mediaType === 'video' ? 'Video' :
    update.mediaType === 'photo' ? 'Photo' :
    'Post';

  return (
    <div className="bg-white">
      <div className="max-w-[900px] mx-auto px-4 pt-8 pb-2">
        <Link href="/updates" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
          <ArrowLeft size={14} />
          Back to Updates
        </Link>
      </div>

      <article className="w-full max-w-[900px] mx-auto px-4 pb-20">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-3">
          {typeIcon}
          <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{typeLabel}</span>
          {update.pinned && (
            <span className="flex items-center gap-1 text-xs text-primary font-medium ml-1">
              <Pin size={11} /> Pinned
            </span>
          )}
          <span className="ml-auto text-xs text-gray-400">
            {new Date(update.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        {update.title && (
          <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">{update.title}</h1>
        )}

        {/* Media */}
        {update.mediaType === 'video' && (
          update.mediaUrl ? (
            <video
              src={update.mediaUrl}
              poster={update.thumbnail || undefined}
              controls
              className="w-full rounded-2xl shadow-md bg-black mb-6"
              style={{ maxHeight: '506px' }}
            >
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <div className="w-full h-56 rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-3 text-gray-400 shadow-inner mb-6">
              <Film size={40} />
              <span className="text-sm">No video uploaded</span>
            </div>
          )
        )}

        {update.mediaType === 'photo' && (
          update.mediaUrl ? (
            <img
              src={update.mediaUrl}
              alt={update.title || update.caption}
              className="w-full rounded-2xl shadow-md object-cover max-h-[600px] mb-6"
            />
          ) : (
            <div className="w-full h-56 rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-3 text-gray-400 shadow-inner mb-6">
              <ImageIcon size={40} />
              <span className="text-sm">No image uploaded</span>
            </div>
          )
        )}

        {/* Caption / content */}
        {update.mediaType === 'text' ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-8 py-8 shadow-sm mb-6">
            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">{update.caption}</p>
          </div>
        ) : (
          <p className="text-gray-600 leading-relaxed mb-6">{update.caption}</p>
        )}

        {/* Share footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
          <ShareButton id={update.id} />
          <Link href="/updates" className="ml-auto inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={13} />
            All updates
          </Link>
        </div>
      </article>
    </div>
  );
}
