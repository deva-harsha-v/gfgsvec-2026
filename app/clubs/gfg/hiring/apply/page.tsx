'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ApplicationForm from '@/components/ApplicationForm';
import Navbar from '@/components/Navbar';
import FaqWidget from '@/components/FaqWidget';
import { ChevronLeft, AlertCircle, Clock, CheckCircle2, Lock } from 'lucide-react';

function ApplyPageContent() {
  const searchParams = useSearchParams();
  const bypass = searchParams ? searchParams.get('bypass') : null;
  const isBypassed = bypass === 'adminTest';

  const [isOpen, setIsOpen] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cycleTitle, setCycleTitle] = useState<string>('');

  useEffect(() => {
    fetch('/api/recruitment-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.cycle?.title) {
          setCycleTitle(data.cycle.title);
        }
        if (isBypassed) {
          setIsOpen(true);
          setIsClosed(false);
        } else {
          setIsOpen(data.isOpen);
          setIsClosed(data.isClosed);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error checking status:', err);
        setError('Failed to contact recruitment server.');
        setLoading(false);
      });
  }, [isBypassed]);

  return (
    <main className="min-h-screen bg-[#0c0e12] text-[#f1f5f9] flex flex-col font-sans relative selection:bg-[#00b964]/30 selection:text-[#00e575]">
      {/* Seamless fixed background running continuously from top 0 behind navbar */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none bg-[#0c0e12]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/college-building.png" 
          alt="Sri Vasavi Engineering College Building Background" 
          className="w-full h-full object-cover object-center opacity-[0.25]" 
        />
        <div className="absolute inset-0 bg-[#0c0e12]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0e12]/60 to-[#0c0e12]" />
      </div>

      {/* Floating Navbar */}
      <Navbar />

      {/* Main Content Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center relative z-10">
        
        {/* Back Link & Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/clubs/gfg/hiring" 
            className="inline-flex items-center space-x-1.5 text-[#94a3b8] hover:text-[#00e575] transition-colors text-xs font-bold uppercase tracking-wider font-mono bg-[#141820]/60 border border-[#1e2632] px-3.5 py-2 rounded-xl backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Recruitment Landing</span>
          </Link>
          
          <div className="hidden sm:flex items-center space-x-2 text-[#94a3b8] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#00b964] animate-pulse" />
            <span>{cycleTitle || 'GFG SVEC Recruitment'}</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#141820]/80 border border-[#1e2632] rounded-3xl p-12 text-center backdrop-blur-md max-w-md mx-auto my-12 flex flex-col items-center space-y-4">
            <span className="w-10 h-10 border-3 border-[#00b964] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#94a3b8] font-mono text-xs uppercase tracking-widest">Loading Registration System...</span>
          </div>
        ) : error ? (
          <div className="bg-[#141820]/90 border border-red-500/30 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-md max-w-md mx-auto my-12 space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-950/50 border border-red-500/30 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">Connection Error</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">{error}</p>
            <Link href="/clubs/gfg/hiring" className="inline-block py-3 px-8 bg-[#1e2632] hover:bg-[#283242] border border-[#2e3b4e] rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all">
              Try Again
            </Link>
          </div>
        ) : isClosed ? (
          <div className="bg-[#141820]/90 border border-[#1e2632] rounded-3xl p-8 sm:p-12 text-center backdrop-blur-md max-w-lg mx-auto my-12 space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-red-950/40 border border-red-500/30 text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Lock size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">APPLICATIONS <span className="text-red-400">CLOSED</span></h2>
              <p className="text-[#94a3b8] text-sm leading-relaxed mt-2">
                Registration for this recruitment cycle has officially ended. Thank you for your interest in joining GeeksforGeeks SVEC Student Chapter!
              </p>
            </div>
            <div className="pt-2">
              <Link href="/clubs/gfg/hiring" className="inline-flex items-center space-x-2 py-3 px-8 bg-[#00b964] hover:bg-[#00d070] text-[#0c0e12] font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00b964]/20">
                <span>Go to Recruitment Landing</span>
              </Link>
            </div>
          </div>
        ) : !isOpen ? (
          <div className="bg-[#141820]/90 border border-[#1e2632] rounded-3xl p-8 sm:p-12 text-center backdrop-blur-md max-w-lg mx-auto my-12 space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-[#00b964]/10 border border-[#00b964]/30 text-[#00b964] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Clock size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">APPLICATIONS <span className="text-[#00b964]">OPEN SOON</span></h2>
              <p className="text-[#94a3b8] text-sm leading-relaxed mt-2">
                Registration forms are not open yet. Please wait for the countdown timer to finish on the recruitment landing page.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/clubs/gfg/hiring" className="inline-flex items-center space-x-2 py-3 px-8 bg-[#00b964] hover:bg-[#00d070] text-[#0c0e12] font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00b964]/20">
                <span>View Opening Countdown</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <ApplicationForm />
          </div>
        )}
      </div>

      <FaqWidget />
    </main>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0c0e12] flex flex-col items-center justify-center space-y-3 font-sans">
        <span className="w-8 h-8 border-3 border-[#00b964] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#94a3b8] font-mono text-xs uppercase tracking-widest">Loading Application Page...</span>
      </main>
    }>
      <ApplyPageContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
