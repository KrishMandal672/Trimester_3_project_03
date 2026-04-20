import React from 'react';

export default function StudyTips({ insights, advice }) {
  return (
    <div className="lg:col-span-2 bg-white border border-zinc-100 p-12 rounded-[3.5rem] shadow-sm flex flex-col justify-between relative overflow-hidden group/insights group transition-all duration-700 hover:shadow-2xl hover:shadow-zinc-200/50">
      <div>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-3xl flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
             </div>
             <div>
                <h3 className="text-zinc-950 text-xl font-black tracking-tighter uppercase leading-none">Neural Insights</h3>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2 leading-none">Intelligence Monitoring Layer</p>
             </div>
          </div>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">Live Scan</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-8">
              <p className="text-lg font-black text-zinc-950 leading-relaxed border-l-[6px] border-orange-500 pl-8 uppercase tracking-tighter italic">
                "{advice}"
              </p>
              <div className="h-px w-24 bg-zinc-100" />
           </div>
           <div className="space-y-6">
             {insights.map((insight, i) => (
               <div key={i} className="flex gap-5 items-start group/item animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 150}ms` }}>
                 <div className="mt-2.5 w-2 h-2 rounded-full bg-zinc-100 group-hover/item:bg-blue-600 transition-colors shrink-0" />
                 <p className="text-sm font-medium text-zinc-500 leading-loose group-hover/item:text-zinc-950 transition-colors">
                   {insight}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </div>
      <div className="mt-16 pt-10 border-t border-zinc-50 flex items-center justify-between">
         <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em]">Analytics Engine V4.2</span>
         <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
         </div>
      </div>
    </div>
  );
}
