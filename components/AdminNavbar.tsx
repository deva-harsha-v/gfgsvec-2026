'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Terminal, Users, Settings, LogOut } from 'lucide-react';

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard & Queue', path: '/admin', icon: Users },
    { name: 'Change Password', path: '/admin/settings', icon: Settings },
  ];

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 py-4 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand Logo */}
      <Link href="/admin" className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-0.5" />
        </div>
        <span className="font-extrabold tracking-wider uppercase text-sm">GFG SVEC Admin</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center space-x-1 md:space-x-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                isActive
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-transparent border-transparent text-zinc-400 hover:text-white hover:border-zinc-800'
              }`}
            >
              <Icon size={14} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border bg-transparent border-transparent text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
