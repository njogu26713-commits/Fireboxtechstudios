import React, { useState } from 'react';
import { useListPublicServices } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Code, Smartphone, Shield, Cloud, Cpu, Terminal, ArrowRight, LayoutGrid } from 'lucide-react';

const categories = ["All", "Web", "Mobile", "AI", "Cloud", "Security", "DevOps"];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: services = [], isLoading } = useListPublicServices({
    category: activeCategory !== "All" ? activeCategory : undefined
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Our <span className="text-primary">Services</span></h1>
        <p className="text-xl text-muted-foreground">Comprehensive technology solutions designed to scale, secure, and accelerate your business.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeCategory === cat 
                ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,183,255,0.3)]' 
                : 'bg-muted/40 text-foreground/70 hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl h-72 animate-pulse">
              <div className="w-14 h-14 bg-muted/60 rounded-2xl mb-6"></div>
              <div className="h-8 bg-muted/60 rounded w-3/4 mb-4"></div>
              <div className="h-20 bg-muted/60 rounded w-full mb-4"></div>
            </div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                href={service.destinationUrl || `/services/${service.id}`}
                target={service.destinationUrl ? "_blank" : undefined}
                className="block glass-panel-glow p-8 rounded-3xl h-full flex flex-col group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                  {service.title.toLowerCase().includes('web') ? <Code size={28} /> :
                   service.title.toLowerCase().includes('app') ? <Smartphone size={28} /> :
                   service.title.toLowerCase().includes('cyber') || service.title.toLowerCase().includes('security') ? <Shield size={28} /> :
                   service.title.toLowerCase().includes('cloud') ? <Cloud size={28} /> :
                   service.title.toLowerCase().includes('ai') ? <Cpu size={28} /> :
                   <LayoutGrid size={28} />}
                </div>
                <div className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">{service.category}</div>
                <h3 className="text-2xl font-display font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6 flex-1">{service.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  {service.pricing && (
                    <span className="font-mono font-bold text-foreground/80">{service.pricing}</span>
                  )}
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-4 transition-all ml-auto">
                    {service.buttonText || 'Learn More'} <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <LayoutGrid size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-xl">No services found in this category.</p>
        </div>
      )}
    </div>
  );
}
