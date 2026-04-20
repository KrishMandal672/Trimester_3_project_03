import React from 'react';

export default function StatsHUD({ score, onStartPractice }) {
  return (
    <div className="lg:col-span-1 bg-zinc-950 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group/hud border border-white/5">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full -mr-40 -mt-40 transition-all duration-1000 group-hover/hud:bg-blue-600/20" />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Health Quotient</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-[7rem] font-black text-white tracking-tighter leading-none">{score}</span>
              <span className="text-2xl font-black text-blue-500 mb-4">%</span>
            </div>
            <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.2em] leading-none">Operational State</p>
          </div>
        </div>
        <div className="mt-16 space-y-8">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_25px_rgba(37,99,235,0.5)]" 
              style={{ width: `${score}%` }} 
            />
          </div>
          <button 
            onClick={onStartPractice}
            className="w-full py-6 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 hover:text-white transition-all transform active:scale-95 shadow-2xl"
          >
            Initiate Practice Mode
          </button>
        </div>
      </div>
    </div>
  );
}
