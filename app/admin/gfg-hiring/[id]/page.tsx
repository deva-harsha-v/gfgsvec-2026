'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import StarRating from '@/components/StarRating';
import { ROLE_DISPLAY_NAMES } from '@/lib/roles';
import { 
  ArrowLeft, 
  FileText, 
  ExternalLink, 
  Award, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  User, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  MessageSquare,
  ShieldCheck,
  Check,
  Brain,
  Zap,
  HelpCircle
} from 'lucide-react';

interface ApplicantDetail {
  id: string;
  applicationId: string;
  name: string;
  rollNumber: string;
  year: string;
  section: string;
  branch: string | null;
  cgpa: number | null;
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
  ratingCommunication: number | null;
  ratingTechnicalSkills: number | null;
  ratingProblemSolving: number | null;
  ratingTeamFit: number | null;
  ratingConfidence: number | null;
  ratingGrowthMindset: number | null;
  ratingLeadership: number | null;
  suitableForTechnical: 'YES' | 'NO' | 'UNDECIDED' | null;
  suitableForNonTechnical: 'YES' | 'NO' | 'UNDECIDED' | null;
  interviewNotes: string | null;
  applicationStatus: 'NEW' | 'UNDER_REVIEW' | 'INTERVIEWED' | 'SELECTED' | 'REJECTED';
  submittedAt: string;
}

