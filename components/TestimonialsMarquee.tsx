'use client';

import { Quote } from 'lucide-react';

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  accentBg: string;
}

export default function TestimonialsMarquee({ items }: { items: TestimonialItem[] }) {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-4 select-none relative">
      <div className="inline-flex space-x-6 animate-marquee-slow motion-reduce:animate-none">
        {[...items, ...items].map((t, idx) => (
          <div 
            key={idx}
            className="inline-block whitespace-normal w-[320px] sm:w-[380px] bg-[#141820] border border-[#1e2632] rounded-3xl p-6 space-y-4 shadow-xl relative align-top"
          >
            <Quote className="w-7 h-7 text-[#00b964]/20 absolute top-5 right-5" />
            <p className="text-xs text-[#f1f5f9] leading-relaxed font-normal italic relative z-10">
              &quot;{t.quote}&quot;
            </p>
            <div className="pt-4 border-t border-[#1e2632] flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-full ${t.accentBg} text-[#0c0e12] font-display font-black text-xs flex items-center justify-center shrink-0`}>
                {t.initials}
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-[#f8fafc] uppercase">{t.name}</h4>
                <p className="text-[10px] text-[#00b964] font-mono">{t.role}</p>
                <p className="text-[9px] text-[#94a3b8] font-mono">{t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          display: inline-flex;
          animation: marquee-slow 35s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
