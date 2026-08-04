import React, { useState } from 'react';
import { useListPublicTutorials } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Play, Clock, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Tutorials() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: tutorials = [], isLoading } = useListPublicTutorials({
    search: search || undefined,
    category: category !== "All" ? category : undefined
  });

  const categories = ["All", "Web Dev", "AI", "Cloud", "Cybersecurity", "Mobile"];

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Developer <span className="text-primary">Tutorials</span></h1>
        <p className="text-xl text-muted-foreground">Level up your skills with our deep-dive technical guides and video tutorials.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                category === cat 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/40 text-foreground/70 hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" size={18} />
          <input 
            type="text" 
            placeholder="Search tutorials..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/40 border border-border rounded-md text-sm focus:outline-none focus:border-primary/50 text-foreground"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass-panel rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      ) : tutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial, i) => (
            <motion.div 
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/tutorials/${tutorial.id}`} className="group block glass-panel rounded-lg overflow-hidden hover:border-primary/50 transition-colors h-full flex flex-col">
                <div className="relative aspect-video bg-black">
                  {tutorial.thumbnailUrl ? (
                    <img src={tutorial.thumbnailUrl} alt={tutorial.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/40"><Play size={40} className="text-foreground/20" /></div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-md bg-primary/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                      <Play fill="currentColor" size={20} />
                    </div>
                  </div>
                  {tutorial.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-mono font-medium">
                      {tutorial.duration}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-primary uppercase tracking-wider">{tutorial.category}</span>
                    <span className="w-1 h-1 rounded-md bg-white/20"></span>
                    <span className="text-xs text-muted-foreground">{tutorial.difficulty || 'All Levels'}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">{tutorial.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-auto">{tutorial.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <p>No tutorials found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
