'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordSchema } from '@/lib/schemas';
import { z } from 'zod';
import AdminNavbar from '@/components/AdminNavbar';
import { Loader2, CheckCircle, AlertCircle, Key } from 'lucide-react';

type PasswordValues = z.infer<typeof ChangePasswordSchema>;

export default function AdminSettingsPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Basic auth check
    fetch('/api/admin/applications?limit=1')
      .then((res) => {
        if (res.status === 401) {
          router.push('/admin/login');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: PasswordValues) => {
    setSubmitting(true);
    setServerError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to change password.');
      }

      setSuccessMsg('Password updated successfully.');
      reset();
    } catch (err: any) {
      setServerError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Checking Authentication...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AdminNavbar />

      <div className="flex-1 w-full max-w-lg mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          
          <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-zinc-800/60">
            <Key className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Change Password</h2>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Current Password */}
            <div className="flex flex-col space-y-2">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="currentPassword">
                Current Password *
              </label>
              <input
                id="currentPassword"
                type="password"
                placeholder="••••••••••••"
                {...register('currentPassword')}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {errors.currentPassword && <span className="text-red-500 text-xs font-medium mt-1">{errors.currentPassword.message}</span>}
            </div>

            {/* New Password */}
            <div className="flex flex-col space-y-2">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="newPassword">
                New Password *
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••••••"
                {...register('newPassword')}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {errors.newPassword && <span className="text-red-500 text-xs font-medium mt-1">{errors.newPassword.message}</span>}
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col space-y-2">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider" htmlFor="confirmNewPassword">
                Confirm New Password *
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                placeholder="••••••••••••"
                {...register('confirmNewPassword')}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {errors.confirmNewPassword && <span className="text-red-500 text-xs font-medium mt-1">{errors.confirmNewPassword.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
export const dynamic = 'force-dynamic';
