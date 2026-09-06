export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-slate-900 text-white py-12 md:py-16 relative overflow-hidden border-b border-slate-850">
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-2">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-slate-400 text-xs md:text-sm font-bold tracking-widest uppercase font-mono">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
