'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { CLUBS } from '@/lib/clubs';
import { ArrowRight, Award, Compass, Users } from 'lucide-react';

export default function CampusLifePage() {
  return (
    <PublicLayout>
      <PageHeader title="Campus Life" subtitle="Clubs & Student Activities" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        {/* Core summary */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Active Student Communities</h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              Education at Sri Vasavi Engineering College extends beyond the boundaries of lecture halls. We promote student innovation and organization through dynamic technical and non-technical societies.
            </p>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              Students can participate in coding contests, cultural festivals, sports meets, design tournaments, and rural service programs. These opportunities cultivate leadership, technical competence, and community spirit.
            </p>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Student Activities</h3>
            <ul className="space-y-2.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <li className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-blue-500" />
                <span>Annual Technical Fests</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-blue-500" />
                <span>Hackathons & Coding Camps</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Rural NSS Service Drives</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Clubs Directory */}
        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Clubs & Societies Directory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLUBS.map((club) => (
              <div 
                key={club.id} 
                className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm"
              >
                <div className="space-y-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase font-mono ${
                    club.category === 'TECHNICAL' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {club.category} CLUB
                  </span>
                  <h3 className="font-extrabold text-sm uppercase text-slate-800 leading-tight">
                    {club.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                    {club.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    Lead: {club.lead}
                  </span>
                  
                  {club.route ? (
                    <Link 
                      href={club.route}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1 transition-all"
                    >
                      <span>Club Page</span>
                      <ArrowRight size={10} />
                    </Link>
                  ) : (
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">
                      Info Desk Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
