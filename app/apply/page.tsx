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
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
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
          <div className="w-5 h-5 rounded overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-0.5" />
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
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center mx-auto mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
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
