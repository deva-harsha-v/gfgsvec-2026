import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      <Navbar />
      <div className="flex-grow w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
}
