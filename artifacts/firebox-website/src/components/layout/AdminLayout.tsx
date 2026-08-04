import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Layers, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Star, 
  MessageSquare, 
  FileSignature, 
  Mail, 
  Users, 
  HelpCircle, 
  Briefcase, 
  Settings,
  Globe
} from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
  { href: '/admin/tutorials', label: 'Tutorials', icon: Video },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/quotes', label: 'Quotes', icon: FileSignature },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/faq', label: 'FAQ & Clients', icon: HelpCircle },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-white/10 flex-shrink-0 flex flex-col h-auto md:h-screen md:sticky md:top-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-sm text-primary-foreground">
              FTS
            </div>
            <span className="font-bold text-lg tracking-tight">Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const active = location === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  active 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors text-sm font-medium"
          >
            <Globe size={16} />
            View Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 bg-card/50 backdrop-blur flex items-center px-6 sticky top-0 z-10">
          <h1 className="text-lg font-medium text-white/90">
            {adminLinks.find(l => l.href === location)?.label || 'Dashboard'}
          </h1>
        </header>
        <div className="flex-1 p-6 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
