'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { DEPARTMENTS } from '@/lib/departments';
import { ArrowRight, BookOpen, GraduationCap, Users } from 'lucide-react';

export default function DepartmentsPage() {
  return (
    <PublicLayout>
      <PageHeader title="Academic Departments" subtitle="Engineering Branches at SVEC" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Our Programs</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2 leading-relaxed font-medium">
            Sri Vasavi Engineering College offers autonomous engineering divisions equipped with advanced software tools, industrial labs, research facilities, and experienced academic members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {DEPARTMENTS.map((dept) => (
            <div 
              key={dept.id} 
              className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold tracking-wider uppercase font-mono">
                  {dept.shortName} Department
                </span>
                <h3 className="font-extrabold text-sm uppercase text-slate-800 leading-tight">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                  {dept.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  HOD: {dept.hodName}
                </span>
                <Link 
                  href={`/departments/${dept.id}`}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1 transition-all"
                >
                  <span>Explore</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
