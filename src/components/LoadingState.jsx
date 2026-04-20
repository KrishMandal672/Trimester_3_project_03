import React from 'react';

export default function LoadingState({ message = "Synchronizing neural interface..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-48 h-full space-y-8">
      <div className="relative">
        <div className="w-16 h-16 border-[6px] border-zinc-100 border-t-zinc-950 rounded-full animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
      </div>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{message}</p>
    </div>
  );
}
