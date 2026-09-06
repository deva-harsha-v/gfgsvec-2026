'use client';

import { useParams } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { DEPARTMENTS } from '@/lib/departments';
import { FACULTY_MEMBERS } from '@/lib/faculty';
import { BookOpen, Calendar, Mail, Phone, AlertTriangle, ArrowLeft, Bookmark, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DepartmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const dept = DEPARTMENTS.find((d) => d.id === id);

  if (!dept) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto text-center py-20 space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-800 uppercase">Department Not Found</h2>
          <p className="text-slate-500 text-xs font-medium">The department ID you requested does not exist in our academic directory.</p>
          <Link href="/departments" className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl">
            <ArrowLeft size={12} />
            <span>All Departments</span>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  // Filter faculty members for this department
  const facultyList = FACULTY_MEMBERS.filter((f) => f.departmentId === dept.id);

  return (
    <PublicLayout>
      <PageHeader title={dept.name} subtitle={`Department of ${dept.shortName}`} />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-black uppercase text-slate-800 tracking-tight">About Department</h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                {dept.description}
              </p>
            </section>

            {/* Vision and Mission */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="bg-blue-550/5 border border-blue-500/10 rounded-3xl p-6 space-y-3">
                <h3 className="font-extrabold text-xs uppercase text-blue-600 tracking-wider">Vision</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{dept.vision}</p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-3">
                <h3 className="font-extrabold text-xs uppercase text-slate-800 tracking-wider">Mission</h3>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  {dept.mission.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 shrink-0 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* HOD Message */}
            <section className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4">
              <h3 className="font-extrabold text-xs uppercase text-slate-800">Message from HOD</h3>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed italic font-medium">
                    &quot;{dept.hodMessage}&quot;
                  </p>
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono">
                    — {dept.hodName}, {dept.hodTitle}
                  </div>
                </div>
              </div>
            </section>

            {/* Laboratories */}
            <section className="space-y-6 pt-4 border-t border-slate-100">
              <h2 className="text-lg md:text-xl font-black uppercase text-slate-800 tracking-tight">Academic Laboratories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dept.labs.map((lab, index) => (
                  <div key={index} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2 shadow-sm">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">{lab.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{lab.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Faculty Members list */}
            {facultyList.length > 0 && (
              <section className="space-y-6 pt-4 border-t border-slate-100">
                <h2 className="text-lg md:text-xl font-black uppercase text-slate-800 tracking-tight">Department Faculty</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facultyList.map((fac) => (
                    <div key={fac.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        {fac.name.charAt(0)}
                      </div>
                      <div className="text-xs">
                        <h4 className="font-extrabold text-slate-850">{fac.name}</h4>
                        <p className="text-[10px] text-slate-500">{fac.designation}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{fac.qualification} • {fac.specialization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar Programs & Contact */}
          <div className="space-y-8">
            {/* Programs intake */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Programs Offered</h3>
              <div className="space-y-3">
                {dept.programs.map((prog, index) => (
                  <div key={index} className="py-2.5 border-b border-slate-50 last:border-0 flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-700 text-[11px] leading-tight max-w-[180px]">{prog.name}</span>
                    <span className="bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded text-[10px] shrink-0">Intake: {prog.intake}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Areas */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Research Focus</h3>
              <ul className="space-y-2 text-xs font-bold text-slate-600">
                {dept.researchAreas.map((res, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Bookmark className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact details */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-md">
              <h3 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Department Office</h3>
              <div className="space-y-3 text-xs text-slate-400 font-medium">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a href={`mailto:${dept.contactEmail}`} className="hover:text-blue-500 transition-colors underline font-mono">{dept.contactEmail}</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="font-mono">{dept.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PublicLayout>
  );
}
export const dynamic = 'force-dynamic';
