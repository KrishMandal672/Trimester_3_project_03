import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function WeeklyPlan({ plan, sessions = [], onScheduled }) {
  const { currentUser } = useAuth();
  const [isScheduling, setIsScheduling] = useState(false);

  const handleScheduleAll = async () => {
    if (isScheduling) return;
    setIsScheduling(true);
    try {
      const batch = [];
      plan.forEach(day => {
        day.topics.forEach(topic => {
          const isDuplicate = sessions.some(s => 
            s.topicId === topic.id && s.scheduledAt === day.date
          );
          if (!isDuplicate) {
            batch.push(
              addDoc(collection(db, "sessions"), {
                userId: currentUser.uid,
                topicId: topic.id,
                topicTitle: topic.title,
                scheduledAt: day.date,
                status: "pending",
                createdAt: new Date().toISOString()
              })
            );
          }
        });
      });
      if (batch.length > 0) {
        await Promise.all(batch);
        alert(`${batch.length} modules synchronized with system timeline.`);
      } else {
        alert("System timeline already optimal.");
      }
      if (onScheduled) onScheduled();
    } catch (err) {
      console.error(err);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">Strategic Matrix</h2>
          <p className="text-zinc-500 text-lg font-medium mt-2">Dynamic distribution based on memory coefficient.</p>
        </div>
        <button 
          disabled={isScheduling || plan.length === 0}
          onClick={handleScheduleAll}
          className="px-10 py-5 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-2xl disabled:opacity-50 active:scale-95 transition-all"
        >
          {isScheduling ? 'Executing...' : 'Sync Timeline'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {plan.map((day, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-[2rem] p-6 flex flex-col h-full group hover:border-blue-600 transition-all shadow-sm">
            <div className="mb-6">
               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">{day.day}</p>
               <p className="text-lg font-black text-zinc-950 tracking-tighter">{day.date.split('-')[2]} {new Date(day.date).toLocaleString('default', { month: 'short' })}</p>
            </div>
            <div className="flex-1 space-y-4">
               {day.topics.length > 0 ? (
                 day.topics.map((topic, ti) => (
                   <div key={ti} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter mb-2 truncate">{topic.subject}</p>
                      <p className="text-xs font-bold text-zinc-800 line-clamp-2 leading-relaxed">{topic.title}</p>
                   </div>
                 ))
               ) : (
                 <div className="flex items-center justify-center h-24 border border-dashed border-zinc-100 rounded-2xl">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Idle State</p>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-zinc-950 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
         <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-3xl flex items-center justify-center text-2xl relative z-10">🛡️</div>
         <div className="flex-1 relative z-10 text-center md:text-left">
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-2">Protocol Insight</h4>
            <p className="text-zinc-400 text-sm font-medium leading-loose max-w-2xl">
               This matrix optimizes cognitive recovery patterns by prioritizing modules with high decay factors. Operational load is strictly limited to 3 modules per cycle to ensure peak performance.
            </p>
         </div>
      </div>
    </div>
  );
}
