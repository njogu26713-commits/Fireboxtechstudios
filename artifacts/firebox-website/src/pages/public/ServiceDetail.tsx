import React from 'react';
import { useRoute, Link } from 'wouter';
import { useGetService } from '@workspace/api-client-react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceDetail() {
  const [, params] = useRoute('/services/:id');
  const id = params?.id;

  const { data: service, isLoading } = useGetService(Number(id), {
    query: { enabled: !!id } as any
  });

  if (isLoading) {
    return (
      <div className="w-full px-4 py-24">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-10 bg-muted/60 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-muted/60 rounded w-full mb-8"></div>
          <div className="h-96 bg-muted/60 rounded-lg w-full"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="w-full px-4 py-32 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Service Not Found</h1>
        <Link href="/services" className="text-primary hover:underline">Return to Services</Link>
      </div>
    );
  }

  const gallery = service.galleryUrls ? service.galleryUrls.split(',').map(u => u.trim()) : [];

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative pt-24 pb-32 overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-grid opacity-30 z-0"></div>
        {service.bannerUrl && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={service.bannerUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
          </div>
        )}
        
        <div className="w-full relative z-10 px-4">
          <Link href="/services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Services
          </Link>
          
          <div className="max-w-4xl">
            <span className="px-4 py-1.5 rounded-md bg-primary/20 text-primary text-sm font-mono font-medium mb-6 inline-block">
              {service.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">{service.title}</h1>
            <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {gallery.length > 0 && (
              <div>
                <h3 className="text-2xl font-display font-bold mb-6">Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((url, i) => (
                    <img key={i} src={url} alt={`Gallery ${i}`} className="rounded-md w-full h-64 object-cover border border-border" />
                  ))}
                </div>
              </div>
            )}
            
            <div className="glass-panel p-8 rounded-lg">
              <h3 className="text-2xl font-display font-bold mb-6">Why Choose Firebox?</h3>
              <ul className="space-y-4">
                {['Enterprise-grade architecture and security', 'Scalable solutions built for growth', 'Dedicated 24/7 support and maintenance', 'Agile development methodology'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80">
                    <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="glass-panel-glow p-8 rounded-lg sticky top-24">
              <h3 className="text-2xl font-display font-bold mb-2">Get Started</h3>
              <p className="text-muted-foreground mb-8">Ready to transform your business with our {service.title.toLowerCase()} solutions?</p>
              
              {service.pricing && (
                <div className="mb-8 p-4 bg-muted/40 rounded-md border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Starting from</div>
                  <div className="text-3xl font-display font-bold text-primary">{service.pricing}</div>
                </div>
              )}

              <Link 
                href="/contact" 
                className="w-full h-14 rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
