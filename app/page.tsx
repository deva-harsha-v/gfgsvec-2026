'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';
import ChapterCarousel from '@/components/ChapterCarousel';
import Countdown from '@/components/Countdown';
import { 
  ArrowRight, Code, Trophy, Users, Calendar, Globe, Sparkles, 
  ChevronRight, Terminal, Layers, Star, Quote, FolderGit2, CheckCircle2 
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
      {/* HERO SECTION WITH COLLEGE BUILDING BACKGROUND */}
      {/* ---------------------------------------------------- */}
      <section className="relative text-zinc-100 py-16 md:py-24 bg-zinc-950 overflow-hidden border-b border-zinc-900">
        
        {/* Fading Background Image Overlay */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/college-building.png" 
            alt="Sri Vasavi Engineering College Campus" 
            className="w-full h-full object-cover object-center opacity-30 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold tracking-widest uppercase">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>GeeksforGeeks SVEC Student Chapter</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none">
              Build. Innovate. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                Lead The Future.
              </span>
            </h1>

            <p className="text-zinc-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
              Step into the official GeeksforGeeks Campus Body at Sri Vasavi Engineering College. Join an elite community of programmers, web developers, designers, and organizers building impactful technology.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                href="/clubs/gfg/hiring/apply"
                className="group px-7 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center space-x-2 hover:-translate-y-0.5"
              >
                <span>Apply Now 2026</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a 
                href="#roles"
                className="px-7 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all border border-zinc-800"
              >
                Explore Roles
              </a>
            </div>

          </div>

          {/* Self-contained Countdown Clock under Hero */}
          <div className="mt-12 max-w-2xl bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                Recruitment Clock Status
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">
                12 AUGUST 2026 • 7:00 PM IST
              </span>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center space-y-2 py-4">
                <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading status...</span>
              </div>
            ) : isClosed ? (
              <div className="text-center py-2 space-y-1">
                <span className="text-xs font-extrabold uppercase text-red-400">Recruitment Applications Closed</span>
                <p className="text-[11px] text-zinc-500 font-mono">Check interviews queue or contact executive board.</p>
              </div>
            ) : (
              <Countdown targetTimeStr={targetTime} onComplete={handleCountdownComplete} />
            )}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 01 — EXPLORE: CHAPTER MATERIALS & CAMPAIGN */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 border-b border-zinc-900">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-emerald-400 font-mono text-[11px] font-extrabold tracking-[0.3em] uppercase block">
                01 — Explore
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                Chapter 1 Materials & Focus
              </h2>
            </div>
            <p className="text-zinc-400 text-xs md:text-sm max-w-md font-medium">
              Explore each division and understand our campus body recruitment campaign.
            </p>
          </div>

          <ChapterCarousel />
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 02 — THE COMMUNITY: VISION & IMPACT */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6">
            <span className="text-emerald-400 font-mono text-[11px] font-extrabold tracking-[0.3em] uppercase block">
              02 — The Community
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
              A Legacy of Tech Excellence at SVEC
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
              GeeksforGeeks SVEC Student Chapter operates as an interactive ecosystem for developers, problem solvers, and creative thinkers. We bridge academic coursework with real-world engineering skills through coding tests, hands-on workshops, open-source projects, and industry networking.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <Code className="w-6 h-6 text-emerald-400" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">DSA & Coding</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Weekly contest preparation and algorithm problem-solving.</p>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <Layers className="w-6 h-6 text-emerald-400" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">Web & Systems</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Modern web engineering, backend architectures, and APIs.</p>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-2">
                <Trophy className="w-6 h-6 text-emerald-400" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">Hackathons</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Intra-college software build challenges and mentoring.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-white text-xs font-black uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
              Why Join GFG SVEC?
            </h3>
            <ul className="space-y-3.5 text-xs text-zinc-300 font-medium">
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct mentorship from senior product developers and campus leads.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Hands-on leadership role organizing campus-wide events.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Exclusive access to GFG merchandise, certificates, and perks.</span>
              </li>
            </ul>
            <Link 
              href="/about" 
              className="inline-flex items-center space-x-1.5 text-xs font-bold font-mono text-emerald-400 hover:text-emerald-300 uppercase tracking-wider pt-2"
            >
              <span>Learn About Our Chapter</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 03 — THE EXPERIENCE: MOMENTS & EVENT HIGHLIGHTS */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 border-b border-zinc-900">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-emerald-400 font-mono text-[11px] font-extrabold tracking-[0.3em] uppercase block">
                03 — The Experience
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                Moments & Memories
              </h2>
            </div>
            <Link href="/events" className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-1">
              <span>View All Past Events</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Event highlights grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400">
                <span>WORKSHOP SERIES</span>
                <span>AUGUST 2026</span>
              </div>
              <h3 className="font-extrabold text-sm uppercase text-white">DSA & Competitive Programming Bootcamp</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                A 3-day intensive algorithm practice session breaking down arrays, trees, dynamic programming, and contest strategies for SVEC students.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400">
                <span>HACKATHON</span>
                <span>JULY 2026</span>
              </div>
              <h3 className="font-extrabold text-sm uppercase text-white">Geeks Code Sprint 2026</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                24-hour software build sprint where student teams built web prototypes, automation tools, and ML models under senior mentor supervision.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-400">
                <span>TECH TALK</span>
                <span>JUNE 2026</span>
              </div>
              <h3 className="font-extrabold text-sm uppercase text-white">Web Architecture & UI/UX Design</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                An interactive seminar covering React, Next.js, Figma design systems, and responsive layout engineering for campus developers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 04 — THE BUILDERS: STUDENT PROJECTS & TEAM PREVIEW */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 border-b border-zinc-900">
        <div className="space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-emerald-400 font-mono text-[11px] font-extrabold tracking-[0.3em] uppercase block">
                04 — The Builders
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
                Featured Student Projects
              </h2>
            </div>
            <Link href="/projects" className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-1">
              <span>View All Projects</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((proj, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 bg-emerald-950/60 text-emerald-400 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest">
                    {proj.category}
                  </span>
                  <h3 className="font-extrabold text-sm uppercase text-white">{proj.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">{proj.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/60">
                  {proj.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-zinc-950 text-zinc-500 rounded text-[9px] font-mono font-semibold">
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
      {/* 05 — WHAT COMES NEXT: TWO-TIER RECRUITMENT ROLES */}
      {/* ---------------------------------------------------- */}
      <section id="roles" className="py-16 md:py-24 max-w-7xl mx-auto px-6 border-b border-zinc-900 scroll-mt-20">
        <div className="space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-emerald-400 font-mono text-[11px] font-extrabold tracking-[0.3em] uppercase block">
              05 — What Comes Next
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              Recruitment Roles 2026
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm font-medium">
              Explore technical and non-technical tracks. Click any role to expand details and apply directly.
            </p>
          </div>

          <div className="space-y-12 max-w-4xl mx-auto">
            
            {/* TECHNICAL ROLES TIER */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-[0.25em]">
                  Tier 01 — Technical Engineering Roles
                </span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                  Software & Problem Solving
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {RECRUITMENT_ROLES.filter(r => r.category === 'TECHNICAL').map((role) => {
                  const isExpanded = expandedRole === role.key;
                  return (
                    <div 
                      key={role.key} 
                      className={`bg-zinc-900/40 border transition-all duration-300 rounded-2xl overflow-hidden ${
                        isExpanded ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/5' : 'border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div 
                        onClick={() => setExpandedRole(isExpanded ? null : role.key)}
                        className="p-5 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="w-8 h-8 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-zinc-800">
                            {role.num}
                          </span>
                          <div>
                            <h3 className="text-white text-sm md:text-base font-extrabold uppercase tracking-wider">
                              {role.displayName}
                            </h3>
                            <p className="text-zinc-400 text-xs font-medium">{role.shortLabel}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Link 
                            href={`/clubs/gfg/hiring/apply?role=${role.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shrink-0"
                          >
                            Apply Now
                          </Link>
                          <span className={`text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-emerald-400' : ''}`}>
                            →
                          </span>
                        </div>
                      </div>

                      {/* Expanded panel details */}
                      {isExpanded && (
                        <div className="px-5 pb-6 pt-2 border-t border-zinc-800/60 space-y-4 text-xs">
                          <div className="space-y-1">
                            <span className="text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-widest">Core Focus</span>
                            <p className="text-zinc-300 font-medium leading-relaxed">{role.focus}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 font-mono text-[9px] font-bold uppercase tracking-widest">Role Overview</span>
                            <p className="text-zinc-400 leading-relaxed">{role.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {role.areas.map((area) => (
                              <span key={area} className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md text-[10px] font-semibold">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NON-TECHNICAL ROLES TIER */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-zinc-300 font-mono text-xs font-bold uppercase tracking-[0.25em]">
                  Tier 02 — Operations, Design & Branding Roles
                </span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                  Creatives & Management
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {RECRUITMENT_ROLES.filter(r => r.category === 'NON_TECHNICAL').map((role) => {
                  const isExpanded = expandedRole === role.key;
                  return (
                    <div 
                      key={role.key} 
                      className={`bg-zinc-900/40 border transition-all duration-300 rounded-2xl overflow-hidden ${
                        isExpanded ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/5' : 'border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div 
                        onClick={() => setExpandedRole(isExpanded ? null : role.key)}
                        className="p-5 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="w-8 h-8 rounded-xl bg-zinc-950 text-zinc-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-zinc-800">
                            {role.num}
                          </span>
                          <div>
                            <h3 className="text-white text-sm md:text-base font-extrabold uppercase tracking-wider">
                              {role.displayName}
                            </h3>
                            <p className="text-zinc-400 text-xs font-medium">{role.shortLabel}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Link 
                            href={`/clubs/gfg/hiring/apply?role=${role.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shrink-0"
                          >
                            Apply Now
                          </Link>
                          <span className={`text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-emerald-400' : ''}`}>
                            →
                          </span>
                        </div>
                      </div>

                      {/* Expanded panel details */}
                      {isExpanded && (
                        <div className="px-5 pb-6 pt-2 border-t border-zinc-800/60 space-y-4 text-xs">
                          <div className="space-y-1">
                            <span className="text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-widest">Core Focus</span>
                            <p className="text-zinc-300 font-medium leading-relaxed">{role.focus}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 font-mono text-[9px] font-bold uppercase tracking-widest">Role Overview</span>
                            <p className="text-zinc-400 leading-relaxed">{role.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {role.areas.map((area) => (
                              <span key={area} className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md text-[10px] font-semibold">
                                {area}
                              </span>
                            ))}
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
      {/* TESTIMONIALS / ALUMNI VOICES */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 border-b border-zinc-900">
        <div className="space-y-12">
          
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-emerald-400 font-mono text-[11px] font-extrabold tracking-[0.3em] uppercase block">
              Alumni & Senior Voices
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
              Hear From Our Past Leads
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 space-y-4 flex flex-col justify-between relative">
                <Quote className="w-8 h-8 text-emerald-500/20 absolute top-4 right-4" />
                <p className="text-xs text-zinc-300 leading-relaxed font-medium italic relative z-10">
                  &quot;{t.quote}&quot;
                </p>
                <div className="pt-3 border-t border-zinc-800/60">
                  <h4 className="font-extrabold text-xs text-white uppercase">{t.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-mono">{t.role}</p>
                  <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{t.company}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FINAL CALL TO ACTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-[2.5rem] p-8 md:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
              Ready to take the leap?
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              Join GFG SVEC Executive Board 2026
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium">
              Submit your registration form before the recruitment window closes. Select your interested technical or non-technical role and showcase your work.
            </p>
            <div className="pt-2 flex justify-center">
              <Link 
                href="/clubs/gfg/hiring/apply"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center space-x-2"
              >
                <span>Apply Now 2026</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
export const dynamic = 'force-dynamic';
