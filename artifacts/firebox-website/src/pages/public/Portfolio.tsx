import React, { useState } from 'react';
import { useListPublicProjects } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ExternalLink, Github, Monitor } from 'lucide-react';

export default function Portfolio() {
  const [techFilter, setTechFilter] = useState<string>("All");
  
  const { data: projects = [], isLoading } = useListPublicProjects({
    technology: techFilter !== "All" ? techFilter : undefined
  });

  // Extract unique technologies from all projects to create filters
  // (In a real app, this might come from an API, but we'll approximate it here or hardcode common ones)
  const commonTechs = ["All", "React", "Node.js", "Python", "AWS", "Flutter", "TailwindCSS"];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Our <span className="text-secondary">Portfolio</span></h1>
        <p className="text-xl text-muted-foreground">A showcase of digital products, scalable architectures, and intelligent systems we've built.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {commonTechs.map(tech => (
          <button
            key={tech}
            onClick={() => setTechFilter(tech)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              techFilter === tech 
                ? 'bg-secondary text-secondary-foreground shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'bg-muted/40 text-foreground/70 hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass-panel rounded-lg h-[400px] animate-pulse" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => {
            const bgImg = project.screenshotUrls ? project.screenshotUrls.split(',')[0] : '';
            return (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="group block relative h-[450px] rounded-lg overflow-hidden bg-muted/40 border border-border">
                  {bgImg ? (
                    <img src={bgImg} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-30" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/20">
                      <Monitor size={64} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent flex flex-col justify-end p-8">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      {project.category && (
                        <span className="px-3 py-1 bg-muted/60 backdrop-blur-md rounded-full text-xs font-mono mb-4 inline-block">
                          {project.category}
                        </span>
                      )}
                      <h3 className="text-3xl font-display font-bold mb-3">{project.title}</h3>
                      <p className="text-foreground/70 line-clamp-2 mb-6">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies?.split(',').slice(0, 4).map(tech => (
                          <span key={tech} className="text-xs px-2 py-1 rounded bg-secondary/20 text-secondary border border-secondary/20">{tech.trim()}</span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        <Link href={`/portfolio/${project.id}`} className="px-6 py-2 bg-white text-background font-bold rounded-full text-sm">
                          View Details
                        </Link>
                        {project.liveDemoUrl && (
                          <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ExternalLink size={18} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <Github size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-xl">No projects found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}
