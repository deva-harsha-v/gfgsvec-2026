'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "K. Teja Swaroop",
      role: "EXECUTIVE LEAD",
      division: "Executive Board",
      bio: "Oversees overall chapter strategy, corporate outreach, and hackathon execution.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      initials: "TS",
      badgeColor: "bg-[#00b964] text-[#0c0e12]"
    },
    {
      name: "S. Ananya",
      role: "DESIGN & MEDIA LEAD",
      division: "Creative & Media",
      bio: "Leads UI/UX design systems, poster artwork, and social branding campaigns.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      initials: "SA",
      badgeColor: "bg-[#f59e0b] text-[#0c0e12]"
    },
    {
      name: "P. Vamsi Krishna",
      role: "COMPETITIVE LEAD",
      division: "Technical Division",
      bio: "Curates DSA problems, contest testcases, and algorithmic training sessions.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      initials: "VK",
      badgeColor: "bg-[#00b964] text-[#0c0e12]"
    },
    {
      name: "R. Harshavardhan",
      role: "WEB & DEV LEAD",
      division: "Technical Division",
      bio: "Manages chapter web platforms, full-stack open-source projects, and APIs.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      initials: "RH",
      badgeColor: "bg-[#00b964] text-[#0c0e12]"
    },
    {
      name: "M. Sai Ram",
      role: "OUTREACH LEAD",
      division: "Operations",
      bio: "Handles corporate partnerships, guest speaker logistics, and student communication.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      initials: "SR",
      badgeColor: "bg-[#f59e0b] text-[#0c0e12]"
    },
    {
      name: "K. Divya Sri",
      role: "EVENT LEAD",
      division: "Operations",
      bio: "Coordinates workshop scheduling, venue logistics, and on-ground contest execution.",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      initials: "DS",
      badgeColor: "bg-[#f59e0b] text-[#0c0e12]"
    }
  ];

  return (
    <PublicLayout>
      <PageHeader title="Executive Core Team" subtitle="LEADERSHIP · EXECUTIVE BOARD" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-12">
        
        {/* Eyebrow Line + Rule */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-xs font-mono font-bold text-[#00b964] uppercase tracking-widest">
            <span>LEADERSHIP</span>
            <span>·</span>
            <span>EXECUTIVE BOARD</span>
            <div className="h-[1px] bg-[#1e2632] flex-grow max-w-xs" />
          </div>

          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-[#f8fafc] tracking-tight">
            OUR EXECUTIVE <span className="text-[#00b964] italic">CORE TEAM.</span>
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] max-w-2xl leading-relaxed">
            Meet the student leads, developers, and designers managing the GeeksforGeeks chapter experience at Sri Vasavi Engineering College.
          </p>
        </div>

        {/* 3-Up Grid of Portrait Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx}
              className="bg-[#141820] border border-[#1e2632] rounded-3xl overflow-hidden shadow-xl hover:border-[#00b964]/40 transition-colors group flex flex-col justify-between"
            >
              {/* Photo Area with Dark Vignette & Overlaid Role Badge */}
              <div className="relative h-64 bg-gradient-to-b from-[#1a212b] to-[#0c0e12] flex items-center justify-center border-b border-[#1e2632] overflow-hidden">
                {/* Initial Avatar */}
                <span className="font-display font-black text-6xl text-[#94a3b8]/20 select-none group-hover:scale-110 transition-transform">
                  {member.initials}
                </span>

                {/* Overlaid Role Badge Pill (Bottom-Left) */}
                <div className="absolute bottom-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-lg ${member.badgeColor}`}>
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 space-y-3">
                <h3 className="font-display font-black text-lg text-[#f8fafc] uppercase italic group-hover:text-[#00b964] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed font-normal">
                  {member.bio}
                </p>

                <div className="pt-3 border-t border-[#1e2632] flex items-center space-x-3 font-mono text-xs">
                  <a href={member.github} target="_blank" rel="noreferrer" className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                    GitHub
                  </a>
                  <span>•</span>
                  <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-[#94a3b8] hover:text-[#00b964] transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
