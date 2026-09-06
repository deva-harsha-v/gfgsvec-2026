'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { EVENTS } from '@/lib/events';
import { Calendar, Tag } from 'lucide-react';

export default function NewsEventsPage() {
  return (
    <PublicLayout>
      <PageHeader title="News & Events" subtitle="Latest Happenings at SVEC" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EVENTS.map((evt) => (
            <div 
              key={evt.id} 
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono font-bold text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar size={12} className="text-blue-500" />
                    <span>{evt.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Tag size={12} className="text-blue-500" />
                    <span className="text-blue-600">{evt.category}</span>
                  </span>
                </div>
                
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-tight uppercase">
                  {evt.title}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {evt.description}
                </p>
              </div>

              <div className="border-t border-slate-50 pt-4 flex justify-end">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 font-mono">
                  Official Press Release
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
