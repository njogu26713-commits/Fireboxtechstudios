import React from 'react';
import { useRoute, Link } from 'wouter';
import { useGetBlogPost } from '@workspace/api-client-react';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

export default function BlogPost() {
  const [, params] = useRoute('/blog/:id');
  const id = params?.id;

  const { data: post, isLoading } = useGetBlogPost(id as string, {
    query: { enabled: !!id }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-3xl animate-pulse space-y-6">
        <div className="h-8 bg-white/10 rounded w-1/4"></div>
        <div className="h-16 bg-white/10 rounded w-full"></div>
        <div className="aspect-[21/9] bg-white/10 rounded-3xl w-full"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Article Not Found</h1>
        <Link href="/blog" className="text-primary hover:underline">Return to Blog</Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <article className="pb-24">
      <div className="container mx-auto px-4 md:px-6 pt-12 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <div className="mb-8">
          <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-mono font-medium mb-6 inline-block">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/50 font-mono border-b border-white/10 pb-8">
            <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            {post.authorName && <div className="flex items-center gap-2"><User size={16} /> {post.authorName}</div>}
            
            <button 
              className="ml-auto flex items-center gap-2 hover:text-white transition-colors"
              onClick={() => navigator.clipboard.writeText(shareUrl)}
            >
              <Share2 size={16} /> Copy Link
            </button>
          </div>
        </div>

        {post.featuredImageUrl && (
          <div className="rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl">
            <img src={post.featuredImageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[600px]" />
          </div>
        )}

        {/* Minimal rich text rendering. In real life, use a markdown or HTML parser like html-react-parser */}
        <div 
          className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-secondary prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && (
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-2">
            {post.tags.split(',').map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/5 rounded text-sm text-white/60">#{tag.trim()}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
