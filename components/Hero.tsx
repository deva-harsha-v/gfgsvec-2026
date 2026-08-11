'use client';

import { Terminal } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative text-center py-10 md:py-16 max-w-3xl mx-auto flex flex-col items-center space-y-4">
      {/* Club Logo Placeholder / Technical Graphic */}
      <div className="flex items-center justify-center w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-400 mb-2 shadow-lg shadow-emerald-500/5 animate-pulse">
        <Terminal size={32} />
      </div>

      <span className="text-emerald-400 font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase">
        Sri Vasavi Engineering College
      </span>
      
      <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none uppercase">
        GFG Club <span className="text-emerald-500">Recruitment</span>
      </h1>
      
      <p className="text-zinc-500 text-sm md:text-base max-w-xl font-medium leading-relaxed">
        Step into the official GeeksforGeeks Campus Body for 2026. Join a legacy of developers, designers, and organizers building the future of technology on campus.
      </p>

      {/* Decorative border accent */}
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mt-6" />
    </div>
  );
}
