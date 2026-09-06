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
  Check
} from 'lucide-react';

interface FormFieldItem {
  id: string;
  label: string;
  fieldKey: string;
  fieldType: 'SHORT_TEXT' | 'LONG_TEXT' | 'SINGLE_SELECT' | 'MULTI_SELECT' | 'CHECKBOX' | 'FILE_UPLOAD' | 'RATING';
  options: string[];
  required: boolean;
}

export default function CreateEventPage() {
  const router = useRouter();

  // Event Details
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [posterImageUrl, setPosterImageUrl] = useState('/college-building.png');
  const [opensAt, setOpensAt] = useState('2026-08-12T19:00');
  const [closesAt, setClosesAt] = useState('2026-08-12T22:00');

  // Dynamic Form Fields List
  const [fields, setFields] = useState<FormFieldItem[]>([
    {
      id: 'f-1',
      label: 'Interested Fields / Domains',
      fieldKey: 'interestedFields',
      fieldType: 'MULTI_SELECT',
      options: ['Web Development', 'Competitive Programming', 'Design', 'Social Media', 'Public Relations', 'Event Management'],
      required: true,
    },
    {
      id: 'f-2',
      label: 'Interview Availability Slot',
      fieldKey: 'interviewSlot',
      fieldType: 'SINGLE_SELECT',
      options: ['13th August - Forenoon Session', '13th August - Afternoon Session', '14th August - Forenoon Session', '14th August - Afternoon Session'],
      required: true,
    },
    {
      id: 'f-3',
      label: 'Why do you want to join GFG Club?',
      fieldKey: 'reasonForJoining',
      fieldType: 'LONG_TEXT',
      options: [],
      required: true,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
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
            DEFINE EVENT METADATA, POSTER, DATES, AND CUSTOM APPLICATION QUESTIONS
          </p>
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

            <div className="flex flex-col space-y-2 font-mono text-xs">
              <label className="text-zinc-400 font-bold uppercase">Poster Image URL</label>
              <input
                type="text"
                placeholder="e.g. /college-building.png or Supabase storage URL"
                value={posterImageUrl}
                onChange={(e) => setPosterImageUrl(e.target.value)}
                className="bg-[#141820] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-all"
              />
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
                <span>2. Dynamic Application Form Builder ({fields.length} Questions)</span>
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

            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div key={field.id} className="bg-[#141820] border border-zinc-800/80 rounded-xl p-5 space-y-4 font-mono text-xs relative">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-zinc-900 text-emerald-400 font-bold text-[10px] flex items-center justify-center border border-zinc-800">
                        #{idx + 1}
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
