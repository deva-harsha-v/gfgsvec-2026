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
      <PageHeader title="Core Team & Leads" subtitle="The Minds Behind GFG SVEC" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight">Executive Leadership 2025-26</h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed font-medium">
            Meet the student organizers, technical leads, and designers building the GeeksforGeeks chapter experience at Sri Vasavi Engineering College.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-colors shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-emerald-500/30 text-emerald-400 font-black text-xl flex items-center justify-center shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase text-white">{member.name}</h3>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase">{member.role}</p>
                    <span className="inline-block text-[9px] text-zinc-500 font-mono uppercase bg-zinc-950 px-2 py-0.5 rounded mt-1">
                      {member.division}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-medium">{member.bio}</p>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-zinc-800/60 font-mono text-[10px]">
                <a href={member.github} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors" aria-label="GitHub">
                  GitHub
                </a>
                <span>•</span>
                <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors" aria-label="LinkedIn">
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
