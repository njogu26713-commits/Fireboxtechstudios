import React from 'react';
import { useRoute, Link } from 'wouter';
import { useGetTutorial } from '@workspace/api-client-react';
import { ArrowLeft, Download, Play, Clock, BarChart } from 'lucide-react';

export default function TutorialDetail() {
  const [, params] = useRoute('/tutorials/:id');
  const id = params?.id;

  const { data: tutorial, isLoading } = useGetTutorial(id as string, {
    query: { enabled: !!id }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 animate-pulse">
        <div className="h-10 bg-muted/60 rounded w-1/3 mb-8"></div>
        <div className="aspect-video bg-muted/60 rounded-3xl w-full mb-8"></div>
        <div className="h-4 bg-muted/60 rounded w-full mb-2"></div>
        <div className="h-4 bg-muted/60 rounded w-2/3"></div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Tutorial Not Found</h1>
        <Link href="/tutorials" className="text-primary hover:underline">Return to Tutorials</Link>
      </div>
    );
  }

  // Extract youtube ID if it's a full URL
  const getYoutubeEmbed = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const embedUrl = getYoutubeEmbed(tutorial.youtubeEmbedUrl || tutorial.videoUrl || "");

  return (
    <div className="pb-24">
      <div className="container mx-auto px-4 md:px-6 pt-12">
        <Link href="/tutorials" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Tutorials
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4 text-sm font-mono">
            <span className="text-primary px-3 py-1 bg-primary/10 rounded-full">{tutorial.category}</span>
            {tutorial.difficulty && <span className="flex items-center gap-1 text-muted-foreground"><BarChart size={14}/> {tutorial.difficulty}</span>}
            {tutorial.duration && <span className="flex items-center gap-1 text-muted-foreground"><Clock size={14}/> {tutorial.duration}</span>}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">{tutorial.title}</h1>

          {embedUrl ? (
            <div className="aspect-video rounded-3xl overflow-hidden border border-border mb-12 shadow-2xl bg-black">
              <iframe 
                src={embedUrl} 
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="aspect-video rounded-3xl border border-border mb-12 bg-muted/40 flex items-center justify-center text-foreground/30">
              <Play size={48} />
              <span className="ml-4 font-mono">Video unavailable</span>
            </div>
          )}

          <div className="glass-panel p-8 rounded-3xl prose max-w-none mb-12">
            <h2 className="text-2xl font-display font-bold mb-4 text-foreground">About this tutorial</h2>
            <p className="text-foreground/80 whitespace-pre-wrap">{tutorial.description}</p>
          </div>

          {tutorial.downloadableResources && (
            <div className="glass-panel-glow p-8 rounded-3xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">Project Files</h3>
                <p className="text-muted-foreground text-sm">Download the source code and assets used in this tutorial.</p>
              </div>
              <a href={tutorial.downloadableResources} target="_blank" rel="noreferrer" className="flex items-center gap-2 h-12 px-6 rounded-xl bg-white text-background font-bold hover:bg-white/90 transition-colors">
                <Download size={18} /> Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
