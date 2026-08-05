import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare, Phone, Mail, ChevronDown, Home, Layers, Briefcase, BookOpen, PhoneCall, Zap, ArrowUp, ExternalLink } from 'lucide-react';
import { FaXTwitter, FaLinkedinIn, FaGithub, FaInstagram, FaYoutube } from 'react-icons/fa6';
import { useGetSiteSettings } from '@workspace/api-client-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/blog', label: 'Blog' },
  { href: '/updates', label: 'Updates' },
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-md blur-[120px] opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-md blur-[150px] opacity-50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-noise pointer-events-none" />
      </div>

      {/* Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/70 backdrop-blur-xl border-b border-border py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-lg shadow-[0_0_20px_rgba(0,183,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,183,255,0.6)] transition-all">
                FTS
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                Firebox<span className="text-primary">Tech</span>Studios
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 glass-panel rounded-xl px-4 py-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === link.href 
                      ? 'bg-muted/60 text-foreground' 
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link href="/contact" className="h-10 px-6 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center transition-all hover:shadow-[0_0_20px_rgba(0,183,255,0.4)]">
                Get a Quote
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md bg-muted/40 border border-border"
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
                  className={`text-2xl font-display font-semibold py-4 border-b border-border/50 ${
                    location === link.href ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-8">
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-14 rounded-md bg-primary text-primary-foreground font-semibold flex items-center justify-center text-lg"
                >
                  Get a Quote
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full pt-20 pb-20 lg:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10">
        {/* CTA Band */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 border-y border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60 pointer-events-none" />
          <div className="relative w-full max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">Ready to build something great?</h3>
              <p className="text-muted-foreground text-sm mt-1">Let's turn your idea into a high-performance product.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 h-11 px-7 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all hover:shadow-[0_0_24px_rgba(0,183,255,0.45)]"
            >
              Get a Free Quote <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* Main footer body */}
        <div className="bg-[#07080f] border-t border-white/5">
          <div className="w-full max-w-6xl mx-auto px-6 pt-14 pb-10">
            {/* Top grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
              {/* Brand */}
              <div className="sm:col-span-2 lg:col-span-1 space-y-5">
                <Link href="/" className="flex items-center gap-2.5 group w-fit">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-sm text-white shadow-[0_0_16px_rgba(0,183,255,0.35)] group-hover:shadow-[0_0_24px_rgba(0,183,255,0.55)] transition-all">
                    FTS
                  </div>
                  <span className="font-display font-bold text-base text-white">
                    Firebox<span className="text-primary">Tech</span>Studios
                  </span>
                </Link>
                <p className="text-sm text-white/50 leading-relaxed max-w-[220px]">
                  {settings?.tagline || 'Building the future with AI, Web, Mobile & Cloud solutions.'}
                </p>
                {/* Social icons */}
                <div className="flex items-center gap-3 pt-1">
                  {[
                    { icon: FaXTwitter, href: '#', label: 'X / Twitter' },
                    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
                    { icon: FaGithub, href: '#', label: 'GitHub' },
                    { icon: FaInstagram, href: '#', label: 'Instagram' },
                    { icon: FaYoutube, href: '#', label: 'YouTube' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-8 h-8 rounded-md bg-white/5 hover:bg-primary/20 hover:text-primary text-white/40 flex items-center justify-center transition-colors"
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">Company</h4>
                <ul className="space-y-3 text-sm">
                  {[
                    { href: '/about', label: 'About Us' },
                    { href: '/services', label: 'Services' },
                    { href: '/portfolio', label: 'Portfolio' },
                    { href: '/updates', label: 'Updates' },
                    { href: '/careers', label: 'Careers' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="text-white/50 hover:text-primary transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">Resources</h4>
                <ul className="space-y-3 text-sm">
                  {[
                    { href: '/tutorials', label: 'Tutorials' },
                    { href: '/blog', label: 'Blog' },
                    { href: '/reviews', label: 'Reviews' },
                    { href: '/support', label: 'Support Us' },
                    { href: '/contact', label: 'Contact' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="text-white/50 hover:text-primary transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">Get in Touch</h4>
                <ul className="space-y-4 text-sm">
                  {settings?.email ? (
                    <li>
                      <a href={`mailto:${settings.email}`} className="flex items-start gap-2.5 text-white/50 hover:text-primary transition-colors">
                        <Mail size={15} className="mt-0.5 shrink-0 text-primary/60" />
                        <span>{settings.email}</span>
                      </a>
                    </li>
                  ) : (
                    <li className="flex items-start gap-2.5 text-white/30">
                      <Mail size={15} className="mt-0.5 shrink-0" />
                      <span>hello@fireboxtech.com</span>
                    </li>
                  )}
                  {settings?.phone && (
                    <li>
                      <a href={`tel:${settings.phone}`} className="flex items-start gap-2.5 text-white/50 hover:text-primary transition-colors">
                        <Phone size={15} className="mt-0.5 shrink-0 text-primary/60" />
                        <span>{settings.phone}</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/30">
                &copy; {new Date().getFullYear()} {settings?.siteName || 'FireboxTechStudios'}. All rights reserved.
              </p>
              <div className="flex items-center gap-5">
                <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms of Service</Link>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60 flex items-center justify-center transition-colors"
                  aria-label="Back to top"
                >
                  <ArrowUp size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/80 backdrop-blur-xl border-t border-border/60">
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {[
            { href: '/', label: 'Home', icon: Home },
            { href: '/services', label: 'Services', icon: Layers },
            { href: '/updates', label: 'Updates', icon: Zap },
            { href: '/blog', label: 'Blog', icon: BookOpen },
            { href: '/contact', label: 'Contact', icon: PhoneCall },
          ].map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]"
              >
                <Icon
                  size={22}
                  className={active ? 'text-primary' : 'text-muted-foreground'}
                />
                <span className={`text-[10px] font-medium leading-none ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Contact Widget */}
      <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {contactOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="glass-panel-glow p-4 rounded-md w-64 shadow-2xl"
            >
              <h4 className="font-display font-medium text-sm mb-3">Reach out to us</h4>
              <div className="space-y-2">
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors text-sm">
                    <div className="w-8 h-8 rounded-md bg-[#25D366]/20 text-[#25D366] flex items-center justify-center"><MessageSquare size={16} /></div>
                    WhatsApp Us
                  </a>
                )}
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors text-sm">
                    <div className="w-8 h-8 rounded-md bg-primary/20 text-primary flex items-center justify-center"><Phone size={16} /></div>
                    Call Us
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors text-sm">
                    <div className="w-8 h-8 rounded-md bg-secondary/20 text-secondary flex items-center justify-center"><Mail size={16} /></div>
                    Email Us
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setContactOpen(!contactOpen)}
          className="w-14 h-14 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_rgba(0,183,255,0.4)] hover:shadow-[0_0_30px_rgba(0,183,255,0.6)] transition-all z-50"
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
            <div className="glass-panel p-5 rounded-md flex flex-col gap-4 shadow-2xl">
              <p className="text-sm text-foreground/80">
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
                  className="px-4 py-2 rounded-lg bg-muted/40 hover:bg-muted/60 text-foreground text-sm font-medium transition-colors"
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