export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'dossier' | 'copilot' | 'interview'>('dossier');

  // Evaluation Form State
  const [interviewPresented, setInterviewPresented] = useState(false);
  const [ratingComm, setRatingComm] = useState<number | null>(null);
  const [ratingTech, setRatingTech] = useState<number | null>(null);
  const [ratingProblem, setRatingProblem] = useState<number | null>(null);
  const [ratingTeam, setRatingTeam] = useState<number | null>(null);
  const [ratingConf, setRatingConf] = useState<number | null>(null);
  const [ratingGrowth, setRatingGrowth] = useState<number | null>(null);
  const [ratingLeader, setRatingLeader] = useState<number | null>(null);

  const [suitableTech, setSuitableTech] = useState<'YES' | 'NO' | 'UNDECIDED'>('UNDECIDED');
  const [suitableNonTech, setSuitableNonTech] = useState<'YES' | 'NO' | 'UNDECIDED'>('UNDECIDED');
  
  const [manuallySelected, setManuallySelected] = useState(false);
  const [interviewNotes, setInterviewNotes] = useState('');
  const [appStatus, setAppStatus] = useState<'NEW' | 'UNDER_REVIEW' | 'INTERVIEWED' | 'SELECTED' | 'REJECTED'>('NEW');

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchApplicant = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Candidate not found.');
      }
      const data: ApplicantDetail = await res.json();
      setApplicant(data);

      // Populate evaluation form states
      setInterviewPresented(data.interviewPresented);
      setRatingComm(data.ratingCommunication);
      setRatingTech(data.ratingTechnicalSkills || data.interviewTechnicalRating);
      setRatingProblem(data.ratingProblemSolving);
      setRatingTeam(data.ratingTeamFit);
      setRatingConf(data.ratingConfidence);
      setRatingGrowth(data.ratingGrowthMindset);
      setRatingLeader(data.ratingLeadership);

      setSuitableTech(data.suitableForTechnical || 'UNDECIDED');
      setSuitableNonTech(data.suitableForNonTechnical || 'UNDECIDED');
      
      setManuallySelected(data.applicationStatus === 'SELECTED');
      setInterviewNotes(data.interviewNotes || '');
      setAppStatus(data.applicationStatus);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchApplicant();
  }, [fetchApplicant]);

  const handleSaveEvaluation = async (overrideStatus?: 'SELECTED' | 'REJECTED') => {
    if (!applicant) return;
    setSaving(true);
    setSaveMsg(null);

    const targetStatus = overrideStatus 
      ? overrideStatus 
      : manuallySelected 
      ? 'SELECTED' 
      : appStatus;

    // Calculate legacy ratings from rubric averages
    const techRatingToSave = ratingTech ?? null;
    const nonTechRatingToSave = ratingComm ?? null;

    const payload = {
      interviewPresented,
      interviewTechnicalRating: interviewPresented ? techRatingToSave : null,
      interviewNonTechnicalRating: interviewPresented ? nonTechRatingToSave : null,
      ratingCommunication: interviewPresented ? ratingComm : null,
      ratingTechnicalSkills: interviewPresented ? ratingTech : null,
      ratingProblemSolving: interviewPresented ? ratingProblem : null,
      ratingTeamFit: interviewPresented ? ratingTeam : null,
      ratingConfidence: interviewPresented ? ratingConf : null,
      ratingGrowthMindset: interviewPresented ? ratingGrowth : null,
      ratingLeadership: interviewPresented ? ratingLeader : null,
      suitableForTechnical: suitableTech,
      suitableForNonTechnical: suitableNonTech,
      interviewNotes: interviewNotes.trim() === '' ? null : interviewNotes,
      applicationStatus: targetStatus,
    };

    try {
      const res = await fetch(`/api/admin/applications/${applicant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save evaluation.');
      }

      setSaveMsg({ type: 'success', text: 'Candidate evaluation updated successfully!' });
      setApplicant(result.applicant);
      setAppStatus(result.applicant.applicationStatus);
      setManuallySelected(result.applicant.applicationStatus === 'SELECTED');
    } catch (err: any) {
      setSaveMsg({ type: 'error', text: err.message || 'Failed to update evaluation.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Loading Candidate Dossier...</p>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <h2 className="text-xl font-bold text-white uppercase font-mono">Candidate Not Found</h2>
          <Link
            href="/admin/gfg-hiring"
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-emerald-400 hover:text-white uppercase font-bold"
          >
            ← Return to Applicants List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 flex font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto">
        
        {/* Navigation Back Link */}
        <div>
          <Link
            href="/admin/gfg-hiring"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-zinc-400 hover:text-emerald-400 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Applicants Directory</span>
          </Link>
        </div>

        {/* Candidate Header Banner */}
        <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
            
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xl font-bold flex items-center justify-center shrink-0">
                {applicant.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-black text-white">{applicant.name}</h1>
                  <span className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    appStatus === 'SELECTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    appStatus === 'INTERVIEWED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                    appStatus === 'UNDER_REVIEW' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    appStatus === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {appStatus}
                  </span>
                </div>
                
                <p className="text-xs font-mono text-zinc-400">
                  Roll No: <strong className="text-zinc-200">{applicant.rollNumber}</strong> • {applicant.year} {applicant.branch ? `(${applicant.branch})` : ''} • Section {applicant.section}
                  {applicant.cgpa && <span> • CGPA: <strong className="text-emerald-400">{applicant.cgpa}</strong></span>}
                </p>
                <p className="text-[11px] font-mono text-zinc-500">
                  ID: <strong className="text-emerald-400/90">{applicant.applicationId}</strong> • Slot: <span className="text-zinc-300">{applicant.interviewSlot || 'Not Chosen'}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {applicant.resumePath && (
                <a
                  href={`/api/admin/applications/${applicant.id}/resume`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all uppercase shadow-md shadow-emerald-950/20"
                >
                  <FileText className="w-4 h-4" />
                  <span>View PDF Resume</span>
                </a>
              )}
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800/80 space-x-8 font-mono text-xs">
            <button
              onClick={() => setActiveTab('dossier')}
              className={`pb-3 font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'dossier'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dossier & Rubric</span>
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`pb-3 font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all relative ${
                activeTab === 'copilot'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>AI Copilot</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                PRO
              </span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`pb-3 font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
                activeTab === 'interview'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Live Evaluation Form</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DOSSIER & RUBRIC OVERVIEW */}
        {activeTab === 'dossier' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (2 Cols): Personal & Form Responses */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal & Academic Details Card */}
              <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-zinc-800/60 pb-3">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Academic & Profile Information</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px] block font-bold">Full Name</span>
                    <span className="text-white font-bold">{applicant.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px] block font-bold">Roll Number</span>
                    <span className="text-emerald-400 font-bold">{applicant.rollNumber}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px] block font-bold">Year of Study</span>
                    <span className="text-white font-bold">{applicant.year}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px] block font-bold">Branch</span>
                    <span className="text-white font-bold">{applicant.branch || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px] block font-bold">Section</span>
                    <span className="text-white font-bold">{applicant.section}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px] block font-bold">Academic CGPA</span>
                    <span className="text-amber-400 font-black">{applicant.cgpa ?? 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Interested Fields & Past Experience */}
              <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-zinc-800/60 pb-3">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span>Domains & Experience</span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 uppercase text-[10px] block font-bold mb-2">Selected Domain Roles</span>
                    <div className="flex flex-wrap gap-2">
                      {applicant.interestedFields.map((field) => (
                        <span key={field} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold uppercase text-[11px]">
                          {ROLE_DISPLAY_NAMES[field] || field}
                        </span>
                      ))}
                    </div>
                  </div>

                  {applicant.hasPastExperience && applicant.pastExperience && (
                    <div>
                      <span className="text-zinc-500 uppercase text-[10px] block font-bold mb-1">Past Experience</span>
                      <p className="text-zinc-300 leading-relaxed bg-[#141820] p-3 rounded-xl border border-zinc-800 font-sans text-xs">
                        {applicant.pastExperience}
                      </p>
                    </div>
                  )}

                  {applicant.previousWorkLinks && applicant.previousWorkLinks.length > 0 && (
                    <div>
                      <span className="text-zinc-500 uppercase text-[10px] block font-bold mb-2">Portfolio / Work Links</span>
                      <div className="space-y-2">
                        {applicant.previousWorkLinks.map((link) => (
                          <a
                            key={link}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-mono text-xs bg-[#141820] p-2.5 rounded-xl border border-zinc-800 hover:border-emerald-500/40 transition-all truncate"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{link}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Written Motivational Responses */}
              <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-zinc-800/60 pb-3">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Candidate Questionnaire Responses</span>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <span className="text-zinc-500 font-mono uppercase text-[10px] block font-bold mb-1">Why do you want to join GFG Club?</span>
                    <p className="text-zinc-300 leading-relaxed bg-[#141820] p-3 rounded-xl border border-zinc-800">
                      {applicant.reasonForJoining}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500 font-mono uppercase text-[10px] block font-bold mb-1">How do you want to contribute?</span>
                    <p className="text-zinc-300 leading-relaxed bg-[#141820] p-3 rounded-xl border border-zinc-800">
                      {applicant.contribution}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500 font-mono uppercase text-[10px] block font-bold mb-1">What do you know about GFG?</span>
                    <p className="text-zinc-300 leading-relaxed bg-[#141820] p-3 rounded-xl border border-zinc-800">
                      {applicant.clubKnowledge}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (1 Col): Evaluated Rubric Summary */}
            <div className="space-y-6">
              
              <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Evaluated Rubric Summary</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                    applicant.interviewPresented ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {applicant.interviewPresented ? 'Attended' : 'Absent'}
                  </span>
                </div>

                {applicant.interviewPresented ? (
                  <div className="space-y-3 font-mono text-xs">
                    {[
                      { label: 'Communication & Expression', score: applicant.ratingCommunication },
                      { label: 'Technical Depth', score: applicant.ratingTechnicalSkills },
                      { label: 'Problem Solving', score: applicant.ratingProblemSolving },
                      { label: 'Team Fit & Collaboration', score: applicant.ratingTeamFit },
                      { label: 'Confidence & Presentation', score: applicant.ratingConfidence },
                      { label: 'Growth Mindset', score: applicant.ratingGrowthMindset },
                      { label: 'Leadership Potential', score: applicant.ratingLeadership },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center bg-[#141820] p-2.5 rounded-xl border border-zinc-800">
                        <span className="text-zinc-400 text-[11px] font-medium">{item.label}</span>
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-amber-400">{item.score ?? '-'}</span>
                          <span className="text-zinc-600">/ 5 ★</span>
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400">Suitable for Technical:</span>
                        <span className={`font-bold ${applicant.suitableForTechnical === 'YES' ? 'text-emerald-400' : applicant.suitableForTechnical === 'NO' ? 'text-red-400' : 'text-zinc-500'}`}>
                          {applicant.suitableForTechnical || 'UNDECIDED'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400">Suitable for Non-Technical:</span>
                        <span className={`font-bold ${applicant.suitableForNonTechnical === 'YES' ? 'text-emerald-400' : applicant.suitableForNonTechnical === 'NO' ? 'text-red-400' : 'text-zinc-500'}`}>
                          {applicant.suitableForNonTechnical || 'UNDECIDED'}
                        </span>
                      </div>
                    </div>

                    {applicant.interviewNotes && (
                      <div className="pt-2 border-t border-zinc-800">
                        <span className="text-zinc-500 text-[10px] block font-bold uppercase mb-1">Panel Evaluation Notes</span>
                        <p className="text-zinc-300 font-sans text-xs leading-relaxed bg-[#141820] p-3 rounded-xl border border-zinc-800">
                          {applicant.interviewNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500 font-mono text-xs space-y-2">
                    <p>Candidate did not attend live interview.</p>
                    <button
                      onClick={() => setActiveTab('interview')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase"
                    >
                      Fill Evaluation Form
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AI COPILOT PLACEHOLDER */}
        {activeTab === 'copilot' && (
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-8 max-w-3xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono uppercase">AI Candidate Copilot</h2>
                <p className="text-xs text-purple-400 font-mono uppercase font-semibold">INTELLIGENT DOSSIER & RESUME ANALYSIS (COMING SOON)</p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              The AI Candidate Copilot performs deep semantic analysis on PDF resumes, cross-references written responses against role prerequisites, and auto-generates custom interview questions tailored specifically to {applicant.name}.
            </p>

            <div className="space-y-3 font-mono text-xs border-t border-zinc-800/80 pt-4">
              <span className="text-zinc-500 uppercase font-bold text-[10px] tracking-wider block">Upcoming Features Included in Pro:</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#141820] p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold">
                    <Zap className="w-4 h-4" />
                    <span>Skill Match Scoring</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">Automated matching of PDF resume skills against selected domain tracks.</p>
                </div>

                <div className="bg-[#141820] p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>AI Red-Flag Detection</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">Identifies plagiarized motivation answers, copied templates, or roll number mismatches.</p>
                </div>

                <div className="bg-[#141820] p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Brain className="w-4 h-4" />
                    <span>Executive Summary</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">Generates a concise 3-bullet summary for panel leads prior to live interviewing.</p>
                </div>

                <div className="bg-[#141820] p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>Question Generator</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">Produces 5 customized technical & behavioral questions based on candidate projects.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="px-4 py-2 bg-purple-950/40 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-mono font-bold uppercase inline-block">
                Feature Preview • Next Major Release
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE INTERVIEW EVALUATION FORM */}
        {activeTab === 'interview' && (
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto space-y-8 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-mono uppercase">Live Interview Evaluation Console</h2>
                <p className="text-xs text-zinc-500 font-mono">Evaluate candidate across the 7 core criteria during live panel interview</p>
              </div>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold rounded-lg uppercase">
                Panel Grading
              </span>
            </div>

            {saveMsg && (
              <div className={`p-4 rounded-xl border text-xs font-mono flex items-center space-x-2 ${
                saveMsg.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-red-950/40 border-red-500/30 text-red-400'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveMsg.text}</span>
              </div>
            )}

            <div className="space-y-6">
              
              {/* Attendance Toggle */}
              <div className="flex flex-col space-y-2 bg-[#141820] p-4 rounded-xl border border-zinc-800">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Interview Attendance Status</span>
                <div className="flex space-x-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setInterviewPresented(true)}
                    className={`flex-1 py-2.5 rounded-xl border font-mono text-xs font-bold uppercase transition-all ${
                      interviewPresented ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#0a0c10] border-zinc-800 text-zinc-500'
                    }`}
                  >
                    Presented (Attended)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInterviewPresented(false);
                      setRatingComm(null);
                      setRatingTech(null);
                      setRatingProblem(null);
                      setRatingTeam(null);
                      setRatingConf(null);
                      setRatingGrowth(null);
                      setRatingLeader(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border font-mono text-xs font-bold uppercase transition-all ${
                      !interviewPresented ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-[#0a0c10] border-zinc-800 text-zinc-500'
                    }`}
                  >
                    Not Presented (Absent)
                  </button>
                </div>
              </div>

              {/* 7 Star Criteria Rubric */}
              <div className={`space-y-4 ${!interviewPresented ? 'opacity-40 pointer-events-none' : ''}`}>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">7-Criteria Star Rating Rubric (1 - 5 Stars)</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  
                  {/* 1. Communication */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-zinc-300 font-bold block">1. Communication & Expression</span>
                    <StarRating value={ratingComm} onChange={setRatingComm} disabled={!interviewPresented} />
                  </div>

                  {/* 2. Technical Skills */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-zinc-300 font-bold block">2. Technical Skills & Depth</span>
                    <StarRating value={ratingTech} onChange={setRatingTech} disabled={!interviewPresented} />
                  </div>

                  {/* 3. Problem Solving */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-zinc-300 font-bold block">3. Problem Solving & Aptitude</span>
                    <StarRating value={ratingProblem} onChange={setRatingProblem} disabled={!interviewPresented} />
                  </div>

                  {/* 4. Team Fit */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-zinc-300 font-bold block">4. Team Fit & Collaboration</span>
                    <StarRating value={ratingTeam} onChange={setRatingTeam} disabled={!interviewPresented} />
                  </div>

                  {/* 5. Confidence */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-zinc-300 font-bold block">5. Confidence & Presentation</span>
                    <StarRating value={ratingConf} onChange={setRatingConf} disabled={!interviewPresented} />
                  </div>

                  {/* 6. Growth Mindset */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-zinc-300 font-bold block">6. Growth Mindset & Agility</span>
                    <StarRating value={ratingGrowth} onChange={setRatingGrowth} disabled={!interviewPresented} />
                  </div>

                  {/* 7. Leadership */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2 col-span-1 md:col-span-2">
                    <span className="text-zinc-300 font-bold block">7. Leadership Potential</span>
                    <StarRating value={ratingLeader} onChange={setRatingLeader} disabled={!interviewPresented} />
                  </div>

                </div>
              </div>

              {/* Role Suitability Toggles */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">Domain Suitability Assessment</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Technical Suitability */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-zinc-300 font-bold block">Suitable for Technical Roles?</span>
                    <div className="flex space-x-2">
                      {(['YES', 'NO', 'UNDECIDED'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSuitableTech(opt)}
                          className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                            suitableTech === opt
                              ? opt === 'YES' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : opt === 'NO' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                              : 'bg-[#0a0c10] border-zinc-800 text-zinc-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Non-Technical Suitability */}
                  <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 space-y-2">
                    <span className="text-zinc-300 font-bold block">Suitable for Non-Technical Roles?</span>
                    <div className="flex space-x-2">
                      {(['YES', 'NO', 'UNDECIDED'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSuitableNonTech(opt)}
                          className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                            suitableNonTech === opt
                              ? opt === 'YES' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : opt === 'NO' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                              : 'bg-[#0a0c10] border-zinc-800 text-zinc-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Manually Selected Toggle Badge */}
              <div className="bg-[#141820] p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white uppercase block">Manually Selected Candidate</span>
                  <span className="text-[11px] text-zinc-500 font-mono">Bypasses queue and marks application status directly as SELECTED</span>
                </div>
                <button
                  type="button"
                  onClick={() => setManuallySelected(!manuallySelected)}
                  className={`px-4 py-2 rounded-xl border font-mono text-xs font-bold uppercase transition-all flex items-center space-x-1.5 ${
                    manuallySelected ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#0a0c10] border-zinc-800 text-zinc-500'
                  }`}
                >
                  {manuallySelected ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                  <span>{manuallySelected ? 'Selected' : 'Off'}</span>
                </button>
              </div>

              {/* Panel Interview Notes with Live Character Counter */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-zinc-400 uppercase">Panel Interview Notes & Observations</span>
                  <span className={`text-[11px] ${interviewNotes.length > 900 ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
                    {interviewNotes.length} / 1000 characters
                  </span>
                </div>
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Record panel notes, project impressions, strengths, areas of concern..."
                  className="w-full bg-[#141820] border border-zinc-800 rounded-xl p-3.5 text-white placeholder-zinc-700 text-xs font-sans focus:outline-none focus:border-emerald-500 transition-all leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveEvaluation()}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/20 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Evaluation</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveEvaluation('SELECTED')}
                  className="py-3 px-4 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Selected</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveEvaluation('REJECTED')}
                  className="py-3 px-4 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-400 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Mark Rejected</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
