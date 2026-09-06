'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const articles = [
    {
      title: "Mastering Graph Algorithms for Competitive Coding",
      author: "P. Vamsi Krishna",
      date: "August 2026",
      readTime: "5 min read",
      summary: "A practical guide on Breadth-First Search (BFS), Depth-First Search (DFS), and shortest path algorithms for intra-college coding contests."
    },
    {
      title: "Building Production Web Apps with Next.js & Tailwind CSS",
      author: "R. Harshavardhan",
      date: "July 2026",
      readTime: "7 min read",
      summary: "How to structure responsive, accessible web applications using modern Server Components and utility-first styling."
    },
    {
      title: "Creating Scalable Figma Component Systems for Student Clubs",
      author: "S. Ananya",
      date: "June 2026",
      readTime: "4 min read",
      summary: "Step-by-step approach to creating design tokens, typography scales, and poster components for event branding."
    }
  ];

  return (
    <PublicLayout>
      <PageHeader title="Blog & Articles" subtitle="Technical Insights by GFG SVEC" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight">Chapter Publications</h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed font-medium">
            Read technical articles, interview preparation guides, and design write-ups published by GFG SVEC leads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art, idx) => (
            <div key={idx} className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-colors shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 font-bold">
                  <Calendar size={12} />
                  <span>{art.date}</span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-extrabold text-base uppercase text-white leading-snug">{art.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">{art.summary}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500 text-[10px] font-bold">By {art.author}</span>
                <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <span>Read</span>
                  <ArrowRight size={10} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
