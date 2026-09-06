'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { Mail, Code, Sparkles, Globe, Share2 } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "K. Teja Swaroop",
      role: "Overall Chapter Lead / President",
      division: "Executive Board",
      bio: "Oversees overall chapter strategy, corporate outreach, and hackathon execution.",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    {
      name: "S. Ananya",
      role: "Design & Brand Lead",
      division: "Creative & Media",
      bio: "Leads UI/UX design systems, poster artwork, and social branding campaigns.",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    {
      name: "P. Vamsi Krishna",
      role: "Competitive Programming Lead",
      division: "Technical Division",
      bio: "Curates DSA problems, contest testcases, and algorithmic training sessions.",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    {
      name: "R. Harshavardhan",
      role: "Web & Mobile Development Lead",
      division: "Technical Division",
      bio: "Manages chapter web platforms, full-stack open-source projects, and APIs.",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    {
      name: "M. Sai Ram",
      role: "Public Relations & Outreach Lead",
      division: "Operations",
      bio: "Handles corporate partnerships, guest speaker logistics, and student communication.",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    },
    {
      name: "K. Divya Sri",
      role: "Event Management Lead",
      division: "Operations",
      bio: "Coordinates workshop scheduling, venue logistics, and on-ground contest execution.",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    }
  ];

  return (
    <PublicLayout>
      <PageHeader title="Core Team & Leads" subtitle="Executive Leadership 2025-26" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-12">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display font-bold text-2xl md:text-4xl uppercase text-[#f8fafc] tracking-tight">The Student Organizers</h2>
          <p className="text-xs md:text-sm text-gfg-muted leading-relaxed">
            Meet the student leads, developers, and designers managing the GeeksforGeeks chapter experience at Sri Vasavi Engineering College.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx}
              className="bg-[#141820] border border-[#1e2632] rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-gfg-emerald/40 transition-colors shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0c0e12] border border-gfg-emerald/30 text-gfg-emerald font-display font-black text-lg flex items-center justify-center shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm uppercase text-[#f8fafc]">{member.name}</h3>
                    <p className="text-[10px] text-gfg-emerald font-mono font-bold uppercase">{member.role}</p>
                    <span className="inline-block text-[9px] text-gfg-muted font-mono uppercase bg-[#0c0e12] px-2 py-0.5 rounded mt-1 border border-[#1e2632]">
                      {member.division}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gfg-muted leading-relaxed font-normal">{member.bio}</p>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-[#1e2632] font-mono text-[10px]">
                <a href={member.github} target="_blank" rel="noreferrer" className="text-gfg-muted hover:text-[#f8fafc] transition-colors" aria-label="GitHub">
                  GitHub
                </a>
                <span>•</span>
                <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-gfg-muted hover:text-gfg-emerald transition-colors" aria-label="LinkedIn">
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
