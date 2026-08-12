'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicantSchema } from '@/lib/schemas';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Upload, Check, AlertCircle, Loader } from 'lucide-react';

const FormSchema = ApplicantSchema.extend({
  previousWorkLinks: z.array(
    z.object({
      url: z.string().trim().url('Invalid URL format').or(z.literal('')),
    })
  ),
  resume: z
    .any()
    .refine((files) => files && files.length > 0, 'Resume is required')
    .refine((files) => !files || files.length === 0 || files[0].size <= 10 * 1024 * 1024, 'Max file size is 10MB')
    .refine((files) => !files || files.length === 0 || files[0].type === 'application/pdf', 'Only PDF files are allowed'),
});

type FormValues = z.infer<typeof FormSchema>;

import { RECRUITMENT_ROLES, ROLE_DISPLAY_NAMES } from '@/lib/roles';

const TECHNICAL_FIELDS = RECRUITMENT_ROLES
  .filter(r => r.category === 'TECHNICAL')
  .map(r => r.key);

const NON_TECHNICAL_FIELDS = RECRUITMENT_ROLES
  .filter(r => r.category === 'NON_TECHNICAL')
  .map(r => r.key);

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pasteWarning, setPasteWarning] = useState<string | null>(null);
  
  const handlePastePrevent = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteWarning("Copy-pasting is disabled for this section. Please type your responses directly.");
    setTimeout(() => {
      setPasteWarning(null);
    }, 5000);
  };
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      rollNumber: '',
      year: '' as any,
      section: '',
      interestedFields: [],
      hasPastExperience: false,
      pastExperience: '',
      previousWorkLinks: [{ url: '' }],
      interviewSlot: '',
      reasonForJoining: '',
      contribution: '',
      clubKnowledge: '',
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'previousWorkLinks',
  });

  const hasPastExp = watch('hasPastExperience');
  const selectedFields = watch('interestedFields') || [];
  const resumeWatch = watch('resume');
  const uploadedFileName = resumeWatch && resumeWatch.length > 0 ? resumeWatch[0].name : null;

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ['name', 'rollNumber', 'year', 'section'];
    } else if (step === 2) {
      fieldsToValidate = ['interestedFields', 'previousWorkLinks', 'interviewSlot'];
      if (hasPastExp) {
        fieldsToValidate.push('pastExperience');
      }
    } else if (step === 3) {
      fieldsToValidate = ['reasonForJoining', 'contribution', 'clubKnowledge'];
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('rollNumber', data.rollNumber);
      formData.append('year', data.year);
      formData.append('section', data.section);
      formData.append('interestedFields', JSON.stringify(data.interestedFields));
      formData.append('hasPastExperience', String(data.hasPastExperience));
      formData.append('pastExperience', data.pastExperience || '');
      
      // Filter out empty links
      const cleanLinks = (data.previousWorkLinks || [])
        .map((l: any) => l.url.trim())
        .filter((url: string) => url !== '');
      formData.append('previousWorkLinks', JSON.stringify(cleanLinks));
      formData.append('interviewSlot', data.interviewSlot);
      
      formData.append('reasonForJoining', data.reasonForJoining);
      formData.append('contribution', data.contribution);
      formData.append('clubKnowledge', data.clubKnowledge);

      if (data.resume && data.resume.length > 0) {
        formData.append('resume', data.resume[0]);
      }

      const response = await fetch('/api/apply', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application.');
      }

      // Success - redirect to success screen passing application ID
      router.push(`/success?id=${result.applicationId}`);
    } catch (err: any) {
      setServerError(err.message || 'An error occurred during submission.');
      setSubmitting(false);
    }
  };

  const toggleFieldInterest = (field: any) => {
    const current = [...selectedFields];
    const index = current.indexOf(field);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(field);
    }
    setValue('interestedFields', current, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl relative">
      
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase mb-3">
          <span>STEP {step} OF 4</span>
          <span>{Math.round(((step - 1) / 3) * 100)}% COMPLETE</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {pasteWarning && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-start space-x-2 animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{pasteWarning}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Personal Details</h2>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Provide your basic contact and academic identifiers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Aditya Vardhan"
                  {...register('name')}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                />
                {errors.name && <span className="text-red-500 text-xs font-medium mt-1">{errors.name.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="rollNumber">Roll Number *</label>
                <input
                  id="rollNumber"
                  type="text"
                  placeholder="e.g. 23A81A05XX"
                  {...register('rollNumber')}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium font-mono"
                />
                {errors.rollNumber && <span className="text-red-500 text-xs font-medium mt-1">{errors.rollNumber.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="year">Year of Study *</label>
                <select
                  id="year"
                  {...register('year')}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                >
                  <option value="">Select Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                </select>
                {errors.year && <span className="text-red-500 text-xs font-medium mt-1">{errors.year.message}</span>}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="section">Section *</label>
                <input
                  id="section"
                  type="text"
                  placeholder="e.g. A or CSE-B"
                  {...register('section')}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
                />
                {errors.section && <span className="text-red-500 text-xs font-medium mt-1">{errors.section.message}</span>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: INTERESTS & EXPERIENCE */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Interests & Experience</h2>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Select fields you are excited about and show your past works.</p>
            </div>

            {/* Fields of Interest Selection */}
            <div className="space-y-4">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">Interested Fields *</label>
              
              <div className="space-y-3">
                <span className="text-zinc-500 text-[10px] font-bold tracking-widest block uppercase font-mono">Technical Domains</span>
                <div className="flex flex-wrap gap-2">
                  {TECHNICAL_FIELDS.map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleFieldInterest(field)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all uppercase tracking-wide ${
                        selectedFields.includes(field)
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {ROLE_DISPLAY_NAMES[field] || field}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-zinc-500 text-[10px] font-bold tracking-widest block uppercase font-mono">Non-Technical Domains</span>
                <div className="flex flex-wrap gap-2">
                  {NON_TECHNICAL_FIELDS.map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleFieldInterest(field)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all uppercase tracking-wide ${
                        selectedFields.includes(field)
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {ROLE_DISPLAY_NAMES[field] || field}
                    </button>
                  ))}
                </div>
              </div>
              {errors.interestedFields && (
                <span className="text-red-500 text-xs font-medium block mt-1">{errors.interestedFields.message}</span>
              )}
            </div>

            {/* Past Experience Toggle */}
            <div className="flex flex-col space-y-3 pt-2 border-t border-zinc-800/40">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Do you have any previous experience?</span>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setValue('hasPastExperience', true)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    hasPastExp
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('hasPastExperience', false);
                    setValue('pastExperience', '');
                  }}
                  className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    !hasPastExp
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>

            {/* Past Experience Details */}
            {hasPastExp && (
              <div className="flex flex-col space-y-2 animate-fadeIn">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="pastExperience">Describe relevant experience *</label>
                <textarea
                  id="pastExperience"
                  rows={3}
                  placeholder="e.g. Previous clubs, events, web projects, content creation, social media designs, photography..."
                  {...register('pastExperience')}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium resize-none"
                />
                {errors.pastExperience && <span className="text-red-500 text-xs font-medium mt-1">{errors.pastExperience.message}</span>}
              </div>
            )}

            {/* Portfolio Links */}
            <div className="space-y-3 pt-2 border-t border-zinc-800/40">
              <div className="flex justify-between items-center">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Previous Work / Portfolio Links</label>
                <button
                  type="button"
                  onClick={() => append({ url: '' })}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center space-x-1 uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <input
                      type="url"
                      placeholder="e.g. GitHub, LinkedIn, Behance, Google Drive"
                      {...register(`previousWorkLinks.${index}.url` as const)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium font-mono text-xs"
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-zinc-500 hover:text-red-400 p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-red-950 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Slot Selection */}
            <div className="flex flex-col space-y-2 pt-2 border-t border-zinc-800/40 font-sans">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="interviewSlot">
                Select your Interview Availability Slot *
              </label>
              <select
                id="interviewSlot"
                {...register('interviewSlot')}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              >
                <option value="">-- Choose a slot --</option>
                <option value="13th August - Forenoon Session">13th August - Forenoon Session</option>
                <option value="13th August - Afternoon Session">13th August - Afternoon Session</option>
                <option value="14th August - Forenoon Session">14th August - Forenoon Session</option>
                <option value="14th August - Afternoon Session">14th August - Afternoon Session</option>
              </select>
              {errors.interviewSlot && (
                <span className="text-red-500 text-xs font-medium mt-1">{errors.interviewSlot.message}</span>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: MOTIVATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Motivation</h2>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Help the interview panel understand your perspective.</p>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="reasonForJoining">Why do you want to join the GFG Club? *</label>
              <textarea
                id="reasonForJoining"
                rows={4}
                placeholder="Share what drives you to be part of this community..."
                {...register('reasonForJoining')}
                onPaste={handlePastePrevent}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {errors.reasonForJoining && <span className="text-red-500 text-xs font-medium mt-1">{errors.reasonForJoining.message}</span>}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="contribution">How do you want to contribute to the GFG Club? *</label>
              <textarea
                id="contribution"
                rows={4}
                placeholder="Describe how you can add value (mentorship, projects, design, PR...)"
                {...register('contribution')}
                onPaste={handlePastePrevent}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {errors.contribution && <span className="text-red-500 text-xs font-medium mt-1">{errors.contribution.message}</span>}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="clubKnowledge">What do you know about the GFG Club? *</label>
              <textarea
                id="clubKnowledge"
                rows={4}
                placeholder="Explain your understanding of GeeksforGeeks and our campus chapters..."
                {...register('clubKnowledge')}
                onPaste={handlePastePrevent}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {errors.clubKnowledge && <span className="text-red-500 text-xs font-medium mt-1">{errors.clubKnowledge.message}</span>}
            </div>
          </div>
        )}

        {/* STEP 4: RESUME & SUBMISSION */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Resume & Submission</h2>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Finalize your application details and upload your PDF resume.</p>
            </div>

            {/* Resume Upload Container */}
            <div className="flex flex-col space-y-3">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Upload Resume * (PDF only, max 10MB)</span>
              
              <div className="relative border-2 border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-950 flex flex-col items-center justify-center text-center transition-all hover:border-zinc-700 cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf"
                  {...register('resume')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {uploadedFileName ? (
                  <div className="flex flex-col items-center space-y-3 z-0">
                    <div className="w-12 h-12 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="text-emerald-400 font-mono text-sm font-semibold break-all px-4">
                      {uploadedFileName}
                    </span>
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                      Ready to submit • Click or drag to change
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3 z-0">
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-300 font-bold text-sm">Click to upload or drag and drop</span>
                      <span className="text-zinc-500 text-xs font-semibold mt-1">PDF file only • Limit 10MB</span>
                    </div>
                  </div>
                )}
              </div>
              {errors.resume && <span className="text-red-500 text-xs font-medium mt-1">{errors.resume.message as string}</span>}
            </div>

            {/* Consent Agreement */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-start space-x-3">
              <input
                type="checkbox"
                required
                id="consent"
                className="accent-emerald-500 mt-1 cursor-pointer w-4 h-4"
              />
              <label htmlFor="consent" className="text-zinc-400 text-xs font-medium leading-relaxed cursor-pointer select-none">
                I verify that all the information provided in this recruitment form is accurate and true. I understand my submission is subject to evaluation by the GeeksforGeeks club panel.
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4 pt-6 border-t border-zinc-800/40">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="flex-1 py-3 px-6 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-bold text-sm uppercase tracking-wider disabled:opacity-50"
            >
              Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-bold text-sm uppercase tracking-wider"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-bold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
