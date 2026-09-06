'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <PageHeader title="Privacy Policy" subtitle="Data Privacy & Protection" />
      
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-8 text-zinc-300 text-xs md:text-sm leading-relaxed">
        <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase">1. Information Collection</h2>
          <p>
            When registering for GFG SVEC chapter recruitment or events, we collect candidate information including name, roll number, academic year, section, portfolio links, and uploaded resume PDFs.
          </p>
        </section>

        <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase">2. Use of Information</h2>
          <p>
            All submitted candidate information and uploaded resumes are used exclusively by the executive evaluation panel for recruitment, interview slot scheduling, and attendance verification.
          </p>
        </section>

        <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white uppercase">3. Document Security</h2>
          <p>
            Uploaded resume PDFs are stored in non-public secure server directories (`/storage/resumes`) and are never exposed publicly or shared with unauthorized third parties.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
