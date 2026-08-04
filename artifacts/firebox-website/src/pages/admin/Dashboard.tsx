import React from 'react';
import { useGetDashboardStats } from '@workspace/api-client-react';
import { Layers, Image as ImageIcon, Video, FileText, Star, MessageSquare, FileSignature, Mail, Users, Briefcase } from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Loading dashboard data...</div>;

  const statCards = [
    { label: 'Total Services', value: stats?.totalServices || 0, icon: Layers, href: '/admin/services', color: 'text-blue-500' },
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: ImageIcon, href: '/admin/portfolio', color: 'text-purple-500' },
    { label: 'Tutorials', value: stats?.totalTutorials || 0, icon: Video, href: '/admin/tutorials', color: 'text-red-500' },
    { label: 'Blog Posts', value: stats?.totalBlogPosts || 0, icon: FileText, href: '/admin/blog', color: 'text-green-500' },
    { label: 'Jobs', value: stats?.totalJobs || 0, icon: Briefcase, href: '/admin/jobs', color: 'text-orange-500' },
    { label: 'Total Reviews', value: stats?.totalReviews || 0, icon: Star, href: '/admin/reviews', color: 'text-yellow-500' },
    { label: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: Star, href: '/admin/reviews', color: 'text-yellow-600' },
    { label: 'Messages', value: stats?.totalMessages || 0, icon: MessageSquare, href: '/admin/messages', color: 'text-indigo-500' },
    { label: 'Quotes Requests', value: stats?.totalQuotes || 0, icon: FileSignature, href: '/admin/quotes', color: 'text-cyan-500' },
    { label: 'Subscribers', value: stats?.totalSubscribers || 0, icon: Mail, href: '/admin/newsletter', color: 'text-pink-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.href} className="block glass-panel p-6 rounded-2xl hover:border-primary/50 transition-all hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-muted/40 ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="text-3xl font-display font-bold">{stat.value}</div>
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </Link>
          );
        })}
        
        <div className="block glass-panel-glow p-6 rounded-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary/20 text-primary">
              <Star size={24} />
            </div>
            <div className="text-3xl font-display font-bold">{stats?.avgRating?.toFixed(1) || 0}</div>
          </div>
          <div className="text-muted-foreground font-medium">Average Rating</div>
        </div>
      </div>
    </div>
  );
}
