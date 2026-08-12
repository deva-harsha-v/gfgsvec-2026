'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import StarRating from '@/components/StarRating';
import { ROLE_DISPLAY_NAMES } from '@/lib/roles';
import { 
  Users, UserCheck, Star, Award, 
  Search, Download, Save, ArrowRight, 
  Loader2, AlertCircle, ExternalLink, FileText 
} from 'lucide-react';

interface Applicant {
  id: string;
  applicationId: string;
  name: string;
  rollNumber: string;
  year: string;
  section: string;
  interestedFields: string[];
  hasPastExperience: boolean;
  pastExperience: string | null;
  previousWorkLinks: string[];
  reasonForJoining: string;
  contribution: string;
  clubKnowledge: string;
  resumePath: string | null;
  interviewSlot: string | null;
  interviewPresented: boolean;
  interviewTechnicalRating: number | null;
  interviewNonTechnicalRating: number | null;
  interviewNotes: string | null;
  applicationStatus: 'NEW' | 'UNDER_REVIEW' | 'INTERVIEWED' | 'SELECTED' | 'REJECTED';
  submittedAt: string;
}

interface Stats {
  totalCount: number;
  presentedCount: number;
  notPresentedCount: number;
  ratedCount: number;
  notRatedCount: number;
  technicalCount: number;
  nonTechnicalCount: number;
}

