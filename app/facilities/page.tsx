'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { BookOpen, Bus, Coffee, Trophy, Home, Laptop, ShieldCheck } from 'lucide-react';

export default function FacilitiesPage() {
  const facilities = [
    {
      title: 'Central Library',
      description: 'Extensive digital library with over 50,000 volumes, international journals, IEEE access, and e-learning resources.',
      icon: BookOpen,
    },
    {
      title: 'Computer Center & Digital Infrastructure',
      description: 'Air-conditioned digital computing labs with high-speed 1 Gbps fiber optic internet and specialized software resources.',
      icon: Laptop,
    },
    {
      title: 'Student Hostels',
      description: 'Secure on-campus accommodation facilities for both boys and girls with study rooms, Wi-Fi, and cafeteria setups.',
      icon: Home,
    },
    {
      title: 'Sports & Gymnasium',
      description: 'Full-size basketball, volleyball, cricket grounds, indoor gaming facilities, and experienced athletics coaching.',
      icon: Trophy,
    },
    {
      title: 'College Transportation',
      description: 'Wide fleet of transport buses covering Pedatadepalli, Tadepalligudem, and nearby suburbs for student comfort.',
      icon: Bus,
    },
    {
      title: 'Campus Cafeteria',
      description: 'Hygienic multi-cuisine food court serving nutritious meals, snacks, beverages, and breakfast at subsidized prices.',
      icon: Coffee,
    }
  ];

  return (
    <PublicLayout>
      <PageHeader title="Campus Facilities" subtitle="Modern Infrastructure for Learning" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 tracking-tight">Institutional Infrastructure</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2 leading-relaxed font-medium">
            Sri Vasavi Engineering College hosts advanced architectural blocks and student resources supporting complete educational development on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Icon size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">{fac.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{fac.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PublicLayout>
  );
}
