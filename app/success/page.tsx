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
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative">
      
      {/* Background library image with fading mask */}
      <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/college-building.png" 
          alt="Sri Vasavi Engineering College Building Background" 
          className="w-full h-full object-cover object-center opacity-[0.08] filter saturate-[0.1] blur-[1px]" 
        />
        {/* Dark radial gradient overlay for focus and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/80 to-zinc-950" />
      </div>

      {/* Header Accent */}
      <div className="w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

      {/* Nav */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-zinc-500">
          <div className="w-5 h-5 text-emerald-500 flex items-center justify-center">
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
            </svg>
          </div>
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
