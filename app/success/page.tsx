'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { useState, Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get('id');
  const [copied, setCopied] = useState(false);

  // If no ID, redirect back to landing page
  if (!applicationId) {
    if (typeof window !== 'undefined') {
      router.replace('/');
    }
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

      {/* Success Badge */}
      <div className="flex flex-col items-center space-y-4">
        {/* SVG Checkmark */}
        <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-black text-white uppercase tracking-wide">
          Application Submitted
        </h2>
      </div>

      <div className="space-y-4">
        <p className="text-zinc-400 text-sm leading-relaxed">
          Thank you for applying to the <span className="text-white font-semibold">GFG Campus Body Recruitment 2026</span> at Sri Vasavi Engineering College.
        </p>

        {/* Application ID Card */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-2 flex flex-col items-center">
          <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase font-mono">Application ID</span>
          
          <div className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-black text-white font-mono tracking-tight select-all">
              {applicationId}
            </span>
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-lg border transition-all ${
                copied 
                  ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
              title="Copy ID"
            >
              {copied ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          </div>
          
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
            Please save your ID for future reference.
          </span>
        </div>
      </div>

      {/* Button controls */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-zinc-800/40">
        <Link 
          href="/" 
          className="w-full py-3 px-6 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 rounded-xl transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Return Home</span>
        </Link>
      </div>

    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Header Accent */}
      <div className="w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

      {/* Nav */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-zinc-500">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest font-mono">GFG SVEC Club</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col justify-center">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20 text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Loading...
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
export const dynamic = 'force-dynamic';
