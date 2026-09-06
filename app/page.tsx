'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import ChapterCarousel from '@/components/ChapterCarousel';
import Countdown from '@/components/Countdown';
import { 
  ArrowUpRight, Code, Trophy, Users, Calendar, Sparkles, 
  Terminal, Layers, Quote, CheckCircle2, ChevronDown 
} from 'lucide-react';
import { RECRUITMENT_ROLES } from '@/lib/roles';

export default function GfgHomePage() {
  const [targetTime, setTargetTime] = useState<string>('2026-08-12T13:30:00.000Z');
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/recruitment-status')
      .then((res) => res.json())
      .then((data) => {
        setTargetTime(data.startTime);
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

  // Testimonials data
  const testimonials = [
    {
      quote: "Joining GFG SVEC in my 2nd year was the single best decision for my technical growth. The DSA bootcamps and team hackathons prepared me directly for product interviews.",
      name: "K. Teja Swaroop",
      role: "Lead Developer (Batch of 2025)",
      company: "Placed at TCS Digital"
    },
    {
      quote: "The design and non-tech tracks gave me hands-on leadership experience. Organizing campus coding contests taught me event management, branding, and team coordination.",
      name: "S. Ananya",
      role: "Design & Media Lead (Batch of 2025)",
      company: "UI/UX Consultant"
    },
    {
      quote: "GFG Student Chapter is a community of passionate builders. You don't just solve problems on paper; you build real software tools for the campus.",
      name: "P. Vamsi Krishna",
      role: "Competitive Programming Lead",
      company: "Placed at DXC Technology"
    }
  ];

  // Featured Projects Teasers
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
      {/* HERO SECTION: BESPOKE COMPOSITION & EMERALD SPOTLIGHT */}
      {/* ---------------------------------------------------- */}
      <section className="relative text-[#f1f5f9] py-20 md:py-28 bg-[#0c0e12] overflow-hidden border-b border-[#1e2632]">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/college-building.png" 
            alt="Sri Vasavi Engineering College Campus" 
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e12]/70 via-[#0c0e12]/90 to-[#0c0e12]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gfg-emerald/10 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Main Headline */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#141820] border border-[#1e2632] text-gfg-amber text-xs font-mono font-medium">
                <span className="w-2 h-2 bg-gfg-amber rounded-full animate-ping shrink-0" />
                <span>GeeksforGeeks SVEC Chapter</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-[-0.04em] text-[#f8fafc] leading-[0.98] uppercase">
                Build Code. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gfg-emerald via-gfg-glow to-emerald-400">
                  Lead Community.
                </span>
              </h1>

              <p className="text-gfg-muted text-sm md:text-base max-w-xl font-body font-normal leading-relaxed">
                Join the official GeeksforGeeks Student Chapter at Sri Vasavi Engineering College. An elite community of software developers, competitive programmers, and creative leaders.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link 
                  href="/clubs/gfg/hiring/apply"
                  className="px-7 py-3.5 bg-gfg-emerald hover:bg-gfg-glow text-[#0c0e12] rounded-xl text-xs font-display font-extrabold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-gfg-emerald/20 hover:shadow-gfg-emerald/30 flex items-center space-x-2 hover:-translate-y-0.5"
                >
                  <span>Apply for Executive Board</span>
                  <ArrowUpRight size={16} />
                </Link>
                
                <a 
                  href="#roles"
                  className="px-7 py-3.5 bg-[#141820] hover:bg-[#1a202c] text-[#f1f5f9] rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-colors border border-[#1e2632]"
                >
                  Explore Roles
                </a>
              </div>

            </div>

            {/* Right Column: Recruitment Status Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#141820]/90 border border-[#1e2632] rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#1e2632] pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-gfg-amber font-semibold uppercase tracking-wider block">
                      Recruitment Window
                    </span>
                    <span className="text-xs font-mono text-[#f8fafc] font-bold">
                      Session 2026
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-gfg-emerald/10 border border-gfg-emerald/30 text-gfg-emerald rounded-md text-[10px] font-mono font-bold uppercase">
                    ACTIVE
                  </span>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <span className="w-5 h-5 border-2 border-gfg-emerald border-t-transparent rounded-full animate-spin mr-3" />
                    <span className="text-gfg-muted font-mono text-xs">Syncing clock status...</span>
                  </div>
                ) : isClosed ? (
                  <div className="text-center py-4 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-red-400">Applications Closed</span>
                    <p className="text-xs text-gfg-muted">Check interviews queue or contact executive desk.</p>
                  </div>
                ) : (
                  <Countdown targetTimeStr={targetTime} onComplete={handleCountdownComplete} />
                )}

                <div className="pt-3 border-t border-[#1e2632] flex items-center justify-between text-[11px] font-mono text-gfg-muted">
                  <span>Target Batch: 2025–2028</span>
                  <Link href="/clubs/gfg/hiring/apply" className="text-gfg-emerald hover:underline font-bold">
                    Direct Apply
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CHAPTER MATERIALS CAROUSEL */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-6 border-b border-[#1e2632]">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-[#f8fafc] uppercase tracking-tight">
              Chapter 1 Overview
            </h2>
            <p className="text-gfg-muted text-xs md:text-sm font-normal">
              Explore chapter operational tracks and recruitment materials.
            </p>
          </div>

          <ChapterCarousel />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CHAPTER VISION & CORE PILLARS */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-6 border-b border-[#1e2632]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          
          <div className="lg:col-span-2 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-2xl md:text-4xl text-[#f8fafc] uppercase tracking-tight leading-tight">
                Technical Excellence & Campus Culture
              </h2>
              <p className="text-gfg-muted text-xs md:text-sm leading-relaxed">
                GeeksforGeeks SVEC Student Chapter operates as an interactive ecosystem for developers, competitive coders, and creative leads. We bridge classroom knowledge with practical software engineering through coding sprints, workshops, open-source projects, and industry networking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#141820] border border-[#1e2632] rounded-2xl p-5 space-y-2">
                <Code className="w-5 h-5 text-gfg-emerald" />
                <h4 className="font-display font-bold text-xs uppercase text-[#f8fafc]">DSA & Coding</h4>
                <p className="text-[11px] text-gfg-muted leading-relaxed">Weekly algorithm practice and competitive contest prep.</p>
              </div>
              <div className="bg-[#141820] border border-[#1e2632] rounded-2xl p-5 space-y-2">
                <Layers className="w-5 h-5 text-gfg-emerald" />
                <h4 className="font-display font-bold text-xs uppercase text-[#f8fafc]">Web & Systems</h4>
                <p className="text-[11px] text-gfg-muted leading-relaxed">Modern web engineering, backend APIs, and UI design.</p>
              </div>
              <div className="bg-[#141820] border border-[#1e2632] rounded-2xl p-5 space-y-2">
                <Trophy className="w-5 h-5 text-gfg-emerald" />
                <h4 className="font-display font-bold text-xs uppercase text-[#f8fafc]">Hackathons</h4>
                <p className="text-[11px] text-gfg-muted leading-relaxed">Intra-college software build challenges and mentoring.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#141820] border border-[#1e2632] rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <h3 className="text-[#f8fafc] text-xs font-display font-extrabold uppercase tracking-wider border-l-2 border-gfg-amber pl-2.5">
                Why Join GFG SVEC?
              </h3>
              <ul className="space-y-3.5 text-xs text-gfg-muted font-normal">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gfg-emerald shrink-0 mt-0.5" />
                  <span>Direct mentorship from senior product developers and campus leads.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gfg-emerald shrink-0 mt-0.5" />
                  <span>Hands-on leadership role organizing campus-wide tech events.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gfg-emerald shrink-0 mt-0.5" />
                  <span>Exclusive access to GFG certificates, perks, and project repositories.</span>
                </li>
              </ul>
            </div>

            <Link 
              href="/about" 
              className="inline-flex items-center space-x-1.5 text-xs font-mono text-gfg-emerald hover:text-gfg-glow font-bold uppercase tracking-wider pt-2"
            >
              <span>Read Chapter History</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* TWO-TRACK RECRUITMENT ROLES */}
      {/* ---------------------------------------------------- */}
      <section id="roles" className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-[#1e2632] scroll-mt-20">
        <div className="space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <h2 className="font-display font-black text-3xl md:text-5xl text-[#f8fafc] uppercase tracking-tight">
              Recruitment Tracks 2026
            </h2>
            <p className="text-gfg-muted text-xs md:text-sm">
              Select technical or non-technical roles below to inspect core focus, skills, and submit your candidate application.
            </p>
          </div>

          <div className="space-y-12">
            
            {/* TECHNICAL TRACK */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#1e2632] pb-3">
                <span className="text-gfg-emerald font-mono text-xs font-bold uppercase tracking-wider">
                  Track 01 — Engineering & Algorithmic Roles
                </span>
                <span className="text-gfg-muted text-[11px] font-mono">Technical Division</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {RECRUITMENT_ROLES.filter(r => r.category === 'TECHNICAL').map((role) => {
                  const isExpanded = expandedRole === role.key;
                  return (
                    <div 
                      key={role.key} 
                      className={`bg-[#141820] border transition-all duration-200 rounded-2xl overflow-hidden ${
                        isExpanded ? 'border-gfg-emerald/60 shadow-xl' : 'border-[#1e2632] hover:border-[#2a3646]'
                      }`}
                    >
                      <div 
                        onClick={() => setExpandedRole(isExpanded ? null : role.key)}
                        className="p-6 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="w-9 h-9 rounded-xl bg-[#0c0e12] border border-[#1e2632] text-gfg-emerald font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {role.num}
                          </span>
                          <div>
                            <h3 className="font-display font-bold text-base md:text-lg text-[#f8fafc] uppercase">
                              {role.displayName}
                            </h3>
                            <p className="text-gfg-muted text-xs font-normal">{role.shortLabel}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <Link 
                            href={`/clubs/gfg/hiring/apply?role=${role.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-gfg-emerald hover:bg-gfg-glow text-[#0c0e12] rounded-xl text-xs font-display font-extrabold uppercase tracking-wider transition-colors shrink-0 hidden sm:block"
                          >
                            Apply Now
                          </Link>
                          <ChevronDown className={`w-5 h-5 text-gfg-muted transition-transform duration-200 ${isExpanded ? 'rotate-180 text-gfg-emerald' : ''}`} />
                        </div>
                      </div>

                      {/* Expandable Accordion Panel */}
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-[#1e2632] space-y-4 text-xs">
                          <div className="bg-[#0c0e12] border border-[#1e2632] rounded-xl p-4 space-y-1">
                            <span className="text-gfg-amber font-mono text-[10px] font-bold uppercase tracking-wider block">Core Focus</span>
                            <p className="text-[#f1f5f9] font-normal leading-relaxed">{role.focus}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-gfg-muted font-mono text-[10px] font-bold uppercase tracking-wider block">Overview</span>
                            <p className="text-gfg-muted leading-relaxed">{role.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {role.areas.map((area) => (
                              <span key={area} className="px-3 py-1 bg-[#0c0e12] border border-[#1e2632] text-gfg-muted rounded-lg text-xs font-mono font-medium">
                                {area}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 sm:hidden">
                            <Link 
                              href={`/clubs/gfg/hiring/apply?role=${role.slug}`}
                              className="w-full py-2.5 bg-gfg-emerald text-[#0c0e12] rounded-xl text-xs font-display font-extrabold uppercase text-center block"
                            >
                              Apply for {role.displayName}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NON-TECHNICAL TRACK */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between border-b border-[#1e2632] pb-3">
                <span className="text-gfg-amber font-mono text-xs font-bold uppercase tracking-wider">
                  Track 02 — Operations, Design & Media Roles
                </span>
                <span className="text-gfg-muted text-[11px] font-mono">Creative & Operations</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {RECRUITMENT_ROLES.filter(r => r.category === 'NON_TECHNICAL').map((role) => {
                  const isExpanded = expandedRole === role.key;
                  return (
                    <div 
                      key={role.key} 
                      className={`bg-[#141820] border transition-all duration-200 rounded-2xl overflow-hidden ${
                        isExpanded ? 'border-gfg-amber/60 shadow-xl' : 'border-[#1e2632] hover:border-[#2a3646]'
                      }`}
                    >
                      <div 
                        onClick={() => setExpandedRole(isExpanded ? null : role.key)}
                        className="p-6 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="w-9 h-9 rounded-xl bg-[#0c0e12] border border-[#1e2632] text-gfg-amber font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {role.num}
                          </span>
                          <div>
                            <h3 className="font-display font-bold text-base md:text-lg text-[#f8fafc] uppercase">
                              {role.displayName}
                            </h3>
                            <p className="text-gfg-muted text-xs font-normal">{role.shortLabel}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <Link 
                            href={`/clubs/gfg/hiring/apply?role=${role.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-gfg-emerald hover:bg-gfg-glow text-[#0c0e12] rounded-xl text-xs font-display font-extrabold uppercase tracking-wider transition-colors shrink-0 hidden sm:block"
                          >
                            Apply Now
                          </Link>
                          <ChevronDown className={`w-5 h-5 text-gfg-muted transition-transform duration-200 ${isExpanded ? 'rotate-180 text-gfg-amber' : ''}`} />
                        </div>
                      </div>

                      {/* Expandable Accordion Panel */}
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-[#1e2632] space-y-4 text-xs">
                          <div className="bg-[#0c0e12] border border-[#1e2632] rounded-xl p-4 space-y-1">
                            <span className="text-gfg-amber font-mono text-[10px] font-bold uppercase tracking-wider block">Core Focus</span>
                            <p className="text-[#f1f5f9] font-normal leading-relaxed">{role.focus}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-gfg-muted font-mono text-[10px] font-bold uppercase tracking-wider block">Overview</span>
                            <p className="text-gfg-muted leading-relaxed">{role.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {role.areas.map((area) => (
                              <span key={area} className="px-3 py-1 bg-[#0c0e12] border border-[#1e2632] text-gfg-muted rounded-lg text-xs font-mono font-medium">
                                {area}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 sm:hidden">
                            <Link 
                              href={`/clubs/gfg/hiring/apply?role=${role.slug}`}
                              className="w-full py-2.5 bg-gfg-emerald text-[#0c0e12] rounded-xl text-xs font-display font-extrabold uppercase text-center block"
                            >
                              Apply for {role.displayName}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

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
              <p className="text-gfg-muted text-xs md:text-sm font-normal">
                Software tools and platforms designed and maintained by chapter members.
              </p>
            </div>
            <Link href="/projects" className="text-xs font-mono font-bold text-gfg-emerald hover:underline flex items-center space-x-1">
              <span>View All Projects</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((proj, idx) => (
              <div key={idx} className="bg-[#141820] border border-[#1e2632] rounded-3xl p-6 space-y-4 flex flex-col justify-between shadow-xl hover:border-gfg-emerald/40 transition-colors">
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 bg-[#0c0e12] border border-[#1e2632] text-gfg-amber rounded-md text-[10px] font-mono font-bold uppercase">
                    {proj.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#f8fafc] uppercase">{proj.title}</h3>
                  <p className="text-xs text-gfg-muted leading-relaxed font-normal">{proj.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#1e2632]">
                  {proj.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-[#0c0e12] text-gfg-muted rounded text-[10px] font-mono font-medium">
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
      {/* TESTIMONIALS / ALUMNI VOICES */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-6 border-b border-[#1e2632]">
        <div className="space-y-12">
          
          <div className="max-w-xl space-y-2">
            <h2 className="font-display font-bold text-2xl md:text-4xl text-[#f8fafc] uppercase tracking-tight">
              Alumni & Senior Voices
            </h2>
            <p className="text-gfg-muted text-xs md:text-sm">
              Hear from past leads on their journey within the GeeksforGeeks chapter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-[#141820] border border-[#1e2632] rounded-3xl p-6 space-y-4 flex flex-col justify-between shadow-xl relative">
                <Quote className="w-7 h-7 text-gfg-emerald/20 absolute top-5 right-5" />
                <p className="text-xs text-[#f1f5f9] leading-relaxed font-normal italic relative z-10">
                  &quot;{t.quote}&quot;
                </p>
                <div className="pt-3 border-t border-[#1e2632]">
                  <h4 className="font-display font-bold text-xs text-[#f8fafc] uppercase">{t.name}</h4>
                  <p className="text-[11px] text-gfg-emerald font-mono">{t.role}</p>
                  <p className="text-[10px] text-gfg-muted font-mono mt-0.5">{t.company}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FINAL CALL TO ACTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-6">
        <div className="bg-[#141820] border border-gfg-emerald/30 rounded-[2.5rem] p-8 md:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3.5 py-1 bg-gfg-amber/10 text-gfg-amber border border-gfg-amber/30 rounded-full text-xs font-mono font-bold uppercase">
              Recruitment Window Active
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-[#f8fafc] uppercase tracking-tight">
              Join GFG SVEC Executive Board 2026
            </h2>
            <p className="text-gfg-muted text-xs md:text-sm leading-relaxed font-normal">
              Submit your candidate application form before the recruitment window closes. Select your target engineering or creative role and showcase your work.
            </p>
            <div className="pt-2 flex justify-center">
              <Link 
                href="/clubs/gfg/hiring/apply"
                className="px-8 py-4 bg-gfg-emerald hover:bg-gfg-glow text-[#0c0e12] rounded-xl text-xs font-display font-extrabold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-gfg-emerald/20 hover:shadow-gfg-emerald/30 flex items-center space-x-2"
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
