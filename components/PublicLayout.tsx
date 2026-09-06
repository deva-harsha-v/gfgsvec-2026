import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0c0e12] text-[#f1f5f9] font-body selection:bg-[#00b964]/30 selection:text-[#00e575]">
      <Navbar />
      <div className="flex-grow w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
}
