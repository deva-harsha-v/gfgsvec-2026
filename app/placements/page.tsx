'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { COLLEGE_METADATA, PLACEMENTS_OVERVIEW } from '@/lib/collegeData';
import { Award, Briefcase, CheckCircle, Handshake, Users, Phone } from 'lucide-react';

export default function PlacementsPage() {
  return (
    <PublicLayout>
      <PageHeader title="Training & Placements" subtitle="Build a Global Career" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        {/* Statistics Banner */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {PLACEMENTS_OVERVIEW.statistics.map((stat, idx) => (
            <div key={idx} className="bg-slate-900 text-white rounded-2xl p-5 text-center flex flex-col justify-center space-y-1 shadow-sm">
              <span className="text-xl md:text-2xl font-black text-blue-400">{stat.value}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-tight">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* Overview & Highlights */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Placement Cell Overview</h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              {PLACEMENTS_OVERVIEW.text}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {PLACEMENTS_OVERVIEW.highlights.map((highlight, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Placement */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-md">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Placement Desk</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              For corporate recruitment inquiries, campus placements coordination, or internship recruitment:
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono pt-1">
              <Phone className="w-4 h-4 text-blue-500" />
              <span className="font-extrabold">{COLLEGE_METADATA.placementsContact}</span>
            </div>
          </div>
        </section>

        {/* Top Recruiters */}
        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight text-center">Our Recruiting Partners</h2>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            {PLACEMENTS_OVERVIEW.recruiters.map((rec) => (
              <span 
                key={rec} 
                className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-600 shadow-sm"
              >
                {rec}
              </span>
            ))}
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
