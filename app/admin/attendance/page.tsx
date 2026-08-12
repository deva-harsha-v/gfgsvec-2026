'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import { 
  QrCode, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Loader2, 
  UserCheck, 
  Camera, 
  CameraOff,
  Clock
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  applicationId: string;
  name: string;
  rollNumber: string;
  section: string;
  scannedAt: string | null;
  rawYear?: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Lists
  const [secondYear, setSecondYear] = useState<AttendanceRecord[]>([]);
  const [thirdYear, setThirdYear] = useState<AttendanceRecord[]>([]);
  const [unknown, setUnknown] = useState<AttendanceRecord[]>([]);
  
  // Input & Scanning
  const [inputValue, setInputValue] = useState('');
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [scanLock, setScanLock] = useState(false);
  
  // Feedback Status
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    title: string;
    text: string;
    details?: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<any>(null);

  // Synthesize custom check-in audio notifications
  const playSound = (type: 'success' | 'warning' | 'error') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        oscillator.stop(audioCtx.currentTime + 0.12);
      } else if (type === 'warning') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        oscillator.stop(audioCtx.currentTime + 0.2);
      } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        oscillator.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn('Web Audio check-in sound blocked by browser gesture permissions.');
    }
  };

  // Fetch lists
  const fetchAttendanceList = async () => {
    try {
      const res = await fetch('/api/admin/attendance');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSecondYear(data.secondYear || []);
        setThirdYear(data.thirdYear || []);
        setUnknown(data.unknown || []);
      }
      setCheckingAuth(false);
    } catch (err) {
      console.error('Fetch attendance list error:', err);
    }
  };

  useEffect(() => {
    fetchAttendanceList();
    // Auto-focus manual scanner input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Initialize/Clean up html5-qrcode
  useEffect(() => {
    if (isScanningActive) {
      // Load CDN Script if not already loaded
      const loadScannerScript = () => {
        if ((window as any).Html5QrcodeScanner) {
          initializeScanner();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
        script.async = true;
        script.onload = initializeScanner;
        document.body.appendChild(script);
      };

      const initializeScanner = () => {
        try {
          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          const scanner = new (window as any).Html5QrcodeScanner(
            'qr-reader',
            config,
            false
          );
          
          scanner.render(
            async (decodedText: string) => {
              if (decodedText) {
                // Lock the scanner to prevent rapid multi-scans
                handleQRAcquired(decodedText);
              }
            },
            (error: any) => {
              // Ignore standard scanning frame errors
            }
          );
          scannerRef.current = scanner;
        } catch (err) {
          console.error('Scanner init error:', err);
        }
      };

      loadScannerScript();
    } else {
      // Cleanup scanner
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
          scannerRef.current = null;
        } catch (e) {
          console.warn('Scanner cleanup warning:', e);
        }
      }
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
      }
    };
  }, [isScanningActive]);

  const handleQRAcquired = (scannedText: string) => {
    if (scanLock || checkInLoading) return;
    setScanLock(true);
    triggerCheckIn(scannedText);
    
    // Release scanner lock after 1.5 seconds
    setTimeout(() => {
      setScanLock(false);
    }, 1500);
  };

  // Check In Handler
  const triggerCheckIn = async (rollNum: string) => {
    const targetRoll = rollNum.trim();
    if (!targetRoll) return;

    setCheckInLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber: targetRoll }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.status === 'checked_in') {
          playSound('success');
          setFeedback({
            type: 'success',
            title: 'Successfully Checked In!',
            text: `${data.applicant.name} (${data.applicant.rollNumber})`,
            details: `${data.applicant.year} • Section ${data.applicant.section}`,
          });
        } else {
          playSound('warning');
          setFeedback({
            type: 'warning',
            title: 'Already Checked In',
            text: `${data.applicant.name} (${data.applicant.rollNumber})`,
            details: `Scanned earlier today at ${data.applicant.scannedAt ? new Date(data.applicant.scannedAt).toLocaleTimeString() : 'N/A'}`,
          });
        }
        // Refetch Lists
        fetchAttendanceList();
      } else {
        playSound('error');
        setFeedback({
          type: 'error',
          title: 'Check-In Failed',
          text: data.error || 'Applicant not found.',
        });
      }
    } catch (err) {
      playSound('error');
      setFeedback({
        type: 'error',
        title: 'Network Error',
        text: 'Could not connect to the check-in server.',
      });
    } finally {
      setCheckInLoading(false);
      setInputValue('');
      // Refocus input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      triggerCheckIn(inputValue);
    }
  };

  const handleExport = (year: '2nd' | '3rd') => {
    window.open(`/api/admin/export-attendance?year=${year}`, '_blank');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Verifying session...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AdminNavbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8 flex flex-col space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
              <QrCode className="w-7 h-7 text-emerald-500" />
              <span>Interview Attendance Desk</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-1 font-mono uppercase tracking-wider">
              Scan Sri Vasavi College ID cards to register attendance and download reports for HOD
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('2nd')}
              className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-extrabold text-xs tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all hover:text-white"
            >
              <Download size={14} />
              <span>Export 2nd Year</span>
            </button>
            <button
              onClick={() => handleExport('3rd')}
              className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-extrabold text-xs tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all hover:text-white"
            >
              <Download size={14} />
              <span>Export 3rd Year</span>
            </button>
          </div>
        </div>

        {/* Scanner Control Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Check-In Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-900 rounded-3xl p-6 backdrop-blur">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">Check-in Scan</h2>
              
              {/* Form Input */}
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={checkInLoading}
                    placeholder="Scan QR or Enter Roll Number..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-white placeholder-zinc-700 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-all font-mono uppercase"
                  />
                  <button
                    type="submit"
                    disabled={checkInLoading || !inputValue.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {checkInLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  </button>
                </div>
                
                {/* Camera Scanner Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsScanningActive(!isScanningActive)}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    isScanningActive
                      ? 'bg-red-950/40 border-red-500/30 text-red-400 hover:bg-red-950/60'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {isScanningActive ? (
                    <>
                      <CameraOff size={16} />
                      <span>Disable Camera Scanner</span>
                    </>
                  ) : (
                    <>
                      <Camera size={16} />
                      <span>Enable Camera Scanner</span>
                    </>
                  )}
                </button>
              </form>

              {/* Camera Scanner Box */}
              {isScanningActive && (
                <div className="mt-4 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-2">
                  <div id="qr-reader" className="w-full bg-black rounded-lg overflow-hidden text-xs text-zinc-500" />
                </div>
              )}
            </div>

            {/* Scan Feedback Board */}
            {feedback && (
              <div className={`border rounded-3xl p-5 flex items-start space-x-3.5 animate-fade-in shadow-lg ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 shadow-emerald-950/10'
                  : feedback.type === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/20 text-amber-400 shadow-amber-950/10'
                  : 'bg-red-950/20 border-red-500/20 text-red-400 shadow-red-950/10'
              }`}>
                {feedback.type === 'success' && <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                {feedback.type === 'warning' && <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />}
                {feedback.type === 'error' && <XCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wide text-white">{feedback.title}</h3>
                  <p className="text-xs font-mono font-bold mt-1 opacity-90">{feedback.text}</p>
                  {feedback.details && (
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 mt-1 font-mono">{feedback.details}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Checked-In Candidates Playfield */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 2nd Year Column */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-5 flex flex-col h-[500px]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>2nd Years Checked-In</span>
                  </h3>
                  <span className="bg-zinc-800/80 text-zinc-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    {secondYear.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {secondYear.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-[10px] uppercase">
                      No 2nd years checked in today
                    </div>
                  ) : (
                    secondYear.map((app) => (
                      <div key={app.id} className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{app.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">{app.rollNumber} • Sec {app.section}</p>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 flex items-center space-x-1">
                          <Clock size={10} />
                          <span>{app.scannedAt ? new Date(app.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 3rd Year Column */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-5 flex flex-col h-[500px]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>3rd Years Checked-In</span>
                  </h3>
                  <span className="bg-zinc-800/80 text-zinc-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    {thirdYear.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                  {thirdYear.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-[10px] uppercase">
                      No 3rd years checked in today
                    </div>
                  ) : (
                    thirdYear.map((app) => (
                      <div key={app.id} className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{app.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">{app.rollNumber} • Sec {app.section}</p>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 flex items-center space-x-1">
                          <Clock size={10} />
                          <span>{app.scannedAt ? new Date(app.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Unknown Mismatch Column (Only rendered if there are unknown students) */}
            {unknown.length > 0 && (
              <div className="bg-red-950/5 border border-red-500/20 rounded-3xl p-5 flex flex-col">
                <div className="flex items-center justify-between border-b border-red-900/30 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest font-mono flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Unresolved / Year Mismatch Records</span>
                  </h3>
                  <span className="bg-red-950/60 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                    {unknown.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto">
                  {unknown.map((app) => (
                    <div key={app.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-zinc-300">{app.name}</p>
                        <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">
                          {app.rollNumber} • DB Year: <span className="text-red-400">&quot;{app.rawYear || 'None'}&quot;</span>
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-600">
                        {app.scannedAt ? new Date(app.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mt-3 leading-relaxed">
                  ⚠️ Note: The records above could not be matched to either &quot;2nd Year&quot; or &quot;3rd Year&quot; lists automatically. They will be excluded from the Excel reports until manually corrected in the candidate database profile page.
                </p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </main>
  );
}
