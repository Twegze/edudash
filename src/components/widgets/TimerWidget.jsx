import React, { useState, useEffect } from 'react';
import { Clock, Pause, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

const TimerWidget = () => {
  const [time, setTime] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(15);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => { setIsActive(false); setTime(inputMinutes * 60); };
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center h-full">
      <div className="flex items-center gap-2 mb-4 w-full">
        <Clock className="text-slate-900 dark:text-white" size={24} />
        <h3 className="font-semibold text-lg">Chronomètre</h3>
      </div>
      <div className="text-6xl font-bold font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
        {formatTime(time)}
      </div>
      <div className="flex gap-4 mb-4">
        <button onClick={toggle} className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center hover:opacity-90 shadow-md transition-transform active:scale-95">
          {isActive ? <Pause fill="white" size={24} /> : <Play fill="white" size={24} className="ml-1" />}
        </button>
        <button onClick={reset} className="w-16 h-16 rounded-full bg-white/90 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 shadow-sm transition-transform active:scale-95">
          <RotateCcw size={24} className="text-slate-900 dark:text-white" />
        </button>
      </div>
      {!isActive && (
        <div className="flex items-center gap-2 mt-4 bg-white/90 dark:bg-white/5 p-2 rounded-2xl border border-slate-300 dark:border-white/10">
          <input 
            type="number" min="1" max="90" value={inputMinutes} 
            onChange={(e) => setInputMinutes(parseInt(e.target.value) || 1)}
            className="w-16 text-center bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-semibold outline-none"
          />
          <span className="text-sm text-slate-500 dark:text-white/60">min</span>
          <button onClick={reset} className="ml-2 text-slate-900 dark:text-white p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors">
            <CheckCircle2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TimerWidget;