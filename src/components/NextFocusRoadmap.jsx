import React from 'react';

export default function NextFocusRoadmap({ nextFocus }) {
  if (!nextFocus || nextFocus.length === 0) return null;
  return (
    <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-black text-zinc-950 tracking-tighter uppercase leading-none">Cognitive Roadmap</h2>
        <div className="h-px flex-1 bg-zinc-100" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {nextFocus.map((topic, i) => (
          <div key={i} className="group relative bg-white border border-zinc-100 rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-2">
            <div className={`absolute top-0 right-10 w-12 h-2 rounded-b-xl ${i === 0 ? 'bg-blue-600' : 'bg-zinc-200'}`} />
            <div className="mb-6">
              <span className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-black text-zinc-400 uppercase tracking-widest">{topic.subject || 'Core'}</span>
            </div>
            <h4 className="text-lg font-black text-zinc-950 uppercase tracking-tighter mb-4 leading-tight group-hover:text-blue-600 transition-colors">{topic.title}</h4>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-50">
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Priority</span>
               <span className={`text-[10px] font-black tracking-widest uppercase ${i === 0 ? 'text-blue-600' : 'text-zinc-300'}`}>0{i + 1} / 03</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
