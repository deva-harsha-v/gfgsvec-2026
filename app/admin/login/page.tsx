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
          <div className="w-12 h-12 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/5">
            <Terminal size={24} />
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
