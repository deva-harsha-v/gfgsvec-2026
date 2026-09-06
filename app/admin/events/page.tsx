'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Archive, 
  FileText, 
  Users, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';

interface RecruitmentCycleItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  posterImageUrl: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  opensAt: string;
  closesAt: string;
  createdAt: string;
  formFields: Array<{ id: string; label: string; fieldKey: string }>;
  _count: {
    applicants: number;
  };
}

export default function AdminEventsPage() {
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<RecruitmentCycleItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchCycles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/cycles');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setCycles(json);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load recruitment cycles.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  const handlePublishToggle = async (cycleId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'CLOSED' : 'PUBLISHED';
    setPublishingId(cycleId);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cycles/${cycleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update cycle status.');
      }

      fetchCycles();
    } catch (err: any) {
      setError(err.message || 'Error updating status.');
    } finally {
      setPublishingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading Events & Recruitment Cycles...</p>
        </div>
      </div>
    );
  }

  const publishedCycle = cycles.find((c) => c.status === 'PUBLISHED');

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 flex font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black tracking-wider text-white uppercase">Events & Recruitment Cycles</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                {cycles.length} Total Cycles
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              DYNAMIC FORM BUILDER, ATOMIC PUBLISHING & EVENT HISTORY
            </p>
          </div>

          <Link
            href="/admin/events/new"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-emerald-950/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event Drive</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Currently Published Active Banner */}
        {publishedCycle ? (
          <div className="bg-gradient-to-r from-emerald-950/40 via-[#10141d] to-[#10141d] border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-black uppercase">
                    LIVE PUBLISHED CYCLE
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Slug: /{publishedCycle.slug}</span>
                </div>
                <h2 className="text-xl font-black text-white">{publishedCycle.title}</h2>
                <p className="text-xs text-zinc-300 max-w-2xl">{publishedCycle.shortDescription}</p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-zinc-500 text-[10px] uppercase block">Applications</span>
                <span className="text-2xl font-black text-emerald-400">{publishedCycle._count.applicants}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800/80 font-mono text-xs">
              <div className="flex items-center space-x-4 text-zinc-400 text-[11px]">
                <span>Opens: <strong className="text-white">{new Date(publishedCycle.opensAt).toLocaleString()}</strong></span>
                <span>Closes: <strong className="text-white">{new Date(publishedCycle.closesAt).toLocaleString()}</strong></span>
                <span>Form Fields: <strong className="text-white">{publishedCycle.formFields.length} custom questions</strong></span>
              </div>

              <button
                onClick={() => handlePublishToggle(publishedCycle.id, publishedCycle.status)}
                disabled={publishingId === publishedCycle.id}
                className="px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-400 rounded-lg font-bold text-[10px] uppercase transition-all flex items-center space-x-1.5 disabled:opacity-50"
              >
                {publishingId === publishedCycle.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
                <span>Close Active Event</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#10141d] border border-dashed border-zinc-800 rounded-2xl p-8 text-center space-y-3 font-mono text-xs">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white uppercase">No Active Published Cycle</h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              There is currently no live recruitment drive published on the public site. Publish a draft event below or create a new cycle.
            </p>
          </div>
        )}

        {/* All Recruitment Cycles Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">All Events & Historical Cycles</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cycles.map((cycle) => (
              <div key={cycle.id} className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border ${
                      cycle.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      cycle.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      cycle.status === 'CLOSED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {cycle.status}
                    </span>

                    <span className="text-xs font-mono text-zinc-400 font-bold">
                      {cycle._count.applicants} Applicants
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{cycle.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{cycle.shortDescription}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-800/60 font-mono text-xs">
                  <div className="flex justify-between text-[11px] text-zinc-500">
                    <span>Slug: <strong className="text-zinc-300">/{cycle.slug}</strong></span>
                    <span>Fields: <strong className="text-zinc-300">{cycle.formFields.length}</strong></span>
                  </div>

                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Opens: {new Date(cycle.opensAt).toLocaleDateString()}</span>
                    <span>Closes: {new Date(cycle.closesAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/admin/gfg-hiring?cycleId=${cycle.id}`}
                      className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider inline-flex items-center space-x-1"
                    >
                      <span>Inspect Applications</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {cycle.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handlePublishToggle(cycle.id, cycle.status)}
                        disabled={publishingId === cycle.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase transition-all flex items-center space-x-1 disabled:opacity-50"
                      >
                        {publishingId === cycle.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        <span>Publish Live</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
