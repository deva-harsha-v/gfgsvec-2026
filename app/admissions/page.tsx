'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { COLLEGE_METADATA, ADMISSIONS_INFO } from '@/lib/collegeData';
import { Landmark, FileText, Phone, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdmissionsPage() {
  return (
    <PublicLayout>
      <PageHeader title="Admissions 2026" subtitle="Join Sri Vasavi Engineering College" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        {/* Core Eligibility & Process info */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Admissions Guidelines</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BTech admissions */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm uppercase text-blue-600 flex items-center space-x-1.5">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm" />
                  <span>B.Tech Admissions</span>
                </h3>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <p><strong>Eligibility:</strong> {ADMISSIONS_INFO.btech.eligibility}</p>
                  <p><strong>Process:</strong> {ADMISSIONS_INFO.btech.process}</p>
                </div>
              </div>

              {/* MTech Admissions */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm uppercase text-blue-600 flex items-center space-x-1.5">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm" />
                  <span>M.Tech Admissions</span>
                </h3>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <p><strong>Eligibility:</strong> {ADMISSIONS_INFO.mtech.eligibility}</p>
                  <p><strong>Process:</strong> {ADMISSIONS_INFO.mtech.process}</p>
                </div>
              </div>
            </div>

            {/* Fee structure placeholder */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 space-y-4">
              <h3 className="font-extrabold text-sm uppercase text-slate-800 flex items-center space-x-2">
                <Landmark className="w-4 h-4 text-blue-600" />
                <span>Annual Fee Structure</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                The tuition fees for B.Tech, M.Tech, and MBA courses are configured in accordance with the AP Admission and Fee Regulatory Committee (AFRC) guidelines. For detailed breakdown of hostel, transport, and administrative fees, please download the circular or contact our office.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5">
                  <FileText size={12} />
                  <span>Download Fee Structure PDF</span>
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar Documents & Contact */}
          <div className="space-y-8">
            {/* Required Documents Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Required Documents</h3>
              <ul className="space-y-2.5 text-[10px] sm:text-xs text-slate-600 font-medium">
                {ADMISSIONS_INFO.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-md">
              <h3 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Admissions Office</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Contact our helpline for counseling guidance, category-B seat allocations, and application forms:
              </p>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="font-extrabold">{COLLEGE_METADATA.admissionsContact}</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
