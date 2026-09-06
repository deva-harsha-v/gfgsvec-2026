'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { FACULTY_MEMBERS } from '@/lib/faculty';
import { DEPARTMENTS } from '@/lib/departments';
import { Mail, Shield } from 'lucide-react';

export default function FacultyPage() {
  return (
    <PublicLayout>
      <PageHeader title="Faculty Profiles" subtitle="Experienced Academic Staff" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Our Educators</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2 leading-relaxed font-medium">
            Sri Vasavi Engineering College is home to highly qualified professors, researchers, and technical instructors dedicated to guiding students through comprehensive engineering designs.
          </p>
        </div>

        {/* Grouped by department */}
        {DEPARTMENTS.map((dept) => {
          const deptFaculty = FACULTY_MEMBERS.filter(f => f.departmentId === dept.id);
          if (deptFaculty.length === 0) return null;
          
          return (
            <div key={dept.id} className="space-y-6 pt-6 border-t border-slate-100 first:border-0 first:pt-0">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-4.5 bg-blue-600 rounded-sm shrink-0" />
                <h3 className="text-sm font-extrabold uppercase text-slate-800 tracking-widest font-mono">
                  {dept.name} ({dept.shortName})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {deptFaculty.map((fac) => (
                  <div 
                    key={fac.id} 
                    className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col items-center text-center shadow-sm space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-100">
                      {fac.name.charAt(fac.name.startsWith('Dr.') ? 4 : 0)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-slate-800 leading-snug">{fac.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">{fac.designation}</p>
                      <p className="text-[9px] text-slate-400 font-mono leading-relaxed pt-1">
                        {fac.qualification} <br />
                        Spec: {fac.specialization}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PublicLayout>
  );
}
