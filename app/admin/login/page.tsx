'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLoginSchema } from '@/lib/schemas';
import { z } from 'zod';
import { Terminal, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

type LoginValues = z.infer<typeof AdminLoginSchema>;

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Login failed.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Incorrect credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center font-sans">
      
      {/* Top Banner accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

      <div className="w-full max-w-md mx-auto px-6 py-12">
        
        {/* Brand */}
        <div className="flex flex-col items-center space-y-3 mb-8">
          <div className="w-12 h-12 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/5">
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
            </svg>
          </div>
          <span className="text-zinc-500 font-mono text-xs font-bold tracking-[0.2em] uppercase">
            Sri Vasavi Engineering College
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            GFG Club Admin
          </h2>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative">
          
          {error && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start space-x-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-1" htmlFor="email">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>Email Address</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@gfgsvec.in"
                {...register('email')}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium font-mono"
              />
              {errors.email && <span className="text-red-500 text-xs font-medium mt-1">{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-1" htmlFor="password">
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                <span>Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                {...register('password')}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {errors.password && <span className="text-red-500 text-xs font-medium mt-1">{errors.password.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>

          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-zinc-600 hover:text-zinc-400 text-xs font-bold font-mono uppercase tracking-wider">
            ← Return to Public Website
          </a>
        </div>

      </div>
    </main>
  );
}
export const dynamic = 'force-dynamic';
