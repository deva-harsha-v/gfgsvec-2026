'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { Award, GraduationCap, Handshake, Users } from 'lucide-react';

export default function AlumniPage() {
  return (
    <PublicLayout>
      <PageHeader title="Alumni Network" subtitle="Vasavi Alumni Association" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16">
        
        {/* Network overview */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Stay Connected</h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              The Vasavi Alumni Association bridges the gap between our distinguished graduates working globally and our active students on campus. Our alumni network includes founders, research scholars, software architects, and tech leaders.
            </p>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              Through mock interviews, mentoring series, placement referrals, and interactive fests, our graduates help build student careers dynamically. We host annual alumni reunions on campus to share milestones.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-slate-800 text-xs font-black uppercase tracking-wider border-l-2 border-blue-500 pl-2">Alumni Activities</h3>
            <ul className="space-y-2.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <li className="flex items-center space-x-2">
                <Handshake className="w-4 h-4 text-blue-500" />
                <span>Mentorship Programs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-blue-500" />
                <span>Distinguished Alumni Awards</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Annual Meetups</span>
              </li>
            </ul>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
