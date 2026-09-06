'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { Code, Trophy, Users, ShieldCheck, ArrowRight, Terminal, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageHeader title="About Our Chapter" subtitle="GeeksforGeeks SVEC Student Body" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        {/* Core Narrative */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight">
              Fostering Innovators & Tech Builders
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-medium">
              The GeeksforGeeks Student Chapter at Sri Vasavi Engineering College (SVEC) was established to empower engineering students through technical excellence, algorithm problem-solving, software engineering, and peer mentorship.
            </p>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-medium">
              We organize intra-college DSA contests, full-stack web bootcamps, UI/UX design challenges, and open-source project sprints. Our chapter serves as a launching pad for students aiming for top-tier product placements and technical leadership.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <Code className="w-6 h-6 text-emerald-400" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">Algorithmic Training</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Data structures, competitive programming, and test preparations.</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <Layers className="w-6 h-6 text-emerald-400" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">Product Engineering</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Web applications, APIs, UI/UX systems, and production code.</p>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <Users className="w-6 h-6 text-emerald-400" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">Community & Growth</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Networking, speaker sessions, workshops, and peer mentorship.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-emerald-500 pl-2">Chapter Highlights</h3>
            <div className="space-y-4 text-xs font-medium text-zinc-300">
              <div className="space-y-1">
                <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase">500+ Active Members</span>
                <p className="text-[11px] text-zinc-400">Students across CSE, ECE, EEE, ME, and Civil branches participating in chapter events.</p>
              </div>
              <div className="space-y-1 border-t border-zinc-800/60 pt-3">
                <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase">15+ Annual Events</span>
                <p className="text-[11px] text-zinc-400">Coding sprints, design tournaments, hackathons, and guest lectures.</p>
              </div>
              <div className="space-y-1 border-t border-zinc-800/60 pt-3">
                <span className="text-emerald-400 font-mono text-[10px] font-bold uppercase">Industry Placements</span>
                <p className="text-[11px] text-zinc-400">Past chapter leads working at product firms, MNCs, and technology startups.</p>
              </div>
            </div>

            <Link 
              href="/clubs/gfg/hiring/apply"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider block transition-colors shadow-lg shadow-emerald-500/20"
            >
              Apply for Board 2026
            </Link>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
