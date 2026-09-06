'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { FileText, Download } from 'lucide-react';

export default function DownloadsPage() {
  const downloadItems = [
    { title: 'B.Tech Autonomous Academic Regulations V22', category: 'ACADEMIC' },
    { title: 'B.Tech Category-B Admission Registration Form 2026', category: 'ADMISSIONS' },
    { title: 'JNTUK Examinations Revaluation Registration Form', category: 'EXAMS' },
    { title: 'College Bus Route Schedule & Timings Map', category: 'GENERAL' },
    { title: 'NSS Student Volunteer Registration Application Form', category: 'GENERAL' }
  ];

  return (
    <PublicLayout>
      <PageHeader title="Downloads Repository" subtitle="Official Form templates & Syllabus Books" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-8">
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-4">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Document Resources</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {downloadItems.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-mono font-bold uppercase">
                    {item.category}
                  </span>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-700 leading-snug">
                    {item.title}
                  </h4>
                </div>

                <a 
                  href="#" 
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-center shrink-0"
                >
                  <Download size={12} />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
