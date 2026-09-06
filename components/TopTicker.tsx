'use client';

import Link from 'next/link';

export default function TopTicker() {
  const tickerMessage = "GFG SVEC RECRUITMENT 2026 • JOIN THE EXECUTIVE BOARD • BUILD CODE • LEAD COMMUNITY • ";

  return (
    <div className="w-full bg-[#00b964] text-[#0c0e12] font-mono text-[11px] font-extrabold uppercase tracking-widest overflow-hidden whitespace-nowrap py-1.5 border-b border-[#009b53] select-none relative z-50">
      <div className="inline-flex animate-marquee motion-reduce:animate-none space-x-4">
        <span>{tickerMessage.repeat(6)}</span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
