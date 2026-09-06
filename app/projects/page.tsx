'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { FolderGit2 } from 'lucide-react';

export default function ProjectsPage() {
  const projects = [
    {
      title: "SVEC Scan-Based Attendance Portal",
      category: "Full Stack Software",
      description: "An automated barcode & QR verification scanner system built for interview check-ins, candidate slot validations, and date-filtered Excel reports.",
      tech: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS"],
      github: "https://github.com"
    },
    {
      title: "Geeks Intra-College Contest Evaluator",
      category: "Competitive Coding Tool",
      description: "Automated ranking leaderboard and problem set distributor built for chapter coding sprints.",
      tech: ["Node.js", "Express", "REST API", "Python"],
      github: "https://github.com"
    },
    {
      title: "GFG SVEC UI Component Library",
      category: "Design System",
      description: "Figma UI tokens and React Tailwind component library tailored for GFG SVEC chapter web properties.",
      tech: ["Figma", "React", "Tailwind"],
      github: "https://github.com"
    }
  ];

  return (
    <PublicLayout>
      <PageHeader title="Student Projects" subtitle="Open Source & Campus Builds" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-12">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display font-bold text-2xl md:text-4xl uppercase text-[#f8fafc] tracking-tight">Open Source Initiatives</h2>
          <p className="text-xs md:text-sm text-gfg-muted leading-relaxed">
            Discover software platforms, tools, and design systems designed and maintained by chapter members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div 
              key={idx} 
              className="bg-[#141820] border border-[#1e2632] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl hover:border-gfg-emerald/40 transition-colors"
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 bg-[#0c0e12] border border-[#1e2632] text-gfg-amber rounded-md text-[10px] font-mono font-bold uppercase">
                  {proj.category}
                </span>
                <h3 className="font-display font-bold text-base uppercase text-[#f8fafc]">{proj.title}</h3>
                <p className="text-xs text-gfg-muted leading-relaxed font-normal">{proj.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#1e2632]">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-[#0c0e12] text-gfg-muted rounded text-[10px] font-mono font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                <a 
                  href={proj.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-gfg-emerald hover:underline font-bold uppercase"
                >
                  <FolderGit2 size={14} />
                  <span>View Repository</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
