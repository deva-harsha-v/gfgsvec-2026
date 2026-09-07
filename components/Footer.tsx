import Link from 'next/link';
import { RECRUITMENT_ROLES } from '@/lib/roles';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0c0e12] border-t border-[#1e2632] text-[#94a3b8] font-body z-10 relative overflow-hidden">
      
      {/* 1. Multi-Column Link Grid + Brand Block */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 relative z-10">
        
        {/* Brand Block */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center space-x-3 text-[#f8fafc]">
            <div className="w-8 h-8 text-[#00b964] flex items-center justify-center shrink-0">
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-display font-extrabold text-base uppercase text-[#f8fafc]">GeeksforGeeks</h4>
              <p className="text-[10px] text-[#00b964] font-mono font-semibold uppercase">SVEC Student Chapter</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[#94a3b8] max-w-sm font-normal">
            Empowering students at Sri Vasavi Engineering College through algorithms, software engineering, UI design systems, and campus leadership events.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#141820] border border-[#1e2632] hover:border-[#00b964] hover:text-[#00b964] transition-colors text-[#f1f5f9] text-[11px] font-bold">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#141820] border border-[#1e2632] hover:border-[#00b964] hover:text-[#00b964] transition-colors text-[#f1f5f9] text-[11px] font-bold">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#141820] border border-[#1e2632] hover:border-[#00b964] hover:text-[#00b964] transition-colors text-[#f1f5f9] text-[11px] font-bold">
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-xl bg-[#141820] border border-[#1e2632] hover:border-[#00b964] hover:text-[#00b964] transition-colors text-[#f1f5f9] text-[11px] font-bold">
              X
            </a>
          </div>
        </div>

        {/* Column 1: Navigate */}
        <div className="space-y-3.5">
          <h4 className="text-[#f8fafc] text-xs font-display font-extrabold uppercase tracking-wider border-l-2 border-[#f59e0b] pl-2.5">
            Navigate
          </h4>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link href="/" className="hover:text-[#00b964] transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-[#00b964] transition-colors">About</Link></li>
            <li><Link href="/team" className="hover:text-[#00b964] transition-colors">Team</Link></li>
            <li><Link href="/events" className="hover:text-[#00b964] transition-colors">Events</Link></li>
            <li><Link href="/#roles" className="hover:text-[#00b964] transition-colors">Roles</Link></li>
            <li><Link href="/projects" className="hover:text-[#00b964] transition-colors">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-[#00b964] transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Column 2: Join Us */}
        <div className="space-y-3.5">
          <h4 className="text-[#f8fafc] text-xs font-display font-extrabold uppercase tracking-wider border-l-2 border-[#00b964] pl-2.5">
            Join Us
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="pb-1 border-b border-[#1e2632] font-mono text-[#f59e0b] font-semibold">
              <Link href="/clubs/gfg/hiring/apply" className="hover:underline flex items-center justify-between">
                <span>Apply Now</span>
                <ArrowUpRight size={12} />
              </Link>
            </li>
            {RECRUITMENT_ROLES.map((role) => (
              <li key={role.key}>
                <Link 
                  href={`/clubs/gfg/hiring/apply?role=${role.slug}`}
                  className="hover:text-[#00b964] transition-colors flex items-center justify-between text-[11px]"
                >
                  <span>{role.displayName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Community */}
        <div className="space-y-3.5">
          <h4 className="text-[#f8fafc] text-xs font-display font-extrabold uppercase tracking-wider border-l-2 border-[#00b964] pl-2.5">
            Community
          </h4>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link href="/events" className="hover:text-[#00b964] transition-colors">Past Events</Link></li>
            <li><Link href="/blog" className="hover:text-[#00b964] transition-colors">Blog</Link></li>
            <li>
              <a href="https://github.com/deva-harsha-v/gfgsvec-2026" target="_blank" rel="noreferrer" className="hover:text-[#00b964] transition-colors flex items-center space-x-1">
                <span>Contribute</span>
                <ArrowUpRight size={10} />
              </a>
            </li>
            <li>
              <Link href="/clubs/gfg/hiring" className="hover:text-[#00b964] transition-colors flex items-center space-x-1">
                <span>Site Status</span>
                <span className="w-1.5 h-1.5 bg-[#00b964] rounded-full shrink-0" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div className="space-y-3.5">
          <h4 className="text-[#f8fafc] text-xs font-display font-extrabold uppercase tracking-wider border-l-2 border-[#00b964] pl-2.5">
            Legal
          </h4>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link href="/privacy" className="hover:text-[#00b964] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#00b964] transition-colors">Terms of Use</Link></li>
            <li><Link href="/terms" className="hover:text-[#00b964] transition-colors">Guidelines</Link></li>
            <li><Link href="/contact" className="hover:text-[#00b964] transition-colors">Contact Us</Link></li>
            <li><Link href="/admin/login" className="hover:text-[#00b964] transition-colors">Admin</Link></li>
          </ul>
        </div>

      </div>

      {/* 2. Horizontal Divider Rule */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <hr className="border-[#1e2632]" />
      </div>

      {/* 3. Bottom Copyright & "Made with ❤" Row */}
      <div className="py-5 text-xs font-mono text-[#64748b] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; {new Date().getFullYear()} GFG SVEC. All rights reserved.</span>
          <span className="text-[#94a3b8]">Made with <span className="text-red-500">❤</span> by the GFG Core Team</span>
        </div>
      </div>

      {/* 4. Large Solid Display Wordmark with Radial Brand Glow */}
      <div className="w-full text-center pointer-events-none select-none overflow-hidden relative z-10 pt-4 pb-8 border-t border-[#1e2632]/40">
        
        {/* Soft Radial Gradient Glow (Brand Green & Teal Accent) */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[85vw] max-w-[1000px] h-[200px] bg-gradient-to-r from-[#00b964]/35 via-[#00e575]/30 to-[#06b6d4]/25 blur-[110px] rounded-full" />
        </div>

        {/* Solid High-Contrast White Display Wordmark */}
        <span className="font-display font-black text-[13vw] sm:text-[14vw] lg:text-[16vw] tracking-tighter uppercase leading-none block text-[#f8fafc] relative z-10 drop-shadow-[0_8px_30px_rgba(0,185,100,0.3)]">
          GFG SVEC
        </span>
      </div>

    </footer>
  );
}
