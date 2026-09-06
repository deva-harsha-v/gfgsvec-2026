'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { Code, Users, ArrowUpRight, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageHeader title="About Our Chapter" subtitle="GeeksforGeeks SVEC Student Chapter" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
        
        {/* Core Narrative */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display font-bold text-2xl md:text-4xl uppercase text-[#f8fafc] tracking-tight">
              Fostering Innovators & Tech Builders
            </h2>
            <p className="text-xs md:text-sm text-gfg-muted leading-relaxed">
              The GeeksforGeeks Student Chapter at Sri Vasavi Engineering College (SVEC) was established to empower engineering students through technical excellence, algorithm problem-solving, software engineering, and peer mentorship.
            </p>
            <p className="text-xs md:text-sm text-gfg-muted leading-relaxed">
              We organize intra-college DSA contests, full-stack web bootcamps, UI/UX design challenges, and open-source project sprints. Our chapter serves as a launching pad for students aiming for top-tier product placements and technical leadership.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-[#141820] border border-[#1e2632] rounded-2xl p-5 space-y-2">
                <Code className="w-5 h-5 text-gfg-emerald" />
                <h4 className="font-display font-bold text-xs uppercase text-[#f8fafc]">Algorithmic Training</h4>
                <p className="text-[11px] text-gfg-muted leading-relaxed">Data structures, competitive programming, and test preparations.</p>
              </div>
              <div className="bg-[#141820] border border-[#1e2632] rounded-2xl p-5 space-y-2">
                <Layers className="w-5 h-5 text-gfg-emerald" />
                <h4 className="font-display font-bold text-xs uppercase text-[#f8fafc]">Product Engineering</h4>
                <p className="text-[11px] text-gfg-muted leading-relaxed">Web applications, APIs, UI/UX systems, and production code.</p>
              </div>
              <div className="bg-[#141820] border border-[#1e2632] rounded-2xl p-5 space-y-2">
                <Users className="w-5 h-5 text-gfg-emerald" />
                <h4 className="font-display font-bold text-xs uppercase text-[#f8fafc]">Community & Growth</h4>
                <p className="text-[11px] text-gfg-muted leading-relaxed">Networking, speaker sessions, workshops, and peer mentorship.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#141820] border border-[#1e2632] rounded-3xl p-6 space-y-6 shadow-xl">
            <h3 className="text-[#f8fafc] text-xs font-display font-extrabold uppercase tracking-wider border-l-2 border-gfg-amber pl-2.5">
              Chapter Highlights
            </h3>
            <div className="space-y-4 text-xs text-gfg-muted">
              <div className="space-y-1">
                <span className="text-gfg-emerald font-mono text-[11px] font-bold uppercase">500+ Active Members</span>
                <p className="text-[11px] text-gfg-muted">Students across CSE, ECE, EEE, ME, and Civil branches participating in chapter events.</p>
              </div>
              <div className="space-y-1 border-t border-[#1e2632] pt-3">
                <span className="text-gfg-emerald font-mono text-[11px] font-bold uppercase">15+ Annual Events</span>
                <p className="text-[11px] text-gfg-muted">Coding sprints, design tournaments, hackathons, and guest lectures.</p>
              </div>
              <div className="space-y-1 border-t border-[#1e2632] pt-3">
                <span className="text-gfg-emerald font-mono text-[11px] font-bold uppercase">Industry Placements</span>
                <p className="text-[11px] text-gfg-muted">Past chapter leads working at product firms, MNCs, and technology startups.</p>
              </div>
            </div>

            <Link 
              href="/clubs/gfg/hiring/apply"
              className="w-full py-3.5 bg-gfg-emerald hover:bg-gfg-glow text-[#0c0e12] rounded-xl text-center text-xs font-display font-extrabold uppercase tracking-wider block transition-colors shadow-lg shadow-gfg-emerald/20"
            >
              Apply for Board 2026
            </Link>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
