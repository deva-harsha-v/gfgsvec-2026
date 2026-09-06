export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-[#141820] text-[#f8fafc] py-14 md:py-20 relative overflow-hidden border-b border-[#1e2632]">
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-3">
        <h1 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-gfg-amber text-xs md:text-sm font-medium uppercase tracking-wider">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
