import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Pin, Film, ImageIcon, FileText, Share2, Check } from 'lucide-react';

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

function useUpdatesPublic() {
  return useQuery<Update[]>({
    queryKey: ['updates-public'],
    queryFn: () =>
      fetch('/api/updates/public').then((r) => {
        if (!r.ok) throw new Error('Failed to load updates');
        return r.json();
      }),
  });
}

// ── Video post ────────────────────────────────────────────────────────────────
function VideoPost({ update }: { update: Update }) {
  return (
    <article className="w-full max-w-[900px] mx-auto py-10 border-b border-gray-100 last:border-0">
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <Film size={14} className="text-gray-400" />
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Video</span>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4 px-1 leading-snug">{update.title}</h2>
      )}

      {/* Player */}
      {update.mediaUrl ? (
        <video
          src={update.mediaUrl}
          poster={update.thumbnail || undefined}
          controls
          className="w-full rounded-2xl shadow-md bg-black"
          style={{ maxHeight: '506px' }}
        >
          Your browser does not support HTML5 video.
        </video>
      ) : (
        <div className="w-full h-56 rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-3 text-gray-400 shadow-inner">
          <Film size={40} />
          <span className="text-sm">No video uploaded</span>
        </div>
      )}

      {/* Caption / description */}
      <p className="mt-4 px-1 text-gray-600 leading-relaxed">{update.caption}</p>

      {/* Share row */}
      <div className="mt-4 px-1 flex items-center gap-3">
        <ShareButton id={update.id} />
        <Link href={`/updates/${update.id}`} className="text-xs text-gray-400 hover:text-primary transition-colors">
          View post
        </Link>
      </div>
    </article>
  );
}

// ── Photo post ────────────────────────────────────────────────────────────────
function PhotoPost({ update }: { update: Update }) {
  return (
    <article className="w-full max-w-[900px] mx-auto py-10 border-b border-gray-100 last:border-0">
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <ImageIcon size={14} className="text-gray-400" />
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Photo</span>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4 px-1 leading-snug">{update.title}</h2>
      )}

      {/* Image */}
      {update.mediaUrl ? (
        <img
          src={update.mediaUrl}
          alt={update.title || update.caption}
          className="w-full rounded-2xl shadow-md object-cover max-h-[600px]"
        />
      ) : (
        <div className="w-full h-56 rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-3 text-gray-400 shadow-inner">
          <ImageIcon size={40} />
          <span className="text-sm">No image uploaded</span>
        </div>
      )}

      {/* Caption */}
      <p className="mt-4 px-1 text-gray-600 leading-relaxed">{update.caption}</p>

      {/* Share row */}
      <div className="mt-4 px-1 flex items-center gap-3">
        <ShareButton id={update.id} />
        <Link href={`/updates/${update.id}`} className="text-xs text-gray-400 hover:text-primary transition-colors">
          View post
        </Link>
      </div>
    </article>
  );
}

// ── Text post ─────────────────────────────────────────────────────────────────
function TextPost({ update }: { update: Update }) {
  return (
    <article className="w-full max-w-[900px] mx-auto py-10 border-b border-gray-100 last:border-0">
      {/* Meta row */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <FileText size={14} className="text-gray-400" />
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Post</span>
        {update.pinned && (
          <span className="flex items-center gap-1 text-xs text-primary font-medium ml-1">
            <Pin size={11} /> Pinned
          </span>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {new Date(update.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {update.title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4 px-1 leading-snug">{update.title}</h2>
      )}

      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-8 py-8 shadow-sm">
        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">{update.caption}</p>
      </div>

      {/* Share row */}
      <div className="mt-4 px-1 flex items-center gap-3">
        <ShareButton id={update.id} />
        <Link href={`/updates/${update.id}`} className="text-xs text-gray-400 hover:text-primary transition-colors">
          View post
        </Link>
      </div>
    </article>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Updates() {
  const { data: updates = [], isLoading, isError } = useUpdatesPublic();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm">Loading updates…</span>
        </div>
      </div>
    );
  }

  if (isError || updates.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white px-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
            <Film size={28} className="text-gray-400" />
          </div>
          <h2 className="font-bold text-xl text-gray-800">No updates yet</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Check back soon — videos, photos, and posts from FireboxTechStudios will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Pinned posts first
  const sorted = [...updates].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="bg-background">
      {/* Page header */}
      <div className="max-w-[900px] mx-auto px-4 pt-12 pb-2">
        <h1 className="text-3xl font-bold text-gray-900">Updates</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {updates.length} post{updates.length !== 1 ? 's' : ''}
        </p>
        <div className="mt-6 border-b border-gray-100" />
      </div>

      {/* Feed */}
      <div className="px-4 pb-20">
        {sorted.map((update) => {
          if (update.mediaType === 'video') return <VideoPost key={update.id} update={update} />;
          if (update.mediaType === 'photo') return <PhotoPost key={update.id} update={update} />;
          return <TextPost key={update.id} update={update} />;
        })}
      </div>
    </div>
  );
}
