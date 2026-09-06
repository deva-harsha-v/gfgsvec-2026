'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import ChapterCarousel from '@/components/ChapterCarousel';
import Countdown from '@/components/Countdown';
import TestimonialsMarquee from '@/components/TestimonialsMarquee';
import { 
  ArrowUpRight, Code, Trophy, Users, 
  Terminal, Layers, CheckCircle2, ChevronRight, ChevronDown 
} from 'lucide-react';
import { RECRUITMENT_ROLES } from '@/lib/roles';

export default function GfgHomePage() {
  const [targetTime, setTargetTime] = useState<string>('2026-08-12T13:30:00.000Z');
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCycle, setActiveCycle] = useState<{
    title: string;
    shortDescription: string;
    posterImageUrl: string | null;
  } | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/recruitment-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.cycle) {
          setActiveCycle({
            title: data.cycle.title,
            shortDescription: data.cycle.shortDescription,
            posterImageUrl: data.cycle.posterImageUrl,
          });
        }
        if (data.startTime) setTargetTime(data.startTime);
        setIsOpen(data.isOpen);
        setIsClosed(data.isClosed);
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

  const testimonials = [
    {
      quote: "Joining GFG SVEC in my 2nd year was the single best decision for my technical growth. The DSA bootcamps and team hackathons prepared me directly for product interviews.",
      name: "K. Teja Swaroop",
      role: "Lead Developer (Batch of 2025)",
      company: "Placed at TCS Digital",
      initials: "TS",
      accentBg: "bg-[#00b964]"
    },
    {
      quote: "The design and non-tech tracks gave me hands-on leadership experience. Organizing campus coding contests taught me event management, branding, and team coordination.",
      name: "S. Ananya",
      role: "Design & Media Lead (Batch of 2025)",
      company: "UI/UX Consultant",
      initials: "SA",
      accentBg: "bg-[#f59e0b]"
    },
    {
      quote: "GFG Student Chapter is a community of passionate builders. You don't just solve problems on paper; you build real software tools for the campus.",
      name: "P. Vamsi Krishna",
      role: "Competitive Programming Lead",
      company: "Placed at DXC Technology",
      initials: "VK",
      accentBg: "bg-[#06b6d4]"
    },
    {
      quote: "Organizing statewide hackathons and managing speaker logistics expanded my professional network immensely before graduation.",
      name: "M. Sai Ram",
      role: "Outreach Lead (Batch of 2025)",
      company: "Public Relations Executive",
      initials: "SR",
      accentBg: "bg-[#8b5cf6]"
    }
  ];

  const featuredProjects = [
    {
      title: "SVEC Scan-Based Attendance Portal",
      category: "Full Stack & Hardware",
      description: "An automated barcode/QR verification engine for real-time interview desk check-ins and session exports.",
      tech: ["Next.js", "PostgreSQL", "Prisma", "Tailwind"]
    },
    {
      title: "Geeks Coding Contest Evaluator",
      category: "Algorithmic Tool",
      description: "Custom leaderboard calculator and problem rank scraper built for intra-college algorithmic contests.",
      tech: ["Node.js", "Python", "REST API"]
    },
    {
      title: "Chapter Design & Event Assets",
      category: "Visual Identity",
      description: "Brand guidelines, Figma component libraries, and visual posters created for GFG SVEC chapter events.",
      tech: ["Figma", "Illustrator", "UI Design"]
    }
  ];

  return (
    <PublicLayout>
      {/* ---------------------------------------------------- */}
      {/* 3. HERO SECTION (PATTERN #3) */}
      {/* ---------------------------------------------------- */}
      <section className="relative text-[#f1f5f9] py-20 md:py-28 bg-[#0c0e12] overflow-hidden border-b border-[#1e2632]">
        
        {/* Background Subtle Image Mask */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/college-building.png" 
            alt="Sri Vasavi Engineering College Campus" 
            className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e12]/70 via-[#0c0e12]/90 to-[#0c0e12]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#00b964]/10 blur-[130px] rounded-full pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
          
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#141820] border border-[#1e2632] text-xs font-mono font-medium text-[#94a3b8] mx-auto">
            <span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-ping shrink-0" />
            <span>GEEKSFORGEEKS CAMPUS BODY · SVEC</span>
          </div>

          {/* Massive Display Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.04em] text-[#f8fafc] leading-[0.98] uppercase max-w-5xl mx-auto">
            BUILDING THE NEXT GENERATION OF <br />
            <span>SOFTWARE </span>
            <span className="text-[#00b964] italic">BUILDERS.</span>
          </h1>

          {/* Structural Boxed Highlight & Subhead */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-block border border-[#00b964]/40 px-4 py-1.5 rounded-2xl bg-[#00b964]/5 font-mono text-xs text-[#00b964] font-bold uppercase tracking-wider">
              {activeCycle ? activeCycle.title : 'GFG SVEC EXECUTIVE BOARD 2026'}
            </div>
            <p className="text-[#94a3b8] text-sm md:text-base font-body font-normal leading-relaxed">
              {activeCycle ? activeCycle.shortDescription : 'Step into the official GeeksforGeeks Student Chapter at Sri Vasavi Engineering College. An elite community of software developers, competitive programmers, and creative leaders.'}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link 
              href="/clubs/gfg/hiring/apply"
              className="px-8 py-4 bg-[#00b964] hover:bg-[#00e575] text-[#0c0e12] rounded-full text-xs font-display font-extrabold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#00b964]/20 flex items-center space-x-2 hover:scale-105"
            >
              <span>Apply for Executive Board</span>
              <ArrowUpRight size={16} />
            </Link>
            
            <a 
              href="#roles"
              className="px-8 py-4 bg-[#141820] hover:bg-[#1e2632] text-[#f8fafc] rounded-full text-xs font-display font-bold uppercase tracking-wider transition-colors border border-[#1e2632]"
            >
              Explore Roles
            </a>
          </div>

          {/* Countdown Clock Widget */}
          <div className="pt-8 max-w-xl mx-auto">
            <div className="bg-[#141820]/90 border border-[#1e2632] rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1e2632] pb-3">
                <span className="text-[11px] font-mono text-[#f59e0b] font-semibold uppercase tracking-wider">
                  Recruitment Status Window
                </span>
                <span className="px-2.5 py-0.5 bg-[#00b964]/10 border border-[#00b964]/30 text-[#00b964] rounded-md text-[10px] font-mono font-bold uppercase">
                  ACTIVE
                </span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <span className="w-4 h-4 border-2 border-[#00b964] border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-[#94a3b8] font-mono text-xs">Syncing status...</span>
                </div>
              ) : isClosed ? (
                <div className="text-center py-2 text-xs font-mono font-bold uppercase text-red-400">
                  Applications Closed
                </div>
              ) : (
                <Countdown targetTimeStr={targetTime} onComplete={handleCountdownComplete} />
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. DOMAINS / ROLES HORIZONTAL SCROLL (PATTERN #5) */}
      {/* ---------------------------------------------------- */}
      <section id="roles" className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-[#1e2632] scroll-mt-20">
        <div className="space-y-10">
          
          <div className="space-y-2">
            <span className="text-[#00b964] font-mono text-xs font-bold uppercase tracking-widest block">
              01 — EXPLORE ROLES
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-[#f8fafc] uppercase tracking-tight">
              BROWSE RECRUITMENT <span className="text-[#00b964] italic">TRACKS.</span>
            </h2>
          </div>

          {/* Horizontally-Scrollable Cards Row */}
          <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-[#1e2632] scrollbar-track-transparent">
            {RECRUITMENT_ROLES.map((role) => (
              <div 
                key={role.key}
                className="w-[280px] sm:w-[320px] shrink-0 bg-[#141820] border border-[#1e2632] rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-[#00b964]/50 transition-colors shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#0c0e12] border border-[#1e2632] text-[#f59e0b] rounded-md text-[10px] font-mono font-bold uppercase">
                      {role.category === 'TECHNICAL' ? 'TECHNICAL TRACK' : 'NON-TECHNICAL TRACK'}
                    </span>
                    <span className="font-mono text-xs text-[#94a3b8]">{role.num}</span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl text-[#f8fafc] group-hover:text-[#00b964] transition-colors uppercase leading-tight">
                    {role.displayName}
                  </h3>

                  <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-3 font-normal">
                    {role.focus}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1e2632] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#94a3b8]">{role.shortLabel.split('·')[0]}</span>
                  <Link 
                    href={`/clubs/gfg/hiring/apply?role=${role.slug}`}
                    className="px-3.5 py-1.5 bg-[#00b964] hover:bg-[#00e575] text-[#0c0e12] rounded-full text-[11px] font-display font-extrabold uppercase flex items-center space-x-1"
                  >
                    <span>Apply</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CHAPTER CAROUSEL */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-6 border-b border-[#1e2632]">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-[#f8fafc] uppercase tracking-tight">
              Chapter Operations Overview
            </h2>
            <p className="text-[#94a3b8] text-xs md:text-sm font-normal">
              Explore chapter operational tracks and recruitment materials.
            </p>
          </div>

          <ChapterCarousel />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FEATURED STUDENT PROJECTS */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-6 border-b border-[#1e2632]">
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl md:text-4xl text-[#f8fafc] uppercase tracking-tight">
                Featured Student Projects
              </h2>
              <p className="text-[#94a3b8] text-xs md:text-sm font-normal">
                Software tools and platforms designed and maintained by chapter members.
              </p>
            </div>
            <Link href="/projects" className="text-xs font-mono font-bold text-[#00b964] hover:underline flex items-center space-x-1">
              <span>View All Projects</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((proj, idx) => (
              <div key={idx} className="bg-[#141820] border border-[#1e2632] rounded-3xl p-6 space-y-4 flex flex-col justify-between shadow-xl hover:border-[#00b964]/40 transition-colors">
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 bg-[#0c0e12] border border-[#1e2632] text-[#f59e0b] rounded-md text-[10px] font-mono font-bold uppercase">
                    {proj.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#f8fafc] uppercase">{proj.title}</h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed font-normal">{proj.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#1e2632]">
                  {proj.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-[#0c0e12] text-[#94a3b8] rounded text-[10px] font-mono font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. TESTIMONIALS AUTO-SCROLLING MARQUEE (PATTERN #6) */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-24 border-b border-[#1e2632]">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="font-display font-bold text-2xl md:text-4xl text-[#f8fafc] uppercase tracking-tight">
              ALUMNI & SENIOR <span className="text-[#00b964] italic">VOICES.</span>
            </h2>
            <p className="text-[#94a3b8] text-xs md:text-sm">
              Hear from past leads on their journey within the GeeksforGeeks chapter.
            </p>
          </div>

          <TestimonialsMarquee items={testimonials} />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FINAL CALL TO ACTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-6">
        <div className="bg-[#141820] border border-[#00b964]/30 rounded-[2.5rem] p-8 md:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3.5 py-1 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 rounded-full text-xs font-mono font-bold uppercase">
              Recruitment Window Active
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-[#f8fafc] uppercase tracking-tight">
              JOIN GFG SVEC EXECUTIVE BOARD 2026
            </h2>
            <p className="text-[#94a3b8] text-xs md:text-sm leading-relaxed font-normal">
              Submit your candidate application form before the recruitment window closes. Select your target engineering or creative role and showcase your work.
            </p>
            <div className="pt-2 flex justify-center">
              <Link 
                href="/clubs/gfg/hiring/apply"
                className="px-8 py-4 bg-[#00b964] hover:bg-[#00e575] text-[#0c0e12] rounded-full text-xs font-display font-extrabold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#00b964]/20 flex items-center space-x-2 hover:scale-105"
              >
                <span>Submit Candidate Application</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
export const dynamic = 'force-dynamic';
