import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowRight, 
  Code, 
  Smartphone, 
  Shield, 
  Cloud, 
  Cpu, 
  Terminal,
  ChevronRight,
  Star
} from 'lucide-react';
import { 
  useGetDashboardStats, 
  useListFeaturedServices,
  useListFeaturedProjects,
  useListPublicReviews,
  useListTrustedClients
} from '@workspace/api-client-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { data: stats } = useGetDashboardStats();
  const { data: featuredServices = [] } = useListFeaturedServices();
  const { data: featuredProjects = [] } = useListFeaturedProjects();
  const { data: reviewsData } = useListPublicReviews();
  const { data: clients = [] } = useListTrustedClients();

  const reviews = reviewsData?.reviews || [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid opacity-30 z-0"></div>

        <div className="w-full relative z-10 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — text content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-start"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Next-Generation Technology
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6"
              >
                Innovate with{' '}
                <span className="text-gradient">Intelligence</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
              >
                FireboxTechStudios is a global technology partner building next-generation software, AI solutions, and cloud architectures for forward-thinking companies.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link href="/services" className="h-14 px-8 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(0,183,255,0.5)]">
                  Explore Services <ArrowRight size={18} />
                </Link>
                <Link href="/contact" className="h-14 px-8 rounded-md glass-panel hover:bg-muted/60 font-semibold flex items-center justify-center gap-2 transition-all">
                  Get a Quote
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — hero image */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-75 pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,183,255,0.15)]">
                <img
                  src="/hero-image.jpg"
                  alt="Futuristic AI and technology visualization"
                  className="w-full h-full object-cover max-h-[560px]"
                />
                {/* Subtle overlay to blend with dark theme */}
                <div className="absolute inset-0 bg-gradient-to-tl from-background/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 border-y border-border/50 bg-muted/30">
          <div className="w-full px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">{stats.totalProjects}+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-mono">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">{stats.totalServices}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-mono">Core Services</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">{stats.avgRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-mono">Client Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-secondary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-mono">Support</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Services */}
      <section className="py-24 relative">
        <div className="w-full px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Core <span className="text-primary">Capabilities</span></h2>
              <p className="text-muted-foreground text-lg">We deliver end-to-end digital transformation across multiple domains of technology.</p>
            </div>
            <Link href="/services" className="flex items-center gap-2 text-primary hover:text-foreground transition-colors font-medium">
              View all services <ChevronRight size={20} />
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredServices.length > 0 ? featuredServices.slice(0, 6).map((service, i) => (
              <motion.div key={service.id} variants={fadeInUp}>
                <Link 
                  href={service.destinationUrl || `/services/${service.id}`}
                  target={service.destinationUrl ? "_blank" : undefined}
                  className="block glass-panel-glow p-8 rounded-lg h-full flex flex-col group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-md bg-muted/40 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                    {/* fallback icons based on text */}
                    {service.title.toLowerCase().includes('web') ? <Code size={28} /> :
                     service.title.toLowerCase().includes('app') ? <Smartphone size={28} /> :
                     service.title.toLowerCase().includes('cyber') ? <Shield size={28} /> :
                     service.title.toLowerCase().includes('cloud') ? <Cloud size={28} /> :
                     service.title.toLowerCase().includes('ai') ? <Cpu size={28} /> :
                     <Terminal size={28} />}
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-1">{service.description.substring(0, 120)}...</p>
                  <div className="text-primary font-medium flex items-center gap-2 mt-auto group-hover:gap-4 transition-all">
                    {service.buttonText || 'Learn More'} <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            )) : (
              // Fallback skeleton or empty state
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="glass-panel p-8 rounded-lg h-64 animate-pulse">
                  <div className="w-14 h-14 bg-muted/60 rounded-md mb-6"></div>
                  <div className="h-6 bg-muted/60 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted/60 rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted/60 rounded w-5/6"></div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-24 bg-card/30 border-y border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-md blur-[100px] pointer-events-none" />
        
        <div className="w-full px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Featured <span className="text-secondary">Work</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover how we've helped businesses scale and succeed through technology.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.length > 0 ? featuredProjects.slice(0, 4).map((project, i) => {
              const bgImg = project.screenshotUrls ? project.screenshotUrls.split(',')[0] : '';
              return (
                <motion.div 
                  key={project.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <Link href={`/portfolio/${project.id}`} className="group block relative h-[400px] rounded-lg overflow-hidden bg-muted/40">
                    {bgImg ? (
                      <img src={bgImg} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex flex-col justify-end p-8">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {project.category && <span className="px-3 py-1 bg-muted/60 backdrop-blur-md rounded-md text-xs font-mono mb-4 inline-block">{project.category}</span>}
                        <h3 className="text-3xl font-display font-bold mb-2">{project.title}</h3>
                        <p className="text-foreground/70 line-clamp-2 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.split(',').slice(0, 3).map(tech => (
                            <span key={tech} className="text-xs text-primary">{tech.trim()}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            }) : (
              <div className="col-span-1 md:col-span-2 text-center text-muted-foreground/70 py-12">Projects loading...</div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/portfolio" className="inline-flex h-12 px-8 rounded-md border border-white/20 hover:bg-muted/40 items-center justify-center font-medium transition-all">
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Clients Marquee */}
      {clients && clients.length > 0 && (
        <section className="py-12 border-b border-border/50 overflow-hidden">
          <div className="w-full px-4 text-center mb-8">
            <h3 className="text-sm font-mono text-muted-foreground/70 uppercase tracking-widest">Trusted by industry leaders</h3>
          </div>
          <div className="flex gap-12 items-center w-max animate-[firebox-shimmer_30s_linear_infinite]">
            {[...clients, ...clients, ...clients].map((client, i) => (
              <div key={`${client.id}-${i}`} className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt={client.name} className="h-12 object-contain" />
                ) : (
                  <span className="text-xl font-display font-bold">{client.name}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="w-full px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Client <span className="text-primary">Success</span></h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-1 text-primary">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} fill="currentColor" size={20} />)}
              </div>
              <span className="font-bold text-xl">{stats?.avgRating?.toFixed(1) || 5.0}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} className="glass-panel p-8 rounded-lg relative">
                <div className="text-primary mb-6"><Star fill="currentColor" size={32} /></div>
                <p className="text-foreground/80 text-lg leading-relaxed mb-8 italic">"{review.testimonial}"</p>
                <div className="mt-auto">
                  <p className="font-bold font-display">{review.name}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/reviews" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              Read all reviews <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/30 blur-[100px] rounded-md pointer-events-none"></div>
        
        <div className="w-full px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">Ready to build the <span className="text-gradient">future?</span></h2>
            <p className="text-xl text-foreground/70 mb-10">Let's turn your vision into reality. Reach out to our team of experts today.</p>
            <Link href="/contact" className="inline-flex h-16 px-10 rounded-md bg-white text-background font-bold items-center justify-center text-lg hover:bg-white/90 transition-all hover:scale-105">
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
