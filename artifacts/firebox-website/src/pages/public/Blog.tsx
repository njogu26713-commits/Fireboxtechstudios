import React, { useState } from 'react';
import { useListPublicBlogPosts } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Calendar, User, Search, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: posts = [], isLoading } = useListPublicBlogPosts({
    search: search || undefined,
    category: category !== "All" ? category : undefined
  });

  const categories = ["All", "Company News", "Tech Trends", "Engineering", "Design"];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">The <span className="text-secondary">Pulse</span></h1>
        <p className="text-xl text-muted-foreground">Insights, engineering deep-dives, and company news from the Firebox team.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat 
                  ? 'bg-secondary text-secondary-foreground' 
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
            placeholder="Search articles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/40 border border-border rounded-full text-sm focus:outline-none focus:border-secondary/50 text-foreground"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass-panel rounded-lg h-[450px] animate-pulse" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.id}`} className="group block glass-panel rounded-lg overflow-hidden hover:border-secondary/50 transition-colors h-full flex flex-col">
                <div className="relative aspect-[16/10] bg-muted/40">
                  {post.featuredImageUrl && (
                    <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-xs font-mono font-medium text-secondary">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-mono">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.authorName && <span className="flex items-center gap-1"><User size={14} /> {post.authorName}</span>}
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3 group-hover:text-secondary transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">{post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}</p>
                  
                  <div className="flex items-center text-secondary font-medium text-sm mt-auto group-hover:gap-2 transition-all gap-1">
                    Read Article <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <p>No articles found.</p>
        </div>
      )}
    </div>
  );
}