export default function AdminDashboard() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  
  // Search and Filters
  const [searchVal, setSearchVal] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // All, NotPresented, Presented, Rated, NotRated
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingList, setLoadingList] = useState(false);

  // Selected Applicant
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Applicant | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Evaluation Fields State
  const [evalPresented, setEvalPresented] = useState(false);
  const [evalTechRating, setEvalTechRating] = useState<number | null>(null);
  const [evalNonTechRating, setEvalNonTechRating] = useState<number | null>(null);
  const [evalNotes, setEvalNotes] = useState('');
  const [evalStatus, setEvalStatus] = useState<'NEW' | 'UNDER_REVIEW' | 'INTERVIEWED' | 'SELECTED' | 'REJECTED'>('NEW');
  const [savingEval, setSavingEval] = useState(false);
  const [evalMsg, setEvalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [mobileTab, setMobileTab] = useState<'directory' | 'evaluation'>('directory');
  const [autoSelectFirst, setAutoSelectFirst] = useState(false);

  const router = useRouter();

  // 1. Authenticate Admin and Fetch List
  const fetchList = useCallback(async () => {
    setLoadingList(true);
    try {
      const url = `/api/admin/applications?search=${encodeURIComponent(searchVal)}&filter=${activeFilter}&page=${page}&limit=12`;
      const res = await fetch(url);
      
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      const list = data.applications || [];
      setApplicants(list);
      setTotalPages(data.pagination?.totalPages || 1);
      setStats(data.stats || null);
      
      if (autoSelectFirst && list.length > 0) {
        setSelectedId(list[0].id);
        setMobileTab('evaluation');
        setAutoSelectFirst(false);
      }
      setCheckingAuth(false);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoadingList(false);
    }
  }, [searchVal, activeFilter, page, router, autoSelectFirst]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 2. Fetch Selected Applicant Details
  useEffect(() => {
    if (!selectedId) {
      setSelectedApp(null);
      return;
    }

    const fetchDetail = async () => {
      setLoadingDetail(true);
      setEvalMsg(null);
      try {
        const res = await fetch(`/api/admin/applications/${selectedId}`);
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setSelectedApp(data);
          // Set evaluation form states
          setEvalPresented(data.interviewPresented);
          setEvalTechRating(data.interviewTechnicalRating);
          setEvalNonTechRating(data.interviewNonTechnicalRating);
          setEvalNotes(data.interviewNotes || '');
          setEvalStatus(data.applicationStatus);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [selectedId, router]);

  // 3. Save Evaluation
  const handleSaveEvaluation = async (silent = false): Promise<boolean> => {
    if (!selectedApp) return false;
    setSavingEval(true);
    setEvalMsg(null);

    const payload = {
      interviewPresented: evalPresented,
      interviewTechnicalRating: evalPresented ? evalTechRating : null,
      interviewNonTechnicalRating: evalPresented ? evalNonTechRating : null,
      interviewNotes: evalNotes.trim() === '' ? null : evalNotes,
      applicationStatus: evalStatus,
    };

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to save evaluation.');
      }

      if (!silent) {
        setEvalMsg({ type: 'success', text: 'Evaluation updated successfully!' });
      }
      
      // Update local state in list
      setApplicants((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? result.applicant : a))
      );

      // Refresh Stats
      fetch('/api/admin/applications?limit=1')
        .then(res => res.json())
        .then(d => setStats(d.stats))
        .catch(err => console.error(err));

      setSavingEval(false);
      return true;
    } catch (err: any) {
      setEvalMsg({ type: 'error', text: err.message || 'Error saving.' });
      setSavingEval(false);
      return false;
    }
  };

  // 4. Save & Next Queue Workflow (Context-preserving list transition)
  const handleSaveAndNext = async () => {
    if (!selectedApp) return;

    // First save current
    const saved = await handleSaveEvaluation(true);
    if (!saved) return;

    // Find current index in the active directory list page
    const currentIndex = applicants.findIndex(a => a.id === selectedApp.id);
    
    if (currentIndex > -1 && currentIndex < applicants.length - 1) {
      const nextApp = applicants[currentIndex + 1];
      setSelectedId(nextApp.id);
      setMobileTab('evaluation');
    } else if (page < totalPages) {
      // Go to next page and set flag to select first applicant on load
      setAutoSelectFirst(true);
      setPage(p => p + 1);
    } else {
      setEvalMsg({ type: 'success', text: 'Evaluation saved. No more candidates match the current query.' });
    }
  };

  // Excel Export
  const handleExcelExport = () => {
    window.open('/api/admin/export', '_blank');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Verifying admin session...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AdminNavbar />

      {/* Top Stats Dashboard */}
      {stats && (
        <div className="bg-zinc-900/40 border-b border-zinc-900 px-6 py-6 md:px-10">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">Total Applications</span>
              <span className="text-2xl font-black text-white mt-1">{stats.totalCount}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">Presented</span>
              <span className="text-2xl font-black text-emerald-400 mt-1">{stats.presentedCount}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">Not Presented</span>
              <span className="text-2xl font-black text-red-400 mt-1">{stats.notPresentedCount}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">Rated Candidates</span>
              <span className="text-2xl font-black text-white mt-1">{stats.ratedCount}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-center col-span-2 md:col-span-1">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">Need Evaluation</span>
              <span className="text-2xl font-black text-amber-500 mt-1">{stats.notRatedCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col">
        
        {/* Mobile View Switcher Tabs */}
        <div className="flex lg:hidden w-full border border-zinc-800 rounded-xl overflow-hidden mb-6">
          <button
            onClick={() => setMobileTab('directory')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
              mobileTab === 'directory' ? 'bg-zinc-800 text-emerald-400' : 'bg-zinc-950 text-zinc-500'
            }`}
          >
            Directory ({applicants.length})
          </button>
          <button
            onClick={() => setMobileTab('evaluation')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
              mobileTab === 'evaluation' ? 'bg-zinc-800 text-emerald-400' : 'bg-zinc-950 text-zinc-500'
            }`}
          >
            Evaluation Console
            {selectedApp && <span className="absolute top-2 right-4 w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
          </button>
        </div>

        {/* Responsive Dual Pane Container */}
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
          
          {/* LEFT PANE: Candidates List, Search, Filters */}
          <div className={`w-full lg:w-3/5 bg-zinc-900/20 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-6 ${
            mobileTab === 'directory' ? 'block' : 'hidden lg:block'
          }`}>
            
            {/* Action Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h3 className="text-md font-bold uppercase tracking-wider text-white">Applicants Directory</h3>
              
              <button
                onClick={handleExcelExport}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
              >
                <Download size={14} />
                <span>Export Excel</span>
              </button>
            </div>

            {/* Search Box & Tab Filter */}
            <div className="space-y-4">
              {/* Search by Roll Number ONLY */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by Roll Number only..."
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-mono"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-1.5 border-b border-zinc-800/40 pb-2">
                {[
                  { name: 'All', val: 'All' },
                  { name: 'Not Presented', val: 'NotPresented' },
                  { name: 'Presented', val: 'Presented' },
                  { name: 'Rated', val: 'Rated' },
                  { name: 'Not Rated', val: 'NotRated' },
                ].map((tab) => (
                  <button
                    key={tab.val}
                    onClick={() => {
                      setActiveFilter(tab.val);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                      activeFilter === tab.val
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Table list */}
            {loadingList ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 text-zinc-600 animate-spin" />
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800/60 rounded-2xl text-zinc-500 text-sm">
                No matching applicants found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800/60 text-zinc-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2 font-mono">ID</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2 font-mono">Roll Number</th>
                      <th className="py-3 px-2 text-center">Year</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-center">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => {
                      const isSelected = selectedId === app.id;
                      return (
                        <tr
                          key={app.id}
                          onClick={() => {
                            setSelectedId(app.id);
                            setMobileTab('evaluation'); // Auto-switch to evaluation panel on mobile click
                          }}
                          className={`border-b border-zinc-900/60 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-500/5 text-white border-l-2 border-l-emerald-500'
                              : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
                          }`}
                        >
                          <td className="py-3 px-2 font-mono font-semibold text-zinc-300">
                            {app.applicationId.replace('GFG-SVEC-2026-', '')}
                          </td>
                          <td className="py-3 px-2 font-bold max-w-[120px] truncate">{app.name}</td>
                          <td className="py-3 px-2 font-mono font-semibold">{app.rollNumber}</td>
                          <td className="py-3 px-2 text-center truncate">{app.year.replace(' Year', '')}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                              app.applicationStatus === 'SELECTED'
                                ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                                : app.applicationStatus === 'REJECTED'
                                ? 'bg-red-950/40 border-red-500/20 text-red-400'
                                : app.applicationStatus === 'UNDER_REVIEW'
                                ? 'bg-amber-950/40 border-amber-500/20 text-amber-400'
                                : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                            }`}>
                              {app.applicationStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {app.interviewPresented ? (
                              (app.interviewTechnicalRating !== null || app.interviewNonTechnicalRating !== null) ? (
                                <span className="text-emerald-400 flex flex-col items-center justify-center text-[10px] space-y-0.5">
                                  <span className="flex items-center space-x-0.5">
                                    <span className="text-zinc-500 font-mono text-[9px]">T:</span>
                                    <span>{app.interviewTechnicalRating ?? '?'}</span>
                                  </span>
                                  <span className="flex items-center space-x-0.5">
                                    <span className="text-zinc-500 font-mono text-[9px]">N:</span>
                                    <span>{app.interviewNonTechnicalRating ?? '?'}</span>
                                  </span>
                                </span>
                              ) : (
                                <span className="text-amber-500 font-mono text-xs">?</span>
                              )
                            ) : (
                              <span className="text-zinc-600 font-mono">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-800/40 pt-4 text-xs font-bold uppercase tracking-wider font-mono">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  Prev
                </button>
                <span className="text-zinc-500">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  Next
                </button>
              </div>
            )}

          </div>

          {/* RIGHT PANE: Applicant Details & Evaluation Panel */}
          <div className={`w-full lg:w-2/5 flex flex-col space-y-6 ${
            mobileTab === 'evaluation' ? 'block' : 'hidden lg:block'
          }`}>
            
            {/* Mobile Back Button */}
            <button 
              onClick={() => setMobileTab('directory')}
              className="lg:hidden w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all mb-1"
            >
              <span>← Back to Directory List</span>
            </button>

            {/* Detail display card */}
            {loadingDetail ? (
              <div className="bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] w-full">
                <Loader2 className="w-6 h-6 text-zinc-600 animate-spin mb-2" />
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Retrieving candidate profile...</span>
              </div>
            ) : !selectedApp ? (
              <div className="bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center text-zinc-500 min-h-[400px] w-full">
                <Users size={32} className="text-zinc-700 mb-3" />
                <p className="font-bold text-sm uppercase tracking-wider">Select Student</p>
                <p className="text-xs text-zinc-600 max-w-[200px] mt-1 leading-relaxed">
                  Click any row in the applicant directory to inspect their application and evaluate their interview.
                </p>
              </div>
            ) : (
              <div className="space-y-6 w-full animate-fadeIn">
                
                {/* Profile Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-4">
                  
                  <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-zinc-500 text-[9px] font-bold tracking-widest uppercase font-mono block">Application ID</span>
                      <h4 className="text-md font-black text-white font-mono">{selectedApp.applicationId}</h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                      selectedApp.applicationStatus === 'SELECTED'
                        ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                        : selectedApp.applicationStatus === 'REJECTED'
                        ? 'bg-red-950/40 border-red-500/20 text-red-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                    }`}>
                      {selectedApp.applicationStatus}
                    </span>
                  </div>

                  {/* Candidate details grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Name</span>
                      <p className="text-white font-bold mt-0.5">{selectedApp.name}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Roll Number</span>
                      <p className="text-white font-mono font-semibold mt-0.5">{selectedApp.rollNumber}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Year & Section</span>
                      <p className="text-white font-semibold mt-0.5">{selectedApp.year} - Sec {selectedApp.section}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider">Submitted On</span>
                      <p className="text-white font-semibold mt-0.5 font-mono text-[10px]">
                        {new Date(selectedApp.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-zinc-800/60 text-xs">
                    <div>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider block">Interested Fields</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedApp.interestedFields.map((field) => (
                          <span key={field} className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md font-semibold text-[10px] uppercase tracking-wide">
                            {ROLE_DISPLAY_NAMES[field] || field}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedApp.hasPastExperience && selectedApp.pastExperience && (
                      <div>
                        <span className="text-zinc-500 font-bold uppercase tracking-wider block">Past Experience</span>
                        <p className="text-zinc-300 mt-1 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-900/60">
                          {selectedApp.pastExperience}
                        </p>
                      </div>
                    )}

                    {selectedApp.previousWorkLinks && selectedApp.previousWorkLinks.length > 0 && (
                      <div>
                        <span className="text-zinc-500 font-bold uppercase tracking-wider block">Previous Work / Portfolio Links</span>
                        <div className="flex flex-col space-y-1.5 mt-1 font-mono text-[11px]">
                          {selectedApp.previousWorkLinks.map((link) => (
                            <a 
                              key={link}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 hover:underline truncate"
                            >
                              <ExternalLink size={12} className="shrink-0" />
                              <span className="truncate">{link}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedApp.interviewSlot && (
                      <div>
                        <span className="text-zinc-500 font-bold uppercase tracking-wider block">Interview Availability Slot</span>
                        <p className="text-emerald-400 font-mono text-xs mt-1 leading-relaxed bg-emerald-950/20 px-3 py-2.5 rounded-xl border border-emerald-500/20">
                          {selectedApp.interviewSlot}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2.5 pt-2">
                      <div>
                        <span className="text-zinc-500 font-bold uppercase tracking-wider block">Why do you want to join GFG?</span>
                        <p className="text-zinc-300 mt-1 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-900/60">
                          {selectedApp.reasonForJoining}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase tracking-wider block">How do you want to contribute?</span>
                        <p className="text-zinc-300 mt-1 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-900/60">
                          {selectedApp.contribution}
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase tracking-wider block">What do you know about GFG?</span>
                        <p className="text-zinc-300 mt-1 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-900/60">
                          {selectedApp.clubKnowledge}
                        </p>
                      </div>
                    </div>

                    {selectedApp.resumePath && (
                      <div className="pt-2">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider block mb-2">Resume PDF</span>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a 
                            href={`/api/admin/applications/${selectedApp.id}/resume`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-4 bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all text-[10px]"
                          >
                            <FileText size={12} />
                            <span>View in New Tab</span>
                          </a>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

                {/* EVALUATION CONSOLE */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 space-y-5">
                  
                  <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
                    <Award size={18} className="text-emerald-500" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">Interview Grading</h4>
                  </div>

                  {evalMsg && (
                    <div className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2 animate-fadeIn ${
                      evalMsg.type === 'success' 
                        ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' 
                        : 'bg-red-950/40 border-red-500/20 text-red-400'
                    }`}>
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{evalMsg.text}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Interview Status Dropdown */}
                    <div className="flex flex-col space-y-1.5">
                      <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Interview Status</span>
                      <select
                        value={evalPresented ? 'Presented' : 'NotPresented'}
                        onChange={(e) => {
                          const presented = e.target.value === 'Presented';
                          setEvalPresented(presented);
                          if (!presented) {
                             setEvalTechRating(null);
                             setEvalNonTechRating(null);
                           }
                        }}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all"
                      >
                        <option value="NotPresented">Not Presented (Absent)</option>
                        <option value="Presented">Presented (Attended)</option>
                      </select>
                    </div>

                    {/* Technical 5-Star interview rating */}
                    <div className={`flex flex-col space-y-1.5 pt-2 border-t border-zinc-800/40 ${!evalPresented ? 'opacity-50' : ''}`}>
                      <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Technical Rating</span>
                      <StarRating
                        value={evalPresented ? evalTechRating : null}
                        onChange={(val) => {
                          if (evalPresented) {
                            setEvalTechRating(val);
                          }
                        }}
                        disabled={!evalPresented}
                      />
                    </div>

                    {/* Non-Technical 5-Star interview rating */}
                    <div className={`flex flex-col space-y-1.5 pt-2 border-t border-zinc-800/40 ${!evalPresented ? 'opacity-50' : ''}`}>
                      <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Non-Technical Rating</span>
                      <StarRating
                        value={evalPresented ? evalNonTechRating : null}
                        onChange={(val) => {
                          if (evalPresented) {
                            setEvalNonTechRating(val);
                          }
                        }}
                        disabled={!evalPresented}
                      />
                    </div>

                    {/* Interview Notes */}
                    <div className="flex flex-col space-y-1.5 pt-2 border-t border-zinc-800/40">
                      <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Interview Notes</span>
                      <textarea
                        rows={6}
                        value={evalNotes}
                        onChange={(e) => setEvalNotes(e.target.value)}
                        placeholder="Record panel observation notes..."
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-700 text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all resize-y min-h-[100px]"
                      />
                    </div>

                    {/* Selection/Application Status */}
                    <div className="flex flex-col space-y-1.5">
                      <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Application Selection Status</span>
                      <select
                        value={evalStatus}
                        onChange={(e) => setEvalStatus(e.target.value as any)}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all"
                      >
                        <option value="NEW">New (Unreviewed)</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="INTERVIEWED">Interviewed</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                  </div>

                  {/* Grading Action Controls */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSaveEvaluation()}
                      disabled={savingEval}
                      className="flex-1 py-3 px-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 disabled:opacity-50 transition-all"
                    >
                      {savingEval ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      <span>Save Only</span>
                    </button>

                    <button
                      onClick={handleSaveAndNext}
                      disabled={savingEval}
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/5"
                    >
                      <span>Save & Next</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}
export const dynamic = 'force-dynamic';
