'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { EVENTS } from '@/lib/events';
import { Calendar, Tag } from 'lucide-react';

export default function EventsPage() {
  return (
    <PublicLayout>
      <PageHeader title="Events & Workshops" subtitle="Contests, Bootcamps & Hackathons" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-12">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display font-bold text-2xl md:text-4xl uppercase text-[#f8fafc] tracking-tight">Chapter Event Series</h2>
          <p className="text-xs md:text-sm text-gfg-muted leading-relaxed">
            Explore past hackathons, programming tests, web design sessions, and technical initiatives organized by GFG SVEC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EVENTS.map((evt) => (
            <div 
              key={evt.id} 
              className="bg-[#141820] border border-[#1e2632] rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-5 hover:border-gfg-emerald/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono font-bold text-gfg-muted">
                  <span className="flex items-center space-x-1 text-gfg-amber">
                    <Calendar size={12} />
                    <span>{evt.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Tag size={12} className="text-gfg-emerald" />
                    <span className="text-[#f1f5f9]">{evt.category}</span>
                  </span>
                </div>
                
                <h3 className="font-display font-bold text-lg md:text-xl text-[#f8fafc] uppercase leading-tight">
                  {evt.title}
                </h3>
                
                <p className="text-xs text-gfg-muted leading-relaxed font-normal">
                  {evt.description}
                </p>
              </div>

              <div className="border-t border-[#1e2632] pt-4 flex justify-between items-center text-[10px] font-mono font-bold uppercase text-gfg-muted">
                <span>Status: Completed</span>
                <span className="text-gfg-emerald">GeeksforGeeks Event</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
