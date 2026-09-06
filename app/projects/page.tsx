'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { FolderGit2, ExternalLink, Code, Layers } from 'lucide-react';

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
      <PageHeader title="Student Projects" subtitle="Built By GFG SVEC Chapter" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight">Open Source & Student Builds</h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed font-medium">
            Discover software platforms, tools, and design systems designed and maintained by chapter members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div 
              key={idx} 
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-colors shadow-xl"
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 bg-emerald-950/60 text-emerald-400 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest">
                  {proj.category}
                </span>
                <h3 className="font-extrabold text-base uppercase text-white">{proj.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">{proj.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-800/60">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-zinc-950 text-zinc-500 rounded text-[9px] font-mono font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
                <a 
                  href={proj.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold uppercase"
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
