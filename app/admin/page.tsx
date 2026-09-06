'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Database, 
  ExternalLink, 
  FileText, 
  Layers, 
  Activity,
  Calendar,
  AlertTriangle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { ROLE_DISPLAY_NAMES } from '@/lib/roles';

interface MetricData {
  stats: {
    totalCount: number;
    targetCount: number;
    secondYearCount: number;
    thirdYearCount: number;
    todayCount: number;
    yesterdayCount: number;
    trendPercentage: number;
    conversionRate: number;
    interviewedCount: number;
    selectedCount: number;
    rejectedCount: number;
    underReviewCount: number;
    newCount: number;
  };
  domainCounts: Record<string, number>;
  branchCounts: Record<string, number>;
  slotCounts: Record<string, number>;
  slotCapacity: number;
  recentApplicants: Array<{
    id: string;
    applicationId: string;
    name: string;
    rollNumber: string;
    year: string;
    branch: string | null;
    section: string;
    interestedFields: string[];
    applicationStatus: string;
    createdAt: string;
  }>;
  systemStatus: {
    database: string;
    databaseEngine: string;
    pingMs: number;
    totalRecords: number;
  };
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MetricData | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const fetchMetrics = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading Hiring Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  const { stats, domainCounts, branchCounts, slotCounts, slotCapacity, recentApplicants, systemStatus } = data;
  const targetProgress = Math.min(100, Math.round((stats.totalCount / stats.targetCount) * 100));

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 flex font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black tracking-wider text-white uppercase">Admin Dashboard</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                Live Ops
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              REAL-TIME HIRING METRICS & RECRUITMENT OPERATIONS
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right font-mono hidden sm:block">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Last Updated</p>
              <p className="text-xs font-bold text-emerald-400">{lastRefreshed || 'Just now'}</p>
            </div>
            <button
              onClick={fetchMetrics}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-[#141820] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold font-mono text-zinc-300 transition-all uppercase tracking-wider disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isRefreshing ? 'Refreshing' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Total Applications Card */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Total Applications</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white">{stats.totalCount}</span>
                <span className="text-xs font-mono text-zinc-500">/ {stats.targetCount} target</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>Target Progress</span>
                <span className="text-emerald-400 font-bold">{targetProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${targetProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1">
                <span>2nd Year: <strong className="text-zinc-300">{stats.secondYearCount}</strong></span>
                <span>3rd Year: <strong className="text-zinc-300">{stats.thirdYearCount}</strong></span>
              </div>
            </div>
          </div>

          {/* 2. Today's Registrations Card */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Today&apos;s Registrations</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-white">{stats.todayCount}</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  stats.trendPercentage >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {stats.trendPercentage >= 0 ? `+${stats.trendPercentage}%` : `${stats.trendPercentage}%`} vs yesterday
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Yesterday&apos;s Total:</span>
              <span className="text-white font-bold">{stats.yesterdayCount} applicants</span>
            </div>
          </div>

          {/* 3. Interview Conversion Rate Card */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Interview Conversion</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white">{stats.conversionRate}%</span>
                <span className="text-xs font-mono text-zinc-500">processed</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/60 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase">Selected</span>
                <span className="text-xs font-bold text-emerald-400">{stats.selectedCount}</span>
              </div>
              <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase">Pending</span>
                <span className="text-xs font-bold text-amber-400">{stats.newCount + stats.underReviewCount}</span>
              </div>
              <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
                <span className="text-[9px] text-zinc-500 block uppercase">Rejected</span>
                <span className="text-xs font-bold text-red-400">{stats.rejectedCount}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 2x2 Critical Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Metric 1: Domain Distribution */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Domain Distribution</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Applicants per Domain</span>
            </div>

            <div className="space-y-3 pt-1">
              {Object.entries(domainCounts).map(([key, count]) => {
                const percentage = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-300">{ROLE_DISPLAY_NAMES[key] || key}</span>
                      <div className="space-x-2">
                        <span className="text-emerald-400 font-bold">{count}</span>
                        <span className="text-zinc-500">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500/80 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, percentage * 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metric 2: Branch & Year Breakdown */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Branch & Academic Breakdown</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Registered Streams</span>
            </div>

            {/* Year Ratio Bar */}
            <div className="space-y-2 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">2nd vs 3rd Year Ratio</span>
                <span className="text-white font-bold">{stats.secondYearCount} : {stats.thirdYearCount}</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${stats.totalCount > 0 ? (stats.secondYearCount / stats.totalCount) * 100 : 50}%` }}
                />
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${stats.totalCount > 0 ? (stats.thirdYearCount / stats.totalCount) * 100 : 50}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
                <span className="text-emerald-400">■ 2nd Year ({stats.totalCount > 0 ? Math.round((stats.secondYearCount / stats.totalCount) * 100) : 0}%)</span>
                <span className="text-blue-400">■ 3rd Year ({stats.totalCount > 0 ? Math.round((stats.thirdYearCount / stats.totalCount) * 100) : 0}%)</span>
              </div>
            </div>

            {/* Branch Grid */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Branch Tally</span>
              <div className="grid grid-cols-2 gap-2 font-mono">
                {Object.entries(branchCounts).map(([branch, count]) => (
                  <div key={branch} className="flex justify-between items-center bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60 text-xs">
                    <span className="text-zinc-400 font-bold">{branch}</span>
                    <span className="text-emerald-400 font-black">{count}</span>
                  </div>
                ))}
                {Object.keys(branchCounts).length === 0 && (
                  <div className="col-span-2 text-center text-xs text-zinc-600 font-mono py-4">No branch data recorded yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Metric 3: Interview Slot Capacity */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Interview Slot Capacity</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Max 50 / Slot</span>
            </div>

            <div className="space-y-3 pt-1">
              {Object.entries(slotCounts).map(([slotName, count]) => {
                const isFull = count >= slotCapacity;
                const percent = Math.min(100, Math.round((count / slotCapacity) * 100));
                return (
                  <div key={slotName} className="space-y-1.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-200 font-medium truncate max-w-[220px]">{slotName}</span>
                      <div className="space-x-1.5">
                        <span className={`font-bold ${isFull ? 'text-red-400' : 'text-amber-400'}`}>{count}</span>
                        <span className="text-zinc-500">/ {slotCapacity}</span>
                        {isFull && <span className="text-[9px] font-bold bg-red-950/80 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">FULL</span>}
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isFull ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metric 4: Review & Selection Funnel */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Review & Selection Funnel</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Status Lifecycle</span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono pt-1">
              <div className="bg-blue-950/20 border border-blue-500/30 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">NEW SUBMISSIONS</span>
                <span className="text-2xl font-black text-white">{stats.newCount}</span>
                <p className="text-[10px] text-zinc-500">Awaiting initial triage</p>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">UNDER REVIEW</span>
                <span className="text-2xl font-black text-white">{stats.underReviewCount}</span>
                <p className="text-[10px] text-zinc-500">Panel evaluating dossier</p>
              </div>

              <div className="bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">INTERVIEWED</span>
                <span className="text-2xl font-black text-white">{stats.interviewedCount}</span>
                <p className="text-[10px] text-zinc-500">Live rubric rated</p>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">SELECTED</span>
                <span className="text-2xl font-black text-white">{stats.selectedCount}</span>
                <p className="text-[10px] text-zinc-500">Offered club membership</p>
              </div>
            </div>
          </div>

        </div>

        {/* 5 Recent Applications Section */}
        <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-4">
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Recent Applications</h3>
              <p className="text-xs text-zinc-500 font-mono">Latest candidates submitted to GFG SVEC recruitment pool</p>
            </div>
            <Link
              href="/admin/gfg-hiring"
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
            >
              <span>View All Applications</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Application ID</th>
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3">Roll Number</th>
                  <th className="py-3 px-3">Year / Branch</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {recentApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-3 text-emerald-400 font-bold">{app.applicationId}</td>
                    <td className="py-3.5 px-3 font-semibold text-white">{app.name}</td>
                    <td className="py-3.5 px-3 text-zinc-400">{app.rollNumber}</td>
                    <td className="py-3.5 px-3 text-zinc-400">
                      {app.year} {app.branch ? `• ${app.branch}` : ''} ({app.section})
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.applicationStatus === 'SELECTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        app.applicationStatus === 'INTERVIEWED' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                        app.applicationStatus === 'UNDER_REVIEW' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        app.applicationStatus === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {app.applicationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/admin/gfg-hiring/${app.id}`}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-emerald-600 text-zinc-300 hover:text-white rounded-lg border border-zinc-800 hover:border-emerald-500 font-bold transition-all text-[11px] inline-flex items-center space-x-1"
                      >
                        <span>View Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentApplicants.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-600">
                      No applications submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Status Indicator Footer */}
        <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="space-x-2">
              <span className="text-zinc-400 uppercase font-bold">System Status:</span>
              <span className="text-emerald-400 font-bold">{systemStatus.database}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">{systemStatus.databaseEngine}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-zinc-500 text-[11px]">
            <span>DB Latency: <strong className="text-zinc-300">{systemStatus.pingMs}ms</strong></span>
            <span>Total Records: <strong className="text-zinc-300">{systemStatus.totalRecords}</strong></span>
          </div>
        </div>

      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
