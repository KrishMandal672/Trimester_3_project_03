import React, { useState, useMemo } from 'react';
import { db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function CalendarView({ sessions, refreshSessions }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const groupedSessions = useMemo(() => {
    return sessions.reduce((acc, s) => {
      const date = s.scheduledAt;
      if (!acc[date]) acc[date] = [];
      acc[date].push(s);
      return acc;
    }, {});
  }, [sessions]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1));

  const handleMarkComplete = async (sessionId) => {
    try {
      await updateDoc(doc(db, "sessions", sessionId), { status: 'completed' });
      refreshSessions();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="lg:col-span-2 space-y-10">
        <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
          <div>
            <h2 className="text-4xl font-black text-zinc-950 tracking-tighter uppercase">{currentDate.toLocaleString('default', { month: 'long' })} {year}</h2>
            <p className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2 leading-none">Operational Timeline</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrevMonth} className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center transition-all hover:bg-zinc-100 active:scale-95">
              <svg className="w-5 h-5 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={handleNextMonth} className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center transition-all hover:bg-zinc-100 active:scale-95">
              <svg className="w-5 h-5 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-zinc-100 rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl leading-none">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-zinc-50 p-6 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">{d}</div>
          ))}
          {blanks.map(i => <div key={`b-${i}`} className="bg-white p-10" />)}
          {days.map(d => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const daySessions = groupedSessions[dateStr] || [];
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <button 
                key={d} 
                onClick={() => setSelectedDate(dateStr)}
                className={`bg-white group relative aspect-square p-6 flex flex-col items-center justify-center transition-all ${isSelected ? 'ring-2 ring-inset ring-blue-600 z-10' : 'hover:bg-zinc-50'}`}
              >
                <span className={`text-sm font-black mb-2 ${isToday ? 'w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30' : isSelected ? 'text-blue-600' : 'text-zinc-950'}`}>
                  {d}
                </span>
                <div className="flex gap-1.5 mt-1.5 h-2 justify-center">
                  {daySessions.slice(0, 3).map((s, si) => (
                    <div key={si} className={`w-2 h-2 rounded-full ${s.status === 'completed' ? 'bg-green-500' : isToday ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-yellow-400'}`} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-zinc-50 rounded-[3rem] p-10 border border-zinc-100 shadow-inner flex flex-col h-full min-h-[600px]">
         <div className="mb-10">
            <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tighter">Day Parameters</h3>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2 leading-none">
               {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
         </div>

         <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {groupedSessions[selectedDate]?.length > 0 ? (
               groupedSessions[selectedDate].map((s, si) => (
                 <div key={si} className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm group hover:border-blue-500 transition-all">
                    <div className="flex items-start justify-between gap-6">
                       <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 truncate">Module Tracking</p>
                          <h4 className="text-base font-black text-zinc-900 line-clamp-2 leading-tight uppercase tracking-tight">{s.topicTitle}</h4>
                       </div>
                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${s.status === 'completed' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-zinc-50 text-zinc-300 border-zinc-100'}`}>
                          {s.status === 'completed' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3"/></svg>
                          )}
                       </div>
                    </div>
                    {s.status === 'pending' && (
                       <button 
                         onClick={() => handleMarkComplete(s.id)}
                         className="w-full mt-6 py-3.5 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                       >
                         Sync Complete
                       </button>
                    )}
                 </div>
               ))
            ) : (
               <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                  <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center grayscale opacity-50">🧘</div>
                  <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] max-w-[150px] leading-relaxed">Null state active. No modules scheduled.</p>
               </div>
            )}
         </div>

         <div className="mt-10 pt-10 border-t border-zinc-100 text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" />Active</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" />Stored</div>
             </div>
             <span className="opacity-50 tracking-tighter">Timeline V2.4</span>
         </div>
      </div>
    </div>
  );
}
