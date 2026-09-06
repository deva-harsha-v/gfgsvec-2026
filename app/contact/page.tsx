'use client';

import PublicLayout from '@/components/PublicLayout';
import PageHeader from '@/components/PageHeader';
import { Mail, MapPin, Phone, Send, Terminal, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <PublicLayout>
      <PageHeader title="Contact Us" subtitle="Get in Touch with GFG SVEC" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Coordinates */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight">Reach Out To Us</h2>
              <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed font-medium">
                Have questions about chapter recruitment, coding events, or collaborations? Contact the GFG SVEC executive desk.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <h3 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
                Chapter Desk
              </h3>
              
              <ul className="space-y-4 text-xs font-medium text-zinc-300">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Sri Vasavi Engineering College, Pedatadepalli, Tadepalligudem, AP - 534101</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                  <a href="mailto:gfg_chapter@srivasaviengg.ac.in" className="hover:text-emerald-400 transition-colors font-mono">gfg_chapter@srivasaviengg.ac.in</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
              Send a Message
            </h3>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-extrabold text-white text-base uppercase">Message Received</h4>
                <p className="text-xs text-zinc-400 font-medium">Thank you for contacting GFG SVEC executive team. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] font-bold uppercase mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] font-bold uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] font-bold uppercase mb-1">Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your inquiry or message..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-medium resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                >
                  <Send size={14} />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
