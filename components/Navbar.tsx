'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [recruitmentActive, setRecruitmentActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    fetch('/api/recruitment-status')
      .then(res => res.json())
      .then(data => {
        if (data.isOpen && !data.isClosed) {
          setRecruitmentActive(true);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Events', href: '/events' },
    { label: 'Roles', href: '/#roles' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0c0e12]/90 text-[#f1f5f9] shadow-2xl backdrop-blur-md border-b border-[#1e2632]' 
        : 'bg-[#0c0e12]/70 text-[#f1f5f9] backdrop-blur-sm border-b border-[#181f28]'
    }`}>
      {/* Top Banner */}
      {recruitmentActive && (
        <div className="bg-[#141820] border-b border-[#1e2632] py-1.5 px-4 text-center text-xs font-mono text-gfg-muted flex items-center justify-center space-x-2">
          <span className="w-2 h-2 bg-gfg-amber rounded-full animate-ping shrink-0" />
          <span>GFG SVEC Executive Recruitment 2026 is LIVE</span>
          <Link href="/clubs/gfg/hiring/apply" className="text-gfg-emerald font-semibold hover:text-gfg-glow underline ml-2 font-mono">
            Submit Application &rarr;
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 text-gfg-emerald flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base tracking-tight text-[#f8fafc] group-hover:text-gfg-emerald transition-colors">
                GeeksforGeeks
              </span>
              <span className="text-[11px] font-mono font-bold text-gfg-emerald uppercase tracking-wider">
                SVEC Student Chapter
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-gfg-muted hover:text-[#f8fafc] hover:bg-[#141820] transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Apply Button */}
            <Link
              href="/clubs/gfg/hiring/apply"
              className="ml-4 px-5 py-2.5 bg-gfg-emerald hover:bg-gfg-glow text-[#0c0e12] rounded-xl text-xs font-display font-extrabold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-gfg-emerald/20 hover:shadow-gfg-emerald/30 flex items-center space-x-1.5 hover:-translate-y-0.5"
            >
              <span>Apply Now</span>
              <ArrowUpRight size={14} />
            </Link>
          </nav>

          {/* Mobile Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <Link
              href="/clubs/gfg/hiring/apply"
              className="px-3.5 py-2 bg-gfg-emerald text-[#0c0e12] text-xs font-display font-extrabold uppercase rounded-lg shadow"
            >
              Apply
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl border border-[#1e2632] text-gfg-muted hover:text-[#f8fafc] hover:bg-[#141820] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#0c0e12]/90 backdrop-blur-md" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed top-20 bottom-0 right-0 w-72 bg-[#0c0e12] text-[#f1f5f9] shadow-2xl p-6 border-l border-[#1e2632] flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-gfg-amber">Navigation</span>
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-mono font-medium text-gfg-muted hover:text-gfg-emerald transition-colors py-1.5"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#1e2632]">
              <Link
                href="/clubs/gfg/hiring/apply"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-gfg-emerald hover:bg-gfg-glow text-[#0c0e12] rounded-xl text-center text-xs font-display font-extrabold uppercase tracking-wider block transition-all shadow-lg shadow-gfg-emerald/20"
              >
                Apply for Executive Board
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
