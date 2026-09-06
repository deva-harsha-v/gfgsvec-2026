'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { NOTICES } from '@/lib/notices';
import { Calendar, FileText, Bell } from 'lucide-react';

export default function NoticesPage() {
  return (
    <PublicLayout>
      <PageHeader title="Notices Board" subtitle="Official Announcements & Circulars" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-8">
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-4">
            <Bell className="w-5 h-5 text-blue-500 animate-bounce" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Latest Notifications</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {NOTICES.map((notice) => (
              <div key={notice.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center space-x-2 text-[10px] font-mono font-bold">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                      {notice.category}
                    </span>
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Calendar size={10} />
                      <span>{notice.date}</span>
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-700 leading-snug">
                    {notice.title}
                  </h4>
                </div>

                <a 
                  href={notice.link || '#'} 
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-center shrink-0"
                >
                  <FileText size={12} />
                  <span>View PDF</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
