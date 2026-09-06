'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  HelpCircle,
  FileText,
  Calendar,
  Layers,
  Upload,
  Check,
  Lock,
  Wand2
} from 'lucide-react';

interface FormFieldItem {
  id: string;
  label: string;
  fieldKey: string;
  fieldType: 'SHORT_TEXT' | 'LONG_TEXT' | 'SINGLE_SELECT' | 'MULTI_SELECT' | 'CHECKBOX' | 'FILE_UPLOAD' | 'RATING';
  options: string[];
  required: boolean;
}

const TEMPLATES = {
  RECRUITMENT: {
    title: 'GFG SVEC Executive Board Recruitment 2026',
    shortDescription: 'Join the premier developer community on campus. Apply for technical and non-technical core team positions.',
    fields: [
      {
        id: 'f-rec-1',
        label: 'Interested Fields / Domains',
        fieldKey: 'interestedFields',
        fieldType: 'MULTI_SELECT' as const,
        options: ['Web Development', 'Competitive Programming', 'Design', 'Social Media', 'Public Relations', 'Event Management'],
        required: true,
      },
      {
        id: 'f-rec-2',
        label: 'Interview Availability Slot',
        fieldKey: 'interviewSlot',
        fieldType: 'SINGLE_SELECT' as const,
        options: ['13th August - Forenoon Session', '13th August - Afternoon Session', '14th August - Forenoon Session', '14th August - Afternoon Session'],
        required: true,
      },
      {
        id: 'f-rec-3',
        label: 'Why do you want to join GFG Club?',
        fieldKey: 'reasonForJoining',
        fieldType: 'LONG_TEXT' as const,
        options: [],
        required: true,
      },
    ],
  },
  WORKSHOP: {
    title: 'GFG Technical Workshop 2026',
    shortDescription: 'Hands-on technical workshop session on modern web development and Cloud AI architectures.',
    fields: [
      {
        id: 'f-work-1',
        label: 'Workshop Track Interest',
        fieldKey: 'workshopTopic',
        fieldType: 'SINGLE_SELECT' as const,
        options: ['Web Development & Next.js', 'AI & Machine Learning', 'Cloud Computing & DevOps'],
        required: true,
      },
      {
        id: 'f-work-2',
        label: 'What are your learning goals for this workshop?',
        fieldKey: 'expectations',
        fieldType: 'LONG_TEXT' as const,
        options: [],
        required: true,
      },
    ],
  },
  HACKATHON: {
    title: 'GFG SVEC Hackathon 2026',
    shortDescription: '24-hour flagship hackathon challenge. Build innovative solutions and win exciting prizes.',
    fields: [
      {
        id: 'f-hack-1',
        label: 'Team Name',
        fieldKey: 'teamName',
        fieldType: 'SHORT_TEXT' as const,
        options: [],
        required: true,
      },
      {
        id: 'f-hack-2',
        label: 'Team Size',
        fieldKey: 'teamSize',
        fieldType: 'SINGLE_SELECT' as const,
        options: ['1 Member (Solo)', '2 Members', '3 Members', '4 Members'],
        required: true,
      },
      {
        id: 'f-hack-3',
        label: 'Problem Statement Track Preference',
        fieldKey: 'trackPreference',
        fieldType: 'SINGLE_SELECT' as const,
        options: ['Web / Mobile App Dev', 'AI / Machine Learning', 'Cybersecurity', 'Open Innovation'],
        required: true,
      },
      {
        id: 'f-hack-4',
        label: 'Team Leader GitHub / Portfolio URL',
        fieldKey: 'projectGithub',
        fieldType: 'SHORT_TEXT' as const,
        options: [],
        required: false,
      },
    ],
  },
  BLANK: {
    title: '',
    shortDescription: '',
    fields: [],
  },
};

