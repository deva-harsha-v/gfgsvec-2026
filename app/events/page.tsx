'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { EVENTS } from '@/lib/events';
import { Calendar, Tag, Trophy, Code, Users } from 'lucide-react';

export default function EventsPage() {
  return (
    <PublicLayout>
      <PageHeader title="Events & Workshops" subtitle="Contests, Hackathons & Bootcamps" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight">Chapter Event Series</h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed font-medium">
            Explore past hackathons, programming tests, web design sessions, and upcoming technical initiatives organized by GFG SVEC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EVENTS.map((evt) => (
            <div 
              key={evt.id} 
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono font-bold text-zinc-400">
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <Calendar size={12} />
                    <span>{evt.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Tag size={12} className="text-emerald-400" />
                    <span className="text-zinc-300">{evt.category}</span>
                  </span>
                </div>
                
                <h3 className="font-extrabold text-base md:text-lg text-white leading-tight uppercase">
                  {evt.title}
                </h3>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {evt.description}
                </p>
              </div>

              <div className="border-t border-zinc-800/60 pt-4 flex justify-between items-center text-[10px] font-mono font-bold uppercase text-zinc-500">
                <span>Status: Completed</span>
                <span className="text-emerald-400">GeeksforGeeks Event</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
