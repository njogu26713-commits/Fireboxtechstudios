import React from 'react';
import { useListPublicJobs } from '@workspace/api-client-react';
import { MapPin, Briefcase, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Careers() {
  const { data: jobs = [], isLoading } = useListPublicJobs();

  return (
    <div className="w-full px-4 py-12 pb-24">
      <div className="max-w-4xl mx-auto text-center mb-16 pt-12">
        <span className="px-4 py-1.5 rounded-md bg-primary/20 text-primary text-sm font-mono font-medium mb-6 inline-block">
          Join the Team
        </span>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Build the <span className="text-gradient">Impossible</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We are always looking for visionary engineers, designers, and thinkers to join us in shaping the future of technology.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-display font-bold mb-8">Open Positions</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-panel p-6 rounded-md h-32 animate-pulse" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 md:p-8 rounded-lg hover:border-primary/30 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <h3 className="text-2xl font-bold font-display mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department} · {job.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    {job.salaryRange && <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salaryRange}</span>}
                  </div>
                </div>
                
                <a 
                  href={job.applicationUrl || `mailto:careers@fireboxtechstudios.com?subject=Application for ${job.title}`}
                  target={job.applicationUrl ? "_blank" : undefined}
                  rel="noreferrer"
                  className="shrink-0 h-12 px-6 rounded-md bg-muted/60 hover:bg-primary hover:text-primary-foreground font-bold flex items-center justify-center gap-2 transition-all"
                >
                  Apply Now <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">No open positions right now</h3>
            <p className="text-muted-foreground mb-6">But we're always interested in meeting talented people. Send us your resume anyway.</p>
            <a href="mailto:careers@fireboxtechstudios.com" className="inline-flex h-12 px-6 rounded-md bg-white text-background font-bold items-center justify-center">
              Email Resume
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
