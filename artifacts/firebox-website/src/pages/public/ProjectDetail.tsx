import React from 'react';
import { useRoute, Link } from 'wouter';
import { useGetProject } from '@workspace/api-client-react';
import { ArrowLeft, ExternalLink, Github, Layers, Calendar, Tag } from 'lucide-react';

export default function ProjectDetail() {
  const [, params] = useRoute('/portfolio/:id');
  const id = params?.id;

  const { data: project, isLoading } = useGetProject(id as string, {
    query: { enabled: !!id }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="animate-pulse max-w-4xl mx-auto space-y-8">
          <div className="h-10 bg-muted/60 rounded w-1/3"></div>
          <div className="h-[500px] bg-muted/60 rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Project Not Found</h1>
        <Link href="/portfolio" className="text-primary hover:underline">Return to Portfolio</Link>
      </div>
    );
  }

  const screenshots = project.screenshotUrls ? project.screenshotUrls.split(',').map(u => u.trim()) : [];
  const techs = project.technologies ? project.technologies.split(',').map(t => t.trim()) : [];

  return (
    <div className="pb-24">
      <div className="container mx-auto px-4 md:px-6 pt-12">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">{project.title}</h1>
            <p className="text-xl text-foreground/70 leading-relaxed mb-12">
              {project.description}
            </p>

            {screenshots.length > 0 && (
              <div className="space-y-8">
                {screenshots.map((url, i) => (
                  <img key={i} src={url} alt={`Screenshot ${i + 1}`} className="w-full rounded-3xl border border-border shadow-2xl" />
                ))}
              </div>
            )}
            
            {project.videoUrl && (
              <div className="mt-12 aspect-video rounded-3xl overflow-hidden border border-border">
                <video src={project.videoUrl} controls className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-3xl">
              <h3 className="text-xl font-display font-bold mb-6 border-b border-border pb-4">Project Details</h3>
              
              <div className="space-y-6 text-sm">
                {project.category && (
                  <div>
                    <div className="text-muted-foreground mb-1 flex items-center gap-2"><Layers size={14} /> Category</div>
                    <div className="font-medium text-foreground/90">{project.category}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-muted-foreground mb-2 flex items-center gap-2"><Tag size={14} /> Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {techs.map(tech => (
                      <span key={tech} className="px-3 py-1 rounded bg-muted/40 border border-border text-foreground/80">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex flex-col gap-3">
                  {project.liveDemoUrl && (
                    <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                      <ExternalLink size={18} /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-full h-12 rounded-xl bg-muted/60 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                      <Github size={18} /> Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-panel-glow p-8 rounded-3xl text-center">
              <h4 className="font-display font-bold mb-2">Want to build something similar?</h4>
              <p className="text-muted-foreground text-sm mb-6">Let's discuss how we can bring your vision to life.</p>
              <Link href="/contact" className="inline-block px-6 py-3 rounded-full border border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all w-full">
                Start a Conversation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
