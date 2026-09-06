'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Settings, LogOut, Loader2, Landmark, Award, ShieldAlert } from 'lucide-react';

export default function AdminHubPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Perform authentication check by making a minimal request to a protected API
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

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Verifying Admin Credentials...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative">
      {/* Background design */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="max-w-4xl w-full space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/5">
              <Landmark size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">SVEC Admin Gateway</h1>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Sri Vasavi Engineering College Administrative Portal</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* GFG Recruitment Portal Card */}
            <Link 
              href="/admin/gfg-hiring"
              className="group bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Award size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-wider">
                    GFG Recruitment Panel
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                    Review student chapter applicants, execute roll number searches, mark interview presented logs, assign technical/non-technical scores, and export Excel reports for HOD approval.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-emerald-500 group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                <span>Access GFG Panel</span>
                <span>→</span>
              </span>
            </Link>

            {/* General College Admin Portal (Disabled/Coming Soon) */}
            <div className="bg-zinc-900/20 border border-zinc-800/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 opacity-60 relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-zinc-800 text-zinc-500 rounded-2xl flex items-center justify-center">
                  <Landmark size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-wider">
                    College Administration
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                    Centralized CMS tools to update college vision, departments catalog, faculty profiles, placements statistics, events gallery, circular documents, and campus life info hubs dynamically.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-600 flex items-center space-x-1.5">
                <ShieldAlert size={12} />
                <span>Feature Disabled (Static Config Active)</span>
              </span>
            </div>

          </div>

          {/* Bottom Bar Controls */}
          <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
            <Link 
              href="/admin/settings"
              className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider font-mono"
            >
              <Settings size={14} />
              <span>Security Settings</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-wider font-mono"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
export const dynamic = 'force-dynamic';
