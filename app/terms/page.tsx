'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <PublicLayout>
      <PageHeader title="Terms of Service" subtitle="Chapter Code of Conduct" />
      
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-8 text-zinc-300 text-xs md:text-sm leading-relaxed">
        <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase">1. Chapter Member Expectations</h2>
          <p>
            Members of the GeeksforGeeks SVEC Student Chapter are expected to adhere to academic integrity, collaborative teamwork, and respectful communication in all events and contests.
          </p>
        </section>

        <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase">2. Contest Integrity</h2>
          <p>
            Plagiarism or unauthorized code sharing during competitive programming contests and hackathons is strictly prohibited and results in immediate disqualification.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
