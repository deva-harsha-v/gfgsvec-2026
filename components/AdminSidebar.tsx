'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  Calendar,
  QrCode,
  Settings, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab?: string;
}

export default function AdminSidebar({ currentTab }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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

  const navItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      name: 'Events & Drives',
      href: '/admin/events',
      icon: Calendar,
      active: pathname.startsWith('/admin/events'),
    },
    {
      name: 'Applicants List',
      href: '/admin/gfg-hiring',
      icon: Users,
      active: pathname === '/admin/gfg-hiring' && !currentTab,
    },
    {
      name: 'Interview Slots',
      href: '/admin/gfg-hiring?tab=slots',
      icon: CalendarClock,
      active: pathname === '/admin/gfg-hiring' && currentTab === 'slots',
    },
    {
      name: 'Attendance Tracker',
      href: '/admin/attendance',
      icon: QrCode,
      active: pathname === '/admin/attendance',
    },
    {
      name: 'Security & System',
      href: '/admin/settings',
      icon: Settings,
      active: pathname === '/admin/settings',
    },
  ];

  return (
    <aside className="w-64 bg-[#10141d] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-800/60 flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 font-bold text-lg shadow-inner">
            G
          </div>
          <div>
            <div className="flex items-center space-x-1.5 font-bold tracking-wider text-base">
              <span className="text-emerald-400 font-extrabold">GFG</span>
              <span className="text-white">SVEC</span>
            </div>
            <p className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-widest">Recruitment &apos;26</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  item.active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${item.active ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>{item.name}</span>
                </div>
                {item.active && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Profile & Logout Footer */}
      <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/40 space-y-3">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <p className="text-xs font-bold text-white truncate">admin@gfgsvec.in</p>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <p className="text-[10px] font-mono text-emerald-400/80 uppercase font-semibold">SUPER ADMIN</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 rounded-xl text-xs font-bold transition-all uppercase tracking-wider font-mono"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
