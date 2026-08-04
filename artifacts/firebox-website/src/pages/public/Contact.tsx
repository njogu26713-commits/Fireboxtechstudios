import React, { useState } from 'react';
import { useCreateContactMessage, useCreateQuoteRequest, useGetSiteSettings } from '@workspace/api-client-react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const { data: settings } = useGetSiteSettings();
  const createMessage = useCreateContactMessage();
  const createQuote = useCreateQuoteRequest();
  const { toast } = useToast();

  const [mode, setMode] = useState<'contact'|'quote'>('contact');

  // Contact Form State
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  
  // Quote Form State
  const [quoteData, setQuoteData] = useState({ name: '', email: '', phone: '', projectType: '', description: '', budget: '', timeline: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMessage.mutate({ data: contactData }, {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "We'll get back to you shortly." });
        setContactData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    });
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createQuote.mutate({ data: quoteData }, {
      onSuccess: () => {
        toast({ title: "Quote Request Sent", description: "Our team will review and contact you." });
        setQuoteData({ name: '', email: '', phone: '', projectType: '', description: '', budget: '', timeline: '' });
      }
    });
  };

  return (
    <div className="pb-24">
      <div className="relative pt-24 pb-24 overflow-hidden border-b border-border bg-card/30">
        <div className="absolute inset-0 bg-grid opacity-30 z-0"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Let's <span className="text-gradient">Connect</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Whether you have a quick question or a massive project in mind, we're ready to talk.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-3xl space-y-8">
              <h3 className="text-2xl font-display font-bold border-b border-border pb-4">Direct Contact</h3>
              
              {settings?.email && (
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0"><Mail /></div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email Us</div>
                    <a href={`mailto:${settings.email}`} className="text-white hover:text-primary font-medium">{settings.email}</a>
                  </div>
                </div>
              )}
              
              {settings?.phone && (
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0"><Phone /></div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Call Us</div>
                    <a href={`tel:${settings.phone}`} className="text-white hover:text-secondary font-medium">{settings.phone}</a>
                  </div>
                </div>
              )}
              
              {settings?.address && (
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted/60 text-white flex items-center justify-center shrink-0"><MapPin /></div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Visit Us</div>
                    <address className="text-white not-italic">{settings.address}</address>
                  </div>
                </div>
              )}
            </div>

            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="block glass-panel-glow p-6 rounded-3xl text-center hover:scale-[1.02] transition-transform">
                <div className="text-[#25D366] font-bold text-lg mb-2">Need a quick answer?</div>
                <p className="text-muted-foreground text-sm">Chat with us directly on WhatsApp</p>
              </a>
            )}
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2 glass-panel p-8 md:p-10 rounded-3xl">
            <div className="flex bg-muted/40 rounded-xl p-1 mb-8">
              <button 
                onClick={() => setMode('contact')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === 'contact' ? 'bg-primary text-background' : 'text-muted-foreground hover:text-white'}`}
              >
                General Inquiry
              </button>
              <button 
                onClick={() => setMode('quote')}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === 'quote' ? 'bg-secondary text-white' : 'text-muted-foreground hover:text-white'}`}
              >
                Request a Quote
              </button>
            </div>

            {mode === 'contact' ? (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Your Name</label>
                    <input required type="text" value={contactData.name} onChange={e=>setContactData({...contactData, name: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                    <input required type="email" value={contactData.email} onChange={e=>setContactData({...contactData, email: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Phone (Optional)</label>
                    <input type="tel" value={contactData.phone} onChange={e=>setContactData({...contactData, phone: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Subject</label>
                    <input required type="text" value={contactData.subject} onChange={e=>setContactData({...contactData, subject: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Message</label>
                  <textarea required rows={5} value={contactData.message} onChange={e=>setContactData({...contactData, message: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white resize-none"></textarea>
                </div>
                <button disabled={createMessage.isPending} type="submit" className="w-full h-14 rounded-xl bg-primary text-background font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                  {createMessage.isPending ? 'Sending...' : <><Send size={18}/> Send Message</>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Company / Name</label>
                    <input required type="text" value={quoteData.name} onChange={e=>setQuoteData({...quoteData, name: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                    <input required type="email" value={quoteData.email} onChange={e=>setQuoteData({...quoteData, email: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Project Type</label>
                    <select required value={quoteData.projectType} onChange={e=>setQuoteData({...quoteData, projectType: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-white appearance-none">
                      <option value="" disabled>Select...</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Custom Software">Custom Software</option>
                      <option value="AI Integration">AI Integration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Budget Range</label>
                    <select required value={quoteData.budget} onChange={e=>setQuoteData({...quoteData, budget: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-white appearance-none">
                      <option value="" disabled>Select...</option>
                      <option value="<$5k">&lt; $5,000</option>
                      <option value="$5k-$10k">$5,000 - $10,000</option>
                      <option value="$10k-$25k">$10,000 - $25,000</option>
                      <option value="$25k+">$25,000+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Project Description</label>
                  <textarea required rows={5} placeholder="Tell us about your goals, timeline, and requirements..." value={quoteData.description} onChange={e=>setQuoteData({...quoteData, description: e.target.value})} className="w-full bg-black/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-secondary text-white resize-none"></textarea>
                </div>
                <button disabled={createQuote.isPending} type="submit" className="w-full h-14 rounded-xl bg-secondary text-white font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all">
                  {createQuote.isPending ? 'Submitting...' : 'Request Quote'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