export default function CreateEventPage() {
  const router = useRouter();

  // Event Details
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [posterImageUrl, setPosterImageUrl] = useState('/college-building.png');
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [opensAt, setOpensAt] = useState('2026-08-12T19:00');
  const [closesAt, setClosesAt] = useState('2026-08-12T22:00');

  // Dynamic Form Fields List (default initialized with Recruitment template)
  const [fields, setFields] = useState<FormFieldItem[]>(TEMPLATES.RECRUITMENT.fields);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
  };

  // Apply template pre-fills
  const handleApplyTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const tpl = TEMPLATES[templateKey];
    if (tpl.title) handleTitleChange(tpl.title);
    if (tpl.shortDescription) setShortDescription(tpl.shortDescription);
    setFields(tpl.fields.map((f) => ({ ...f, id: `f-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` })));
  };

  // Upload Poster Handler
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPoster(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('poster', file);

      const res = await fetch('/api/admin/cycles/upload-poster', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload poster.');
      }

      setPosterImageUrl(data.posterUrl);
    } catch (err: any) {
      setError(err.message || 'An error occurred uploading poster image.');
    } finally {
      setUploadingPoster(false);
    }
  };

  // Add new dynamic question
  const handleAddField = () => {
    const newId = `f-${Date.now()}`;
    const newField: FormFieldItem = {
      id: newId,
      label: `Question ${fields.length + 1}`,
      fieldKey: `customQuestion_${fields.length + 1}`,
      fieldType: 'SHORT_TEXT',
      options: [],
      required: true,
    };
    setFields([...fields, newField]);
  };

  // Update dynamic question properties
  const handleUpdateField = (id: string, key: keyof FormFieldItem, val: any) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const updated = { ...f, [key]: val };
        // Auto-key if label changes
        if (key === 'label') {
          updated.fieldKey = val.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
        }
        return updated;
      })
    );
  };

  // Remove dynamic question
  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  // Move dynamic question up/down
  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) return;
    const newFields = [...fields];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newFields[index];
    newFields[index] = newFields[targetIdx];
    newFields[targetIdx] = temp;
    setFields(newFields);
  };

  // Add select option to a field
  const handleAddOption = (fieldId: string, optionText: string) => {
    if (!optionText.trim()) return;
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        return { ...f, options: [...f.options, optionText.trim()] };
      })
    );
  };

  // Remove select option from a field
  const handleRemoveOption = (fieldId: string, optionIndex: number) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        return { ...f, options: f.options.filter((_, idx) => idx !== optionIndex) };
      })
    );
  };

  // Submit Handler
  const handleSubmitCycle = async (publishStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim() || !slug.trim() || !shortDescription.trim()) {
      setError('Please fill in event title, slug, and short description.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim() || shortDescription.trim(),
      posterImageUrl: posterImageUrl.trim(),
      opensAt: new Date(opensAt).toISOString(),
      closesAt: new Date(closesAt).toISOString(),
      status: publishStatus,
      formFields: fields.map((f, idx) => ({
        label: f.label,
        fieldKey: f.fieldKey,
        fieldType: f.fieldType,
        options: f.options,
        required: f.required,
        order: idx + 1,
      })),
    };

    try {
      const res = await fetch('/api/admin/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save event cycle.');
      }

      router.push('/admin/events');
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating event drive.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 flex font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-5xl mx-auto">
        
        {/* Navigation Back Link */}
        <div>
          <Link
            href="/admin/events"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-zinc-400 hover:text-emerald-400 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events Manager</span>
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-zinc-800/80 pb-6 space-y-1">
          <h1 className="text-2xl font-black tracking-wider text-white uppercase">Create New Event / Hiring Drive</h1>
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            DEFINE EVENT METADATA, UPLOAD POSTER, SCHEDULE, AND CUSTOM APPLICATION QUESTIONS
          </p>
        </div>

        {/* Quick Templates Bar */}
        <div className="bg-[#10141d] border border-emerald-500/20 rounded-2xl p-4 font-mono text-xs space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider">
            <Wand2 className="w-4 h-4" />
            <span>Quick Start Templates</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApplyTemplate('RECRUITMENT')}
              className="px-3.5 py-2 bg-emerald-950/40 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold uppercase tracking-wider transition-all"
            >
              Recruitment Drive
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('WORKSHOP')}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold uppercase tracking-wider transition-all"
            >
              Workshop RSVP
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('HACKATHON')}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-bold uppercase tracking-wider transition-all"
            >
              Hackathon Registration
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('BLANK')}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-xl font-bold uppercase tracking-wider transition-all"
            >
              Blank Event
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl text-xs font-mono flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-8">
          
          {/* Section 1: Event Details */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider border-b border-zinc-800/60 pb-3">
              <Calendar className="w-4 h-4" />
              <span>1. Event Metadata & Schedule</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              
              <div className="flex flex-col space-y-2">
                <label className="text-zinc-400 font-bold uppercase">Event Drive Title *</label>
                <input
                  type="text"
                  placeholder="e.g. GFG SVEC Executive Board 2026"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-[#141820] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-all font-sans font-medium text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-zinc-400 font-bold uppercase">URL Slug *</label>
                <input
                  type="text"
                  placeholder="e.g. gfg-svec-2026"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-[#141820] border border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs font-bold"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-zinc-400 font-bold uppercase">Opens At (Date & Time) *</label>
                <input
                  type="datetime-local"
                  value={opensAt}
                  onChange={(e) => setOpensAt(e.target.value)}
                  className="bg-[#141820] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-zinc-400 font-bold uppercase">Closes At (Date & Time) *</label>
                <input
                  type="datetime-local"
                  value={closesAt}
                  onChange={(e) => setClosesAt(e.target.value)}
                  className="bg-[#141820] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono text-xs"
                />
              </div>

            </div>

            {/* Poster Upload Control */}
            <div className="flex flex-col space-y-2 font-mono text-xs">
              <label className="text-zinc-400 font-bold uppercase">Event Poster Image * (File Upload)</label>
              
              <div className="flex items-center space-x-4">
                <label className="flex-1 bg-[#141820] border border-dashed border-zinc-700 hover:border-emerald-500 rounded-xl p-4 flex items-center justify-center space-x-2 cursor-pointer transition-all">
                  {uploadingPoster ? (
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-zinc-300 font-sans font-medium text-xs">
                    {uploadingPoster ? 'Uploading Poster Image...' : 'Click or Drag file to Upload Poster (JPEG/PNG/WEBP/SVG, Max 5MB)'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handlePosterUpload}
                    disabled={uploadingPoster}
                    className="hidden"
                  />
                </label>
              </div>

              {posterImageUrl && (
                <div className="p-3 bg-[#141820] border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono truncate">
                    <Check className="w-4 h-4 shrink-0" />
                    <span className="truncate">Poster Path: {posterImageUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPosterImageUrl('')}
                    className="text-zinc-500 hover:text-red-400 font-bold text-xs uppercase ml-2"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 font-mono text-xs">
              <label className="text-zinc-400 font-bold uppercase">Short Description (Landing CTA) *</label>
              <textarea
                rows={2}
                placeholder="Concise 1-2 sentence overview shown on homepage and recruitment landing page..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="bg-[#141820] border border-zinc-800 rounded-xl p-3.5 text-white placeholder-zinc-700 font-sans text-xs focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-2 font-mono text-xs">
              <label className="text-zinc-400 font-bold uppercase">Full Event Guidelines & Details</label>
              <textarea
                rows={4}
                placeholder="Detailed instructions, eligibility rules, interview details..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="bg-[#141820] border border-zinc-800 rounded-xl p-3.5 text-white placeholder-zinc-700 font-sans text-xs focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Section 2: Dynamic Form Question Builder */}
          <div className="bg-[#10141d] border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>2. Dynamic Application Form Builder ({fields.length} Custom Questions)</span>
              </div>
              <button
                type="button"
                onClick={handleAddField}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {/* Locked Core Fields Block */}
            <div className="bg-[#141820]/60 border border-zinc-800/80 rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                <div className="flex items-center space-x-2 text-zinc-400 font-bold uppercase text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Standard Core Candidate Identifiers (System Locked)</span>
                </div>
                <span className="px-2 py-0.5 bg-amber-950/40 text-amber-400 border border-amber-500/30 rounded text-[10px] uppercase font-bold">
                  LOCKED CORE FIELDS
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">
                <div className="p-2 bg-zinc-900 border border-zinc-800/60 rounded text-zinc-300 font-sans">
                  <div className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Field #1</div>
                  <div className="font-bold">Full Name</div>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800/60 rounded text-zinc-300 font-sans">
                  <div className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Field #2</div>
                  <div className="font-bold">Roll Number</div>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800/60 rounded text-zinc-300 font-sans">
                  <div className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Field #3</div>
                  <div className="font-bold">Academic Year</div>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800/60 rounded text-zinc-300 font-sans">
                  <div className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Field #4</div>
                  <div className="font-bold">Branch (Select)</div>
                </div>
                <div className="p-2 bg-zinc-900 border border-zinc-800/60 rounded text-zinc-300 font-sans col-span-2 md:col-span-1">
                  <div className="text-[9px] font-mono text-zinc-500 font-bold uppercase">Field #5</div>
                  <div className="font-bold">Section</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div key={field.id} className="bg-[#141820] border border-zinc-800/80 rounded-xl p-5 space-y-4 font-mono text-xs relative">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-zinc-900 text-emerald-400 font-bold text-[10px] flex items-center justify-center border border-zinc-800">
                        #{idx + 6}
                      </span>
                      <span className="font-bold text-zinc-300 uppercase">{field.fieldKey}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 bg-zinc-900 text-zinc-400 hover:text-white rounded border border-zinc-800 disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, 'down')}
                        disabled={idx === fields.length - 1}
                        className="p-1.5 bg-zinc-900 text-zinc-400 hover:text-white rounded border border-zinc-800 disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="p-1.5 bg-red-950/40 text-red-400 hover:bg-red-900 rounded border border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 flex flex-col space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold">Question Prompt Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateField(field.id, 'label', e.target.value)}
                        className="bg-[#0a0c10] border border-zinc-800 rounded-lg px-3 py-2 text-white font-sans text-xs"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold">Field Input Type</label>
                      <select
                        value={field.fieldType}
                        onChange={(e) => handleUpdateField(field.id, 'fieldType', e.target.value as any)}
                        className="bg-[#0a0c10] border border-zinc-800 rounded-lg px-3 py-2 text-white text-xs font-mono"
                      >
                        <option value="SHORT_TEXT">Short Text</option>
                        <option value="LONG_TEXT">Long Text (Textarea)</option>
                        <option value="SINGLE_SELECT">Single Select Dropdown</option>
                        <option value="MULTI_SELECT">Multi-Select Checkboxes</option>
                        <option value="CHECKBOX">Boolean Checkbox</option>
                        <option value="FILE_UPLOAD">File Upload (PDF/URL)</option>
                        <option value="RATING">1-5 Rating</option>
                      </select>
                    </div>
                  </div>

                  {/* Options List Editor for Select Types */}
                  {(field.fieldType === 'SINGLE_SELECT' || field.fieldType === 'MULTI_SELECT') && (
                    <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold block">Select Options List</label>
                      <div className="flex flex-wrap gap-1.5">
                        {field.options.map((opt, optIdx) => (
                          <span key={optIdx} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded text-[11px] font-mono flex items-center space-x-1.5">
                            <span>{opt}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(field.id, optIdx)}
                              className="text-zinc-500 hover:text-red-400"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          id={`opt-input-${field.id}`}
                          placeholder="Add option choice..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOption(field.id, (e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                          className="bg-[#0a0c10] border border-zinc-800 rounded-lg px-3 py-1.5 text-white font-mono text-xs flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById(`opt-input-${field.id}`) as HTMLInputElement;
                            if (el && el.value) {
                              handleAddOption(field.id, el.value);
                              el.value = '';
                            }
                          }}
                          className="px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-[10px] uppercase font-bold"
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id={`req-${field.id}`}
                      checked={field.required}
                      onChange={(e) => handleUpdateField(field.id, 'required', e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor={`req-${field.id}`} className="text-zinc-400 text-xs font-bold cursor-pointer select-none">
                      Compulsory / Required Field
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-800">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmitCycle('DRAFT')}
              className="flex-1 py-3.5 px-6 bg-[#141820] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmitCycle('PUBLISHED')}
              className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Publish Event Drive Live</span>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
