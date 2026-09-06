'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { RECRUITMENT_ROLES, ROLE_DISPLAY_NAMES } from '@/lib/roles';
import { 
  Users, 
  UserCheck, 
  Award, 
  Search, 
  Download, 
  ExternalLink, 
  Loader2, 
  CalendarClock,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';

interface Applicant {
  id: string;
  applicationId: string;
  name: string;
  rollNumber: string;
  year: string;
  branch: string | null;
  section: string;
  interestedFields: string[];
  interviewSlot: string | null;
  interviewPresented: boolean;
  applicationStatus: 'NEW' | 'UNDER_REVIEW' | 'INTERVIEWED' | 'SELECTED' | 'REJECTED';
  submittedAt: string;
}

interface Stats {
  totalCount: number;
  presentedCount: number;
  ratedCount: number;
  selectedCount: number;
  rejectedCount: number;
}

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams ? searchParams.get('tab') : null;

  const [activeTab, setActiveTab] = useState<'applications' | 'slots'>(
    initialTab === 'slots' ? 'slots' : 'applications'
  );

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  
  // Filters State
  const [searchVal, setSearchVal] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [domainFilter, setDomainFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Slot Breakdown State
  const [slotData, setSlotData] = useState<Record<string, Applicant[]>>({
    '13th August - Forenoon Session': [],
    '13th August - Afternoon Session': [],
    '14th August - Forenoon Session': [],
    '14th August - Afternoon Session': [],
  });

  const router = useRouter();

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchVal,
        status: statusFilter,
        domain: domainFilter,
        year: yearFilter,
        branch: branchFilter,
        page: String(page),
        limit: '15',
      });

      const res = await fetch(`/api/admin/applications?${query.toString()}`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setApplicants(data.applications || []);
        setTotalPages(data.pagination?.totalPages || 1);
        
        if (data.stats) {
          setStats({
            totalCount: data.stats.totalCount,
            presentedCount: data.stats.presentedCount,
            ratedCount: data.stats.ratedCount,
            selectedCount: data.stats.selectedCount || 0,
            rejectedCount: data.stats.totalCount - (data.stats.presentedCount || 0),
          });
        }
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, [searchVal, statusFilter, domainFilter, yearFilter, branchFilter, page, router]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Fetch slot breakdown when slots tab is active
  const fetchSlotBreakdown = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/applications?limit=200');
      if (res.ok) {
        const json = await res.json();
        const apps: Applicant[] = json.applications || [];
        const grouped: Record<string, Applicant[]> = {
          '13th August - Forenoon Session': [],
          '13th August - Afternoon Session': [],
          '14th August - Forenoon Session': [],
          '14th August - Afternoon Session': [],
        };

        apps.forEach((app) => {
          if (app.interviewSlot && grouped[app.interviewSlot]) {
            grouped[app.interviewSlot].push(app);
          }
        });

        setSlotData(grouped);
      }
    } catch (err) {
      console.error('Failed to load slot breakdown:', err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'slots') {
      fetchSlotBreakdown();
    }
  }, [activeTab, fetchSlotBreakdown]);

  // Export handlers
  const handleExportAll = () => window.open('/api/admin/export', '_blank');
  const handleExport13th = () => window.open('/api/admin/export-reviewed?day=13th', '_blank');
  const handleExport14th = () => window.open('/api/admin/export-reviewed?day=14th', '_blank');
  const handleExportAttendance = () => window.open('/api/admin/export-attendance', '_blank');

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 flex font-sans">
      <AdminSidebar currentTab={activeTab === 'slots' ? 'slots' : undefined} />

      <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-wider text-white uppercase">Applicant Directory & Slots</h1>
            <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              FILTER, MANAGE, AND EVALUATE RECRUITMENT DOSSIERS
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportAll}
              className="px-3.5 py-2 bg-[#141820] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold font-mono text-zinc-300 transition-all flex items-center space-x-1.5 uppercase"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExport13th}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 uppercase"
            >
              <Download className="w-3.5 h-3.5" />
              <span>13th Reviewed</span>
            </button>
            <button
              onClick={handleExport14th}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 uppercase"
            >
              <Download className="w-3.5 h-3.5" />
              <span>14th Reviewed</span>
            </button>
            <button
              onClick={handleExportAttendance}
              className="px-3.5 py-2 bg-[#141820] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold font-mono text-zinc-300 transition-all flex items-center space-x-1.5 uppercase"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Attendance QR</span>
            </button>
          </div>
        </div>

        {/* 5-Card Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <span className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-wider">Total Applications</span>
            <span className="text-2xl font-black text-white mt-1">{stats?.totalCount ?? '-'}</span>
          </div>
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <span className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-wider">Presented</span>
            <span className="text-2xl font-black text-emerald-400 mt-1">{stats?.presentedCount ?? '-'}</span>
          </div>
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <span className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-wider">Evaluated / Rated</span>
            <span className="text-2xl font-black text-purple-400 mt-1">{stats?.ratedCount ?? '-'}</span>
          </div>
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <span className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-wider">Selected</span>
            <span className="text-2xl font-black text-emerald-400 mt-1">{stats?.selectedCount ?? '-'}</span>
          </div>
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-lg col-span-2 md:col-span-1">
            <span className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-wider">Rejected / Absent</span>
            <span className="text-2xl font-black text-red-400 mt-1">{stats?.rejectedCount ?? '-'}</span>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex border-b border-zinc-800/80 space-x-6 font-mono text-xs">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'applications'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applications List</span>
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`pb-3 font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'slots'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Interview Slot Breakdown</span>
          </button>
        </div>

        {/* TAB 1: APPLICATIONS LIST */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            
            {/* Multi-column Filter Controls */}
            <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60 pb-3">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <span>Search & Multi-Column Filters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
                
                {/* Search Bar */}
                <div className="relative col-span-1 sm:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by Roll No or Name..."
                    value={searchVal}
                    onChange={(e) => {
                      setSearchVal(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-[#141820] border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-emerald-500 transition-all font-mono"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="bg-[#141820] border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="All">Status: All</option>
                  <option value="NEW">Status: New</option>
                  <option value="UNDER_REVIEW">Status: Under Review</option>
                  <option value="INTERVIEWED">Status: Interviewed</option>
                  <option value="SELECTED">Status: Selected</option>
                  <option value="REJECTED">Status: Rejected</option>
                </select>

                {/* Domain Filter */}
                <select
                  value={domainFilter}
                  onChange={(e) => { setDomainFilter(e.target.value); setPage(1); }}
                  className="bg-[#141820] border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="All">Domain: All</option>
                  {RECRUITMENT_ROLES.map((role) => (
                    <option key={role.key} value={role.key}>
                      Domain: {ROLE_DISPLAY_NAMES[role.key] || role.key}
                    </option>
                  ))}
                </select>

                {/* Year Filter */}
                <select
                  value={yearFilter}
                  onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
                  className="bg-[#141820] border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="All">Year: All</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                </select>

              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 font-mono text-xs">
                  No applicants found matching the applied filter criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="bg-[#141820] border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3.5 px-4">Application ID</th>
                        <th className="py-3.5 px-4">Candidate Name</th>
                        <th className="py-3.5 px-4">Roll Number</th>
                        <th className="py-3.5 px-4">Academic</th>
                        <th className="py-3.5 px-4">Interested Domains</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {applicants.map((app) => (
                        <tr key={app.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-4 px-4 font-bold text-emerald-400">{app.applicationId}</td>
                          <td className="py-4 px-4 font-bold text-white">{app.name}</td>
                          <td className="py-4 px-4 text-zinc-300">{app.rollNumber}</td>
                          <td className="py-4 px-4 text-zinc-400">
                            {app.year} {app.branch ? `• ${app.branch}` : ''} ({app.section})
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {app.interestedFields.slice(0, 2).map((field) => (
                                <span key={field} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded text-[9px] uppercase font-bold">
                                  {ROLE_DISPLAY_NAMES[field] || field}
                                </span>
                              ))}
                              {app.interestedFields.length > 2 && (
                                <span className="px-1.5 py-0.5 bg-zinc-900 text-zinc-500 rounded text-[9px]">
                                  +{app.interestedFields.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              app.applicationStatus === 'SELECTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              app.applicationStatus === 'INTERVIEWED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                              app.applicationStatus === 'UNDER_REVIEW' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                              app.applicationStatus === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                              'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            }`}>
                              {app.applicationStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link
                              href={`/admin/gfg-hiring/${app.id}`}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs inline-flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-950/20"
                            >
                              <span>View Dossier & Rubric</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between font-mono text-xs">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="px-4 py-2 bg-[#141820] border border-zinc-800 rounded-xl text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all uppercase font-bold"
                  >
                    Previous
                  </button>
                  <span className="text-zinc-500">Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong></span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="px-4 py-2 bg-[#141820] border border-zinc-800 rounded-xl text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all uppercase font-bold"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: INTERVIEW SLOT BREAKDOWN */}
        {activeTab === 'slots' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(slotData).map(([slotTitle, candidates]) => {
              const capacity = 50;
              const count = candidates.length;
              const isFull = count >= capacity;

              return (
                <div key={slotTitle} className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-start border-b border-zinc-800/60 pb-3">
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white uppercase">{slotTitle}</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">Maximum Capacity: 50 Candidates</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      isFull ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {count} / {capacity} Booked
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 font-mono text-xs pr-1">
                    {candidates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/60 hover:border-zinc-700 transition-all">
                        <div>
                          <p className="font-bold text-white">{c.name}</p>
                          <p className="text-[11px] text-zinc-400">{c.rollNumber} • {c.year} ({c.section})</p>
                        </div>
                        <Link
                          href={`/admin/gfg-hiring/${c.id}`}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                    {candidates.length === 0 && (
                      <div className="text-center py-10 text-zinc-600 text-xs">
                        No candidates booked for this slot yet.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
