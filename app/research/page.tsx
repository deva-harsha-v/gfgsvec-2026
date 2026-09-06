'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { Award, Compass, Eye, Microscope, ShieldCheck } from 'lucide-react';

export default function ResearchPage() {
  return (
    <PublicLayout>
      <PageHeader title="Research & Development" subtitle="Innovation and Scientific Inquiry" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        {/* Research summary */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">R&D Activities Overview</h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              The Research and Development (R&D) cell at Sri Vasavi Engineering College motivates scientific inquiry, experimental prototype designs, patent compilations, and technical publications among academic members and student teams.
            </p>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              Through strategic funding support, computing nodes, and partnerships with national laboratories, our departments work on machine learning models, VLSI components testing, green concrete design, electric vehicle batteries, and IoT smart cities systems.
            </p>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">R&D Highlights</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-xs">
                <Microscope className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-800">Research Publications</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Over 200 papers published in Scopus/SCI journals during recent academic years.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs">
                <Award className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-800">Patent Publications</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Multiple design and utility patents registered and published at the Indian Patent Office.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
