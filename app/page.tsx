'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import ChapterCarousel from '@/components/ChapterCarousel';
import Countdown from '@/components/Countdown';
import { ArrowRight, Terminal, Globe, Calendar } from 'lucide-react';

export default function Home() {
  const [targetTime, setTargetTime] = useState<string>('2026-08-12T14:00:00.000Z');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sansSelection selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Header Accent */}
      <div className="w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col space-y-16">
        
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

      </div>

      {/* Footer Details */}
      <footer className="w-full bg-zinc-950 border-t border-zinc-900 py-6 px-6 text-center text-xs font-mono font-bold text-zinc-600">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5">
            <Terminal size={14} className="text-emerald-500/50" />
            <span>GFG Campus Club • SVEC Chapter © 2026</span>
          </div>
          <Link href="/admin/login" className="hover:text-emerald-500 transition-colors uppercase">
            Admin Panel Access
          </Link>
        </div>
      </footer>

    </main>
  );
}
export const dynamic = 'force-dynamic';
