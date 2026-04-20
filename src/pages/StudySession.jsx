import React, { useState } from 'react';

export default function StudySession({ topics, onComplete, onUpdateConfidence }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const currentTopic = topics[currentIndex];

  const handleNext = async (newConfidence) => {
    await onUpdateConfidence(currentTopic.id, newConfidence);
    if (currentIndex < topics.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowNotes(false);
    } else {
      setSessionFinished(true);
    }
  };

  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center bg-white rounded-[3rem] border border-zinc-100 shadow-xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-black text-zinc-950 uppercase tracking-tighter mb-4">Inventory Empty</h2>
        <p className="text-zinc-500 font-medium leading-relaxed max-w-sm">No data available for practice sessions. Add modules to initialize tracking.</p>
        <button onClick={onComplete} className="mt-12 px-10 py-5 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all">Go Back</button>
      </div>
    );
  }

  if (sessionFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center bg-zinc-950 rounded-[4rem] shadow-2xl animate-in zoom-in duration-500 max-w-3xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-2xl relative z-10">
           <svg className="w-12 h-12 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter relative z-10">Sync Complete</h2>
        <p className="text-zinc-400 mt-6 max-w-sm font-black uppercase text-xs tracking-widest leading-loose relative z-10">Parameters updated. Memory coefficients recalibrated.</p>
        <button 
          onClick={onComplete} 
          className="mt-16 px-16 py-6 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-500 hover:text-white transition-all active:scale-95 relative z-10 shadow-xl"
        >
          Exit Matrix
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between px-6">
        <div>
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-2 leading-none">Cognitive Protocol Active</p>
           <h1 className="text-2xl font-black text-zinc-950 uppercase tracking-tighter leading-none">Domain: {currentTopic.subject}</h1>
        </div>
        <div className="flex gap-2.5">
           {topics.map((_, i) => (
             <div key={i} className={`h-2.5 w-10 rounded-full transition-all duration-700 ${i <= currentIndex ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-zinc-200'}`} />
           ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[4rem] p-20 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="relative space-y-16 text-center">
            <div>
              <span className="px-5 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-10 inline-block">Module {currentIndex + 1} / {topics.length}</span>
              <h2 className="text-6xl font-black text-zinc-950 tracking-tighter leading-none mb-6 uppercase">{currentTopic.title}</h2>
              <div className="flex items-center justify-center gap-4">
                 <div className="h-px w-12 bg-zinc-100" />
                 <p className="text-zinc-300 font-black uppercase text-[10px] tracking-[0.3em]">Historical Lvl: {currentTopic.confidence}</p>
                 <div className="h-px w-12 bg-zinc-100" />
              </div>
            </div>

            <div className={`transition-all duration-700 ${showNotes ? 'opacity-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
               <div className="p-12 bg-zinc-50 rounded-[3rem] border border-zinc-100 text-left shadow-inner">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-200 pb-3">Stored Parameters</p>
                  <p className="text-zinc-700 font-medium leading-loose text-lg">{currentTopic.notes || 'Null data field.'}</p>
               </div>
            </div>

            {!showNotes && (
               <button 
                  onClick={() => setShowNotes(true)}
                  className="px-16 py-7 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-transform shadow-2xl hover:bg-blue-600"
               >
                  Decrypt Notes
               </button>
            )}

            {showNotes && (
               <div className="pt-10 space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-none">Self-Calibration Evaluation</p>
                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        onClick={() => handleNext(num)}
                        className={`w-16 h-16 rounded-[1.25rem] font-black text-2xl transition-all active:scale-90 border shadow-sm ${
                          num <= 2 ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white' : 
                          num === 3 ? 'bg-yellow-50 text-yellow-500 border-yellow-100 hover:bg-yellow-500 hover:text-white' : 
                          'bg-green-50 text-green-500 border-green-100 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
               </div>
            )}
        </div>
      </div>

      <div className="text-center">
        <button onClick={onComplete} className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] hover:text-red-500 transition-colors">Terminate Protocol</button>
      </div>
    </div>
  );
}
