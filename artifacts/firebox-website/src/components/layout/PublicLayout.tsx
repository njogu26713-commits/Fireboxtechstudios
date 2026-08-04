import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare, Phone, Mail, ChevronDown } from 'lucide-react';
import { useGetSiteSettings } from '@workspace/api-client-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCookie, setShowCookie] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  
  const { data: settings } = useGetSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Cookie banner
    if (!localStorage.getItem('cookieAccepted')) {
      setShowCookie(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowCookie(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background text-foreground">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] opacity-50 mix-blend-screen" />
        <div className="absolute inset-0 bg-noise pointer-events-none" />
      </div>

      {/* Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/70 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-lg shadow-[0_0_20px_rgba(0,183,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,183,255,0.6)] transition-all">
                FTS
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                Firebox<span className="text-primary">Tech</span>Studios
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 glass-panel rounded-full px-4 py-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    location === link.href 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link href="/contact" className="h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center transition-all hover:shadow-[0_0_20px_rgba(0,183,255,0.4)]">
                Get a Quote
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl pt-24 pb-6 px-4 flex flex-col"
          >
            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-display font-semibold py-4 border-b border-white/5 ${
                    location === link.href ? 'text-primary' : 'text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-8">
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center text-lg"
                >
                  Get a Quote
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background/80 backdrop-blur-lg pt-16 pb-8 mt-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-display font-bold text-sm text-primary-foreground">
                  FTS
                </div>
                <span className="font-display font-bold text-lg">FireboxTechStudios</span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                {settings?.tagline || 'Building the future with AI, Web, Mobile, and Cloud Computing solutions.'}
              </p>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
                <li><Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/support" className="hover:text-primary transition-colors">Support Us</Link></li>
                <li><Link href="/reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3 text-sm text-white/60">
                {settings?.email && (
                  <li className="flex items-center gap-2"><Mail size={16} className="text-primary" /> {settings.email}</li>
                )}
                {settings?.phone && (
                  <li className="flex items-center gap-2"><Phone size={16} className="text-primary" /> {settings.phone}</li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} {settings?.siteName || 'FireboxTechStudios'}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {contactOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="glass-panel-glow p-4 rounded-2xl w-64 shadow-2xl"
            >
              <h4 className="font-display font-medium text-sm mb-3">Reach out to us</h4>
              <div className="space-y-2">
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
                    <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center"><MessageSquare size={16} /></div>
                    WhatsApp Us
                  </a>
                )}
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center"><Phone size={16} /></div>
                    Call Us
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center"><Mail size={16} /></div>
                    Email Us
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setContactOpen(!contactOpen)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_rgba(0,183,255,0.4)] hover:shadow-[0_0_30px_rgba(0,183,255,0.6)] transition-all z-50"
        >
          {contactOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookie && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-24 md:right-auto md:max-w-md z-40"
          >
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 shadow-2xl">
              <p className="text-sm text-white/80">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={acceptCookies}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors"
                >
                  Accept
                </button>
                <Link 
                  href="/privacy" 
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                  onClick={() => setShowCookie(false)}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
