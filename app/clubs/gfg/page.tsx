'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import { ArrowRight, Code, Trophy, Users, Calendar, Mail, Globe, ExternalLink, Sparkles } from 'lucide-react';
import { CLUBS } from '@/lib/clubs';

export default function GfgClubPage() {
  const [recruitmentActive, setRecruitmentActive] = useState(false);
  const clubData = CLUBS.find(c => c.id === 'gfg');

  useEffect(() => {
    fetch('/api/recruitment-status')
      .then(res => res.json())
      .then(data => {
        if (data.isOpen && !data.isClosed) {
          setRecruitmentActive(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PublicLayout>
      {/* Banner */}
      <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold tracking-widest uppercase font-mono">
                Official Student Community
              </span>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                GeeksforGeeks <span className="text-emerald-400">SVEC</span> Chapter
              </h1>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                The premier coding and technical society of Sri Vasavi Engineering College. We foster a community of software engineers, competitive programmers, and designers striving for tech excellence.
              </p>
            </div>
            
            {/* Logo placeholder */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-950 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center text-emerald-400 shadow-xl">
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
                <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recruitment Banner Callout */}
      {recruitmentActive && (
        <div className="bg-emerald-500 py-4 px-6 text-white font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 shrink-0 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Active recruitment is open! Take the first step in joining GFG SVEC executive board.
              </span>
            </div>
            <Link 
              href="/clubs/gfg/hiring"
              className="px-4 py-1.5 bg-slate-950 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shrink-0"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}

      {/* Content body */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        {/* Core details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">About GFG Campus Body</h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              GeeksforGeeks student chapter at Sri Vasavi Engineering College serves as an interactive community space for engineering students to hone their coding competencies. We bring together academic rigor and creative problem solving.
            </p>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              We focus on core domains: Competitive Programming (DSA contests), digital software development (web, systems, databases), visual design, content curation, and social outreach. Members get exclusive learning materials, coding challenges, and corporate networking access.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                <Code className="w-8 h-8 text-emerald-500 mb-3" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Weekly Coding</h4>
                <p className="text-[10px] text-slate-500 mt-1">Algorithmic tests and contest preparations</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                <Users className="w-8 h-8 text-emerald-500 mb-3" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Tech Mentoring</h4>
                <p className="text-[10px] text-slate-500 mt-1">Peer sessions and interview preparations</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
                <Trophy className="w-8 h-8 text-emerald-500 mb-3" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Hackathons</h4>
                <p className="text-[10px] text-slate-500 mt-1">Annual campus-wide software challenges</p>
              </div>
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider border-l-2 border-emerald-500 pl-2">Club Coordinates</h3>
            <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Chapter Lead:</span>
                <span className="text-slate-800 font-bold">{clubData?.lead || 'President'}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-800 font-bold">Technical Community</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Contact Email:</span>
                <a href={`mailto:${clubData?.contactEmail}`} className="text-emerald-600 hover:text-emerald-500 font-bold underline">
                  {clubData?.contactEmail}
                </a>
              </li>
            </ul>

            <Link 
              href="/clubs/gfg/hiring"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center text-xs font-black uppercase tracking-widest block transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Recruitment Portal</span>
              <ArrowRight size={12} />
            </Link>
          </div>

        </div>

        {/* Section 2: Club Activities */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Recent Club Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-600 font-bold">
                <Calendar size={12} />
                <span>WEEKLY EVENT</span>
              </div>
              <h3 className="font-extrabold text-sm uppercase text-slate-850">SVEC Geeks coding Contest</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Every Saturday, the club hosts programming tests on the GFG compiler evaluating array logic, list manipulations, graphs, and dynamically mapped variables.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-600 font-bold">
                <Calendar size={12} />
                <span>WORKSHOP SERIES</span>
              </div>
              <h3 className="font-extrabold text-sm uppercase text-slate-850">DSA & Web framework bootcamps</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Experienced seniors conduct peer tutoring workshops breaking down complex data structure operations, backend databases, API development, and Figma layouts.
              </p>
            </div>
          </div>
        </div>

      </div>
    </PublicLayout>
  );
}
