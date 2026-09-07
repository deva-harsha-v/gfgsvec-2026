'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, X, Bell, CheckCircle2, ArrowUpRight, LogIn, LogOut, 
  LayoutDashboard, Settings, User, Info, Users, Calendar, 
  Sparkles, FolderGit2, Mail 
} from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  initials: string;
  role: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setUser(null);
      setShowProfileMenu(false);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { label: 'About', href: '/about', icon: Info },
    { label: 'Team', href: '/team', icon: Users },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Roles', href: '/#roles', icon: Sparkles },
    { label: 'Projects', href: '/projects', icon: FolderGit2 },
    { label: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <div className="sticky top-3 sm:top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 pointer-events-none">
      <header className="w-full rounded-full bg-[#141820]/90 text-[#f1f5f9] backdrop-blur-md border border-[#1e2632] shadow-2xl pointer-events-auto transition-all duration-300">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-13 sm:h-14">
            
            {/* Logo Mark + Two-Tone Wordmark */}
            <Link href="/" className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-7 h-7 text-[#00b964] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
                </svg>
              </div>
              <div className="flex items-center space-x-1 font-display font-black text-sm tracking-tight">
                <span className="text-[#f8fafc]">GFG</span>
                <span className="text-[#00b964]">SVEC</span>
              </div>
            </Link>

            {/* Center-Aligned Nav Links with Paired Minimal Icons */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-1.5 rounded-full text-xs font-mono font-medium text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0c0e12] transition-colors flex items-center space-x-1.5"
                  >
                    <IconComponent size={13} className="text-[#00b964] shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Auth Link + Bright Pill CTA + Circular Icon Button Pattern */}
            <div className="hidden lg:flex items-center space-x-3">
              
              {/* Auth-Aware Avatar / Admin Login Link */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="relative flex items-center focus:outline-none"
                    aria-label="User account menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0c0e12] border border-emerald-500/50 text-[#00b964] font-mono text-xs font-bold flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                      {user.initials}
                    </div>
                    <CheckCircle2 size={12} className="absolute -bottom-0.5 -right-0.5 text-[#00b964] bg-[#0c0e12] rounded-full" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-[#141820] border border-[#1e2632] rounded-2xl shadow-2xl p-2 font-mono text-xs z-50 space-y-1"
                      onMouseLeave={() => setShowProfileMenu(false)}
                    >
                      <div className="px-3 py-2 border-b border-[#1e2632]">
                        <div className="text-[10px] text-[#00b964] font-bold uppercase">Authenticated Session</div>
                        <div className="text-[#f8fafc] font-sans font-medium text-xs truncate">{user.email}</div>
                      </div>

                      <Link
                        href="/admin/gfg-hiring"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-[#94a3b8] hover:text-white hover:bg-[#0c0e12] rounded-xl transition-colors"
                      >
                        <LayoutDashboard size={14} className="text-[#00b964]" />
                        <span>Admin Portal</span>
                      </Link>

                      <Link
                        href="/admin/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-[#94a3b8] hover:text-white hover:bg-[#0c0e12] rounded-xl transition-colors"
                      >
                        <Settings size={14} />
                        <span>Settings</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-950/40 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="px-3 py-1.5 rounded-full text-xs font-mono font-medium text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0c0e12] transition-colors flex items-center space-x-1.5"
                >
                  <LogIn size={13} />
                  <span>Admin Login</span>
                </Link>
              )}

              {/* Paired CTA Group: Bright Green Pill + Circular Icon Button */}
              <div className="flex items-center space-x-1.5">
                <Link
                  href="/clubs/gfg/hiring/apply"
                  className="px-4 py-1.5 bg-[#00b964] hover:bg-[#00e575] text-[#0c0e12] rounded-full text-xs font-display font-extrabold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#00b964]/20 flex items-center space-x-1 hover:scale-105"
                >
                  <span>Apply Now</span>
                </Link>

                <Link
                  href="/clubs/gfg/hiring/apply"
                  className="w-8 h-8 rounded-full bg-[#0c0e12] border border-[#1e2632] hover:border-[#00b964] text-[#00b964] hover:text-[#00e575] flex items-center justify-center transition-all duration-200 hover:scale-105 shadow shrink-0"
                  aria-label="Apply Action Arrow"
                >
                  <ArrowUpRight size={15} />
                </Link>
              </div>

            </div>

            {/* Mobile Menu Controls */}
            <div className="flex lg:hidden items-center space-x-2">
              {user ? (
                <Link
                  href="/admin/gfg-hiring"
                  className="w-7 h-7 rounded-full bg-[#0c0e12] border border-emerald-500 text-[#00b964] font-mono text-[10px] font-bold flex items-center justify-center"
                >
                  {user.initials}
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="text-xs font-mono text-[#94a3b8] hover:text-white px-2 py-1"
                >
                  Login
                </Link>
              )}

              <Link
                href="/clubs/gfg/hiring/apply"
                className="px-3 py-1 bg-[#00b964] text-[#0c0e12] text-[11px] font-display font-extrabold uppercase rounded-full shadow"
              >
                Apply
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-full border border-[#1e2632] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0c0e12] transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 top-20 z-40 bg-[#0c0e12]/90 backdrop-blur-md px-4 pointer-events-auto" onClick={() => setIsOpen(false)}>
            <div 
              className="mt-3 max-w-sm ml-auto bg-[#141820] text-[#f1f5f9] shadow-2xl p-5 rounded-3xl border border-[#1e2632] space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f59e0b]">Navigation Menu</span>
                <nav className="flex flex-col space-y-2">
                  {navLinks.map((link) => {
                    const IconComp = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-xs font-mono font-medium text-[#94a3b8] hover:text-[#00b964] transition-colors py-1 flex items-center space-x-2"
                      >
                        <IconComp size={14} className="text-[#00b964]" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-3 border-t border-[#1e2632] space-y-2">
                {user ? (
                  <Link
                    href="/admin/gfg-hiring"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 bg-emerald-950/40 border border-emerald-500/30 text-[#00b964] rounded-full text-center text-xs font-mono font-bold uppercase tracking-wider block transition-all"
                  >
                    Admin Portal ({user.email})
                  </Link>
                ) : (
                  <Link
                    href="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 bg-[#141820] border border-[#1e2632] text-zinc-300 rounded-full text-center text-xs font-mono font-bold uppercase tracking-wider block transition-all"
                  >
                    Admin Login
                  </Link>
                )}

                <Link
                  href="/clubs/gfg/hiring/apply"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 bg-[#00b964] text-[#0c0e12] rounded-full text-center text-xs font-display font-extrabold uppercase tracking-wider block transition-all shadow"
                >
                  Apply for Executive Board
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
