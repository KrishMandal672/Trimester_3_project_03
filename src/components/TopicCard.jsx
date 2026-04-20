import React, { useState, useEffect } from 'react';

export default function TopicCard({ topic, onDelete, onUpdateConfidence, onMarkReviewed, onUpdateNote, onUpdateDetails }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const [editSubject, setEditSubject] = useState(topic.subject);
  const [note, setNote] = useState(topic.notes || '');

  useEffect(() => {
    setEditTitle(topic.title);
    setEditSubject(topic.subject);
    setNote(topic.notes || '');
  }, [topic]);

  const daysSince = Math.floor((new Date() - new Date(topic.lastReviewed)) / (1000 * 60 * 60 * 24));

  const handleSave = () => {
    if (onUpdateDetails) {
      onUpdateDetails(topic.id, { title: editTitle, subject: editSubject });
    }
    setIsEditing(false);
  };

  const handleLevelChange = (lvl) => {
    if (onUpdateConfidence) {
      onUpdateConfidence(topic.id, lvl);
    }
  };

  return (
    <div className="group relative bg-white border border-zinc-100 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/50 hover:border-zinc-200 overflow-hidden">
      <div className={`absolute top-0 left-0 w-2 h-full ${topic.confidence <= 2 ? 'bg-red-500' : topic.confidence <= 3 ? 'bg-yellow-400' : 'bg-green-500'}`} />
      <div className="p-10">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-4 mb-3">
                  <span className="px-4 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-black text-zinc-400 uppercase tracking-widest">{topic.subject}</span>
                  <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                    {daysSince === 0 ? 'Sync active' : `Offline ${daysSince}d`}
                  </span>
               </div>
               {isEditing ? (
                 <div className="flex gap-3">
                    <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-xl font-black bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/10" />
                    <button onClick={handleSave} className="bg-zinc-900 text-white px-6 rounded-2xl text-[10px] font-black uppercase">Save</button>
                 </div>
               ) : (
                 <h3 className="text-2xl font-black text-zinc-900 truncate tracking-tighter group-hover:text-blue-600 transition-colors uppercase">{topic.title}</h3>
               )}
            </div>
            <div className="flex items-center gap-10">
               <div className="flex flex-col items-end">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-4">Integrity Lvl</p>
                  <div className="flex gap-1.5">
                     {[1, 2, 3, 4, 5].map(num => (
                        <button key={num} onClick={() => handleLevelChange(num)} className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${num === topic.confidence ? 'bg-zinc-950 text-white shadow-xl' : 'bg-zinc-50 text-zinc-300 hover:bg-zinc-100'}`}>
                           {num}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button onClick={() => setIsEditing(!isEditing)} className="p-4 bg-zinc-50 rounded-2xl hover:bg-white hover:shadow-md text-zinc-400 hover:text-zinc-950 transition-all border border-transparent hover:border-zinc-100">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                  <button onClick={() => onDelete(topic.id)} className="p-4 bg-zinc-50 rounded-2xl hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                  <button onClick={() => setIsExpanded(!isExpanded)} className={`p-4 rounded-2xl transition-all ${isExpanded ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950'}`}>
                     <svg className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                  </button>
               </div>
            </div>
         </div>
         {isExpanded && (
           <div className="mt-10 pt-10 border-t border-zinc-50 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Internal Data</h4>
                    <textarea value={note} onChange={e => setNote(e.target.value)} onBlur={() => onUpdateNote(topic.id, note)} placeholder="Input knowledge parameters..." className="w-full h-48 bg-zinc-50 border border-zinc-100 rounded-[2rem] p-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-zinc-300 leading-relaxed shadow-inner" />
                 </div>
                 <div className="bg-zinc-50 rounded-[2.5rem] p-10 border border-zinc-100 shadow-inner">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-8">System Analytics</h4>
                    <div className="space-y-8">
                       <div>
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Memory Coefficient</span>
                             <span className="text-lg font-black text-zinc-950">{topic.confidence * 20}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${topic.confidence * 20}%` }} />
                          </div>
                       </div>
                       <div className="p-6 bg-white rounded-3xl border border-zinc-100">
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed mb-2">Neural Prediction</p>
                          <p className="text-[12px] font-medium text-zinc-600 leading-relaxed">
                             Pattern tracking indicates knowledge is in <span className="font-black text-zinc-950 uppercase tracking-tighter">"{topic.confidence > 3 ? 'Terminal Storage' : 'Active Buffer'}"</span>.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
