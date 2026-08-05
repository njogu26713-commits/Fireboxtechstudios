import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, VolumeX, Volume2, Pin, Image as ImageIcon, FileText, Film } from 'lucide-react';
import { motion } from 'framer-motion';

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

// ── Video Card ────────────────────────────────────────────────────────────────
function VideoCard({ update, active }: { update: Update; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [active]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {update.mediaUrl ? (
        <video
          ref={videoRef}
          src={update.mediaUrl}
          className="w-full h-full object-cover"
          loop
          muted={muted}
          playsInline
          poster={update.thumbnail || undefined}
          onClick={toggle}
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-white/40">
          <Film size={64} />
          <span className="text-lg">No video URL set</span>
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Controls */}
      <div className="absolute bottom-24 left-0 right-0 px-6 flex flex-col gap-3">
        {update.title && (
          <h3 className="text-white font-display font-bold text-xl leading-tight drop-shadow-lg">
            {update.title}
          </h3>
        )}
        <p className="text-white/90 text-sm leading-relaxed drop-shadow">{update.caption}</p>
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => setMuted(!muted)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Photo Card ────────────────────────────────────────────────────────────────
function PhotoCard({ update }: { update: Update }) {
  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {update.mediaUrl ? (
        <img
          src={update.mediaUrl}
          alt={update.title || update.caption}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 text-white/40">
          <ImageIcon size={64} />
          <span className="text-lg">No image URL set</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-24 left-0 right-0 px-6 space-y-2">
        {update.title && (
          <h3 className="text-white font-display font-bold text-xl drop-shadow-lg">{update.title}</h3>
        )}
        <p className="text-white/90 text-sm leading-relaxed drop-shadow">{update.caption}</p>
      </div>
    </div>
  );
}

// ── Text Card ─────────────────────────────────────────────────────────────────
function TextCard({ update }: { update: Update }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-8 py-24 bg-gradient-to-br from-background via-primary/10 to-secondary/10">
      {/* ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 max-w-xl text-center space-y-6">
        <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto">
          <FileText size={26} className="text-primary" />
        </div>
        {update.title && (
          <h3 className="font-display font-bold text-3xl md:text-4xl leading-tight text-foreground">
            {update.title}
          </h3>
        )}
        <p className="text-foreground/80 text-lg leading-relaxed">{update.caption}</p>
      </div>
    </div>
  );
}

// ── Feed Item ─────────────────────────────────────────────────────────────────
function FeedItem({ update, active, index }: { update: Update; active: boolean; index: number }) {
  return (
    <div
      className="w-full h-[100dvh] flex-shrink-0 snap-start snap-always relative overflow-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      {update.mediaType === 'video' && <VideoCard update={update} active={active} />}
      {update.mediaType === 'photo' && <PhotoCard update={update} />}
      {update.mediaType === 'text' && <TextCard update={update} />}

      {/* Top badges */}
      <div className="absolute top-24 left-4 flex items-center gap-2">
        {update.pinned && (
          <span className="flex items-center gap-1 bg-primary/80 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full backdrop-blur">
            <Pin size={10} /> Pinned
          </span>
        )}
        <span className="bg-black/40 text-white/70 text-xs px-2 py-1 rounded-full backdrop-blur">
          {update.mediaType === 'video' ? '🎥 Video' : update.mediaType === 'photo' ? '📷 Photo' : '📝 Post'}
        </span>
      </div>

      {/* Index counter */}
      <div className="absolute top-24 right-4 text-white/40 text-xs font-mono">
        {index + 1}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Updates() {
  const { data: updates = [], isLoading, isError } = useUpdatesPublic();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track which item is in view via scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const itemH = container.clientHeight;
      const idx = Math.round(scrollTop / itemH);
      setActiveIndex(idx);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [updates.length]);

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>Loading updates…</span>
        </div>
      </div>
    );
  }

  if (isError || updates.length === 0) {
    return (
      <div className="h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Film size={36} className="text-primary" />
          </div>
          <h2 className="font-display font-bold text-2xl">No updates yet</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Check back soon — videos, photos, and posts from FireboxTechStudios will appear here.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Page header above the feed */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between max-w-screen-sm mx-auto w-full">
        <h1 className="font-display font-bold text-lg text-foreground">Updates</h1>
        <span className="text-xs text-muted-foreground">{updates.length} post{updates.length !== 1 ? 's' : ''}</span>
      </div>

      {/* TikTok-style vertical snap scroll */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          height: 'calc(100dvh - 120px)',
        }}
      >
        {updates.map((update, i) => (
          <FeedItem key={update.id} update={update} active={i === activeIndex} index={i} />
        ))}
      </div>

      {/* Dot navigation — desktop */}
      {updates.length > 1 && (
        <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-2 z-50">
          {updates.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const container = containerRef.current;
                if (container) container.scrollTo({ top: i * container.clientHeight, behavior: 'smooth' });
              }}
              className={`w-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'h-6 bg-primary' : 'h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
