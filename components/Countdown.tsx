'use client';

import { useEffect, useState, useRef } from 'react';

interface CountdownProps {
  targetTimeStr: string;
  onComplete?: () => void;
}

export default function Countdown({ targetTimeStr, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  const onCompleteCalled = useRef(false);

  useEffect(() => {
    const targetDate = new Date(targetTimeStr).getTime();

    // Fetch initial server time offset
    let timeOffset = 0;
    fetch('/api/recruitment-status')
      .then((res) => res.json())
      .then((data) => {
        const serverTime = new Date(data.serverTime).getTime();
        const clientTime = Date.now();
        timeOffset = serverTime - clientTime;
      })
      .catch((err) => console.error('Error syncing clock:', err));

    const calculateTimeLeft = () => {
      const now = Date.now() + timeOffset;
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        if (onComplete && !onCompleteCalled.current) {
          onCompleteCalled.current = true;
          onComplete();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTimeStr, onComplete]);

  if (timeLeft.isPast) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-zinc-900/50 border border-emerald-500/20 rounded-2xl max-w-lg mx-auto backdrop-blur">
        <span className="text-emerald-400 font-semibold tracking-wider text-sm uppercase">Recruitment Status</span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center">APPLICATIONS ARE NOW OPEN</h3>
      </div>
    );
  }

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center space-y-1">
        <span className="text-emerald-400 font-semibold tracking-widest text-xs uppercase animate-pulse">Status: Pre-Recruitment</span>
        <h4 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Applications Open In</h4>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-6">
        {timeBlocks.map((block, idx) => (
          <div key={block.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-zinc-900 border border-zinc-800 rounded-xl md:rounded-2xl shadow-xl shadow-black/20">
                <span className="text-2xl md:text-4xl font-black text-white font-mono tracking-tight">
                  {String(block.value).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-zinc-500 tracking-widest uppercase mt-2">
                {block.label}
              </span>
            </div>
            {idx < 3 && (
              <span className="text-zinc-700 font-extrabold text-xl md:text-3xl ml-3 md:ml-6 font-mono -mt-6">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
