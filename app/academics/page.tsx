'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { BookOpen, Calendar, Award, FileText, CheckCircle } from 'lucide-react';

export default function AcademicsPage() {
  return (
    <PublicLayout>
      <PageHeader title="Academics" subtitle="Academic Programs & Regulations" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        {/* Programs Catalog */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Academic Programs Offered</h2>
            
            <div className="space-y-4">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-blue-600">
                  <BookOpen size={18} />
                  <h3 className="font-extrabold text-sm uppercase text-slate-800">Undergraduate Programs (B.Tech)</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  We offer 4-year B.Tech programs in major engineering branches designed as per UGC autonomous guidelines. The curriculum emphasizes core basics, mathematical analysis, and hands-on designs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 pt-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Computer Science & Engineering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>CSE (Artificial Intelligence & ML)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Electronics & Communication Engineering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Electrical & Electronics Engineering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Mechanical Engineering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Civil Engineering</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Award size={18} />
                  <h3 className="font-extrabold text-sm uppercase text-slate-800">Postgraduate Programs (M.Tech & MBA)</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Focused PG courses aligned towards specialization, research compilation, and management concepts. Includes dissertation semesters and project internship allocations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 pt-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>M.Tech - Computer Science & Engineering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>M.Tech - VLSI & Embedded Systems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>M.Tech - Power Systems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Master of Business Administration (MBA)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Guidelines */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
              <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Quick Resources</h3>
              <div className="space-y-3.5 text-xs text-slate-600 font-bold uppercase tracking-wider">
                <a href="#" className="flex items-center space-x-2.5 p-2 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Academic Regulations (V22)</span>
                </a>
                <a href="#" className="flex items-center space-x-2.5 p-2 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Academic Calendars</span>
                </a>
                <a href="#" className="flex items-center space-x-2.5 p-2 bg-slate-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Syllabus Books (All Branches)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
