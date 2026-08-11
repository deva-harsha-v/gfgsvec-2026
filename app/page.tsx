'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import ChapterCarousel from '@/components/ChapterCarousel';
import Countdown from '@/components/Countdown';
import { ArrowRight, Terminal, Globe, Calendar } from 'lucide-react';
import { RECRUITMENT_ROLES } from '@/lib/roles';

export default function Home() {
  const [targetTime, setTargetTime] = useState<string>('2026-08-10T14:00:00.000Z');
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  useEffect(() => {
    // Sync current status and target opening time from server
    fetch('/api/recruitment-status')
      .then((res) => res.json())
      .then((data) => {
        setTargetTime(data.targetTime);
        setIsOpen(data.isOpen);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching recruitment status:', err);
        setLoading(false);
      });
  }, []);

  const handleCountdownComplete = () => {
    setIsOpen(true);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sansSelection selection:bg-emerald-500/30 selection:text-emerald-400 relative">
      
      {/* Background library image with fading mask */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/college-building.png" 
          alt="Sri Vasavi Engineering College Building Background" 
          className="w-full h-full object-cover object-center opacity-[0.8]" 
        />
        {/* Dark mask overlay to blend it heavily into the background color */}
        <div className="absolute inset-0 bg-zinc-950/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
      </div>

      {/* Header Accent */}
      <div className="w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 relative z-10" />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col space-y-16 relative z-10">
        
        {/* Branding & Hero Section */}
        <Hero />

        {/* Countdown Timer Block */}
        <div className="w-full py-10 px-6 bg-zinc-900/30 border border-zinc-900 rounded-3xl backdrop-blur max-w-2xl mx-auto flex flex-col items-center">
          {loading ? (
            <div className="flex items-center space-x-2 text-zinc-500 font-mono text-xs uppercase tracking-widest py-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>Checking recruitment clock...</span>
            </div>
          ) : (
            <Countdown targetTimeStr={targetTime} onComplete={handleCountdownComplete} />
          )}

          {/* Opening Date Details Card */}
          <div className="mt-8 flex flex-col md:flex-row items-center gap-4 text-xs font-mono font-bold text-zinc-500 border-t border-zinc-800/40 pt-6 w-full justify-center">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-emerald-500/60" />
              <span>12 AUGUST 2026</span>
            </div>
            <span className="hidden md:inline text-zinc-700">•</span>
            <div className="flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-emerald-500/60" />
              <span>7:30 PM IST (Asia/Kolkata)</span>
            </div>
          </div>
        </div>

        {/* Live CTA Button Container */}
        {!loading && (
          <div className="flex flex-col items-center">
            {isOpen ? (
              <Link 
                href="/apply"
                className="group flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-wider uppercase px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 text-zinc-500 font-extrabold text-sm tracking-wider uppercase px-8 py-4 rounded-2xl cursor-not-allowed opacity-60"
              >
                <span>Applications Open Soon</span>
              </button>
            )}
          </div>
        )}

        {/* Chapter 1 Carousel Section */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <span className="text-emerald-500 font-mono text-[10px] font-bold tracking-[0.3em] uppercase block">Recruitment Campaign</span>
            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">Chapter 1 Materials</h2>
            <p className="text-zinc-500 text-xs md:text-sm max-w-md mx-auto font-medium">Explore each division and understand our campus body recruitment focus.</p>
          </div>
          <ChapterCarousel />
        </div>

        {/* Recruitment Roles Section */}
        <div className="space-y-8 pt-8 border-t border-zinc-900">
          <div className="text-center space-y-1">
            <span className="text-emerald-500 font-mono text-[10px] font-bold tracking-[0.3em] uppercase block">Explore Opportunities</span>
            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">Recruitment Roles</h2>
            <p className="text-zinc-500 text-xs md:text-sm max-w-md mx-auto font-medium">Click any role to see focus areas and description details.</p>
          </div>

          <div className="space-y-10 max-w-3xl mx-auto pt-4">
            
            {/* TECHNICAL ROLES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-[0.25em]">01 — Technical Roles</span>
                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider font-mono">Core Engineering</span>
              </div>
              
              <div className="divide-y divide-zinc-900">
                {RECRUITMENT_ROLES.filter(r => r.category === 'TECHNICAL').map((role) => {
                  const isExpanded = expandedRole === role.key;
                  return (
                    <div key={role.key} className="group py-5 transition-all">
                      <div 
                        onClick={() => setExpandedRole(isExpanded ? null : role.key)}
                        className="flex items-center justify-between cursor-pointer py-1.5"
                      >
                        <div className="flex items-baseline space-x-6">
                          <span className="text-zinc-600 group-hover:text-emerald-400 font-mono text-sm font-bold transition-colors duration-300">
                            {role.num}
                          </span>
                          <div className="space-y-1">
                            <h3 className="text-zinc-200 group-hover:text-white group-hover:translate-x-1 text-sm md:text-md font-bold uppercase tracking-wider transition-all duration-300">
                              {role.displayName}
                            </h3>
                            <p className="text-zinc-500 text-xs group-hover:text-zinc-400 transition-colors">
                              {role.shortLabel}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-zinc-600 group-hover:text-emerald-400 transition-all duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                            →
                          </span>
                        </div>
                      </div>

                      {/* Expandable Content Area */}
                      <div className={`overflow-hidden transition-all duration-350 ${isExpanded ? 'max-h-[350px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-12 pr-4 pb-2 space-y-4 text-xs md:text-sm">
                          <div className="h-[1px] bg-gradient-to-r from-emerald-500/20 to-transparent w-full" />
                          <div className="space-y-2">
                            <span className="text-emerald-500 font-mono text-[9px] font-bold tracking-widest uppercase block">Core Focus</span>
                            <p className="text-zinc-300 font-medium leading-relaxed">{role.focus}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-zinc-500 font-mono text-[9px] font-bold tracking-widest uppercase block">Role Description</span>
                            <p className="text-zinc-400 leading-relaxed font-normal">{role.description}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-zinc-500 font-mono text-[9px] font-bold tracking-widest uppercase block">Areas Include</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {role.areas.map((area) => (
                                <span key={area} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800/80 text-zinc-400 rounded-md text-[10px] font-semibold tracking-wide">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NON-TECHNICAL ROLES */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-300 font-mono text-[11px] font-bold uppercase tracking-[0.25em]">02 — Non-Technical Roles</span>
                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider font-mono">Operations & Branding</span>
              </div>
              
              <div className="divide-y divide-zinc-900">
                {RECRUITMENT_ROLES.filter(r => r.category === 'NON_TECHNICAL').map((role) => {
                  const isExpanded = expandedRole === role.key;
                  return (
                    <div key={role.key} className="group py-5 transition-all">
                      <div 
                        onClick={() => setExpandedRole(isExpanded ? null : role.key)}
                        className="flex items-center justify-between cursor-pointer py-1.5"
                      >
                        <div className="flex items-baseline space-x-6">
                          <span className="text-zinc-600 group-hover:text-zinc-300 font-mono text-sm font-bold transition-colors duration-300">
                            {role.num}
                          </span>
                          <div className="space-y-1">
                            <h3 className="text-zinc-200 group-hover:text-white group-hover:translate-x-1 text-sm md:text-md font-bold uppercase tracking-wider transition-all duration-300">
                              {role.displayName}
                            </h3>
                            <p className="text-zinc-500 text-xs group-hover:text-zinc-400 transition-colors">
                              {role.shortLabel}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-zinc-600 group-hover:text-emerald-500 transition-all duration-300 ${isExpanded ? 'rotate-90 text-emerald-400' : ''}`}>
                            →
                          </span>
                        </div>
                      </div>

                      {/* Expandable Content Area */}
                      <div className={`overflow-hidden transition-all duration-350 ${isExpanded ? 'max-h-[350px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-12 pr-4 pb-2 space-y-4 text-xs md:text-sm">
                          <div className="h-[1px] bg-zinc-800 w-full" />
                          <div className="space-y-2">
                            <span className="text-zinc-400 font-mono text-[9px] font-bold tracking-widest uppercase block">Core Focus</span>
                            <p className="text-zinc-300 font-medium leading-relaxed">{role.focus}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-zinc-500 font-mono text-[9px] font-bold tracking-widest uppercase block">Role Description</span>
                            <p className="text-zinc-400 leading-relaxed font-normal">{role.description}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-zinc-500 font-mono text-[9px] font-bold tracking-widest uppercase block">Areas Include</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {role.areas.map((area) => (
                                <span key={area} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800/80 text-zinc-400 rounded-md text-[10px] font-semibold tracking-wide">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Footer Details */}
      <footer className="w-full bg-zinc-950 border-t border-zinc-900 py-6 px-6 text-center text-xs font-mono font-bold text-zinc-600">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5">
            <span>GFG Campus Club</span>
          </div>
          <Link href="/admin/login" className="hover:text-emerald-500 transition-colors uppercase">
             SVEC Chapter © 2026
          </Link>
        </div>
      </footer>

    </main>
  );
}
export const dynamic = 'force-dynamic';
