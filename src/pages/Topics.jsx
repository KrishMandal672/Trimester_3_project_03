import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import TopicCard from '../components/TopicCard';

export default function Topics({ 
  topics, 
  loading, 
  fetchTopics, 
  onDelete, 
  onUpdateConfidence, 
  onMarkReviewed,
  onUpdateNote,
  onUpdateDetails
}) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleAddTopic = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!currentUser) return;
    if (!title.trim() || !subject.trim()) {
      setFormError('Identity of module required.');
      return;
    }
    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "topics"), {
        title: title.trim(),
        subject: subject.trim(),
        confidence: parseInt(confidence),
        userId: currentUser.uid, 
        createdAt: new Date().toISOString(),
        lastReviewed: new Date().toISOString()
      });
      setTitle('');
      setSubject('');
      setConfidence(3);
      fetchTopics();
    } catch (err) {
      setFormError('System link failed. Retry connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="bg-white border border-zinc-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-12 -mt-12" />
        <div className="mb-8">
          <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">Module Initialization</h2>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Register new knowledge data</p>
        </div>
        {formError && (
          <div className="mb-8 py-3 px-6 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{formError}</p>
          </div>
        )}
        <form onSubmit={handleAddTopic} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-1">Module ID/Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-6 py-4 text-sm bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
              placeholder="Module Name"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-1">Domain</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-6 py-4 text-sm bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
              placeholder="Category"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-1">Base Level</label>
            <select 
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-6 py-4 text-sm bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-black appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map(num => (
                 <option key={num} value={num}>Lvl {num}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4 lg:col-span-1">
            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full py-5 px-6 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Syncing...' : 'Add Module'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase mb-8 ml-1">Active Inventory</h2>
        {loading ? (
          <div className="flex items-center gap-4 text-zinc-400 font-black uppercase text-[10px] tracking-widest p-20">
            <div className="w-5 h-5 border-2 border-zinc-200 border-t-blue-600 rounded-full animate-spin" />
            Mapping data...
          </div>
        ) : topics.length === 0 ? (
          <div className="p-32 text-center bg-zinc-50 rounded-[3rem] border-2 border-zinc-100 border-dashed flex flex-col items-center justify-center">
            <h3 className="text-xl font-black text-zinc-400 uppercase tracking-tight">Database Empty</h3>
            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-4">Initialize modules to begin tracking</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
             {topics.map(topic => (
               <TopicCard 
                 key={topic.id} 
                 topic={topic} 
                 onDelete={onDelete} 
                 onUpdateConfidence={onUpdateConfidence}
                 onMarkReviewed={onMarkReviewed}
                 onUpdateNote={onUpdateNote}
                 onUpdateDetails={onUpdateDetails}
               />
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
