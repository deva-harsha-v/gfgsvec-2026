'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ApplicationForm from '@/components/ApplicationForm';
import { ChevronLeft, Terminal, AlertCircle } from 'lucide-react';

export default function ApplyPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/recruitment-status')
      .then((res) => res.json())
      .then((data) => {
        setIsOpen(data.isOpen);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error checking status:', err);
        setError('Failed to contact recruitment server.');
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative">
      
      {/* Background library image with fading mask */}
      <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/college-building.png" 
          alt="Sri Vasavi Engineering College Building Background" 
          className="w-full h-full object-cover object-center opacity-[0.25] filter saturate-[0.2]" 
        />
        {/* Dark radial gradient overlay for focus and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/75 to-zinc-950" />
      </div>

      {/* Header Accent */}
      <div className="w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

      {/* Nav */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center space-x-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider font-mono"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        
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
        
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20">
            <span className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading Registration System...</span>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center space-y-4 py-16">
            <div className="w-12 h-12 bg-red-950/40 border border-red-500/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">Connection Error</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{error}</p>
            <Link href="/" className="inline-block py-2.5 px-6 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-all">
              Try Again
            </Link>
          </div>
        ) : !isOpen ? (
        <div className="max-w-md mx-auto text-center space-y-4 py-16">
          <div className="w-12 h-12 text-emerald-500 flex items-center justify-center mx-auto mb-4">
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
            </svg>
          </div>
            <h3 className="text-xl font-bold text-white uppercase">Applications Closed</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Recruitment registration forms are not open yet. Please wait for the countdown timer on our home page to finish.
            </p>
            <Link href="/" className="inline-block py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
              Go to Timer
            </Link>
          </div>
        ) : (
          <div className="py-4">
            <ApplicationForm />
          </div>
        )}

      </div>
    </main>
  );
}
export const dynamic = 'force-dynamic';
