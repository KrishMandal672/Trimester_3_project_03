import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

import Topics from './Topics';
import StudySession from './StudySession';
import CalendarView from './CalendarView';
import WeeklyPlan from './WeeklyPlan';

import TopicCard from '../components/TopicCard';
import StudyTips from '../components/StudyTips';
import StatsHUD from '../components/StatsHUD';
import NextFocusRoadmap from '../components/NextFocusRoadmap';
import LoadingState from '../components/LoadingState';

import { generateLearningReport, getStudySessionSet } from '../services/aiEngine';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [topics, setTopics] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const q = query(collection(db, "topics"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchSessions = useCallback(async () => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, "sessions"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchTopics();
    fetchSessions();
  }, [fetchTopics, fetchSessions]);

  const analysis = useMemo(() => generateLearningReport(topics), [topics]);
  const studySet = useMemo(() => getStudySessionSet(topics), [topics]);

  const handleDeleteTopic = useCallback(async (topicId) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await deleteDoc(doc(db, "topics", topicId));
      setTopics(prev => prev.filter(t => t.id !== topicId));
    } catch (err) { console.error(err); }
  }, []);

  const handleUpdateConfidence = useCallback(async (topicId, newLevel) => {
    try {
      await updateDoc(doc(db, "topics", topicId), { 
        confidence: newLevel,
        lastReviewed: new Date().toISOString()
      });
      fetchTopics();
    } catch (err) { console.error(err); }
  }, [fetchTopics]);

  const handleMarkReviewed = useCallback(async (topicId) => {
    try {
      await updateDoc(doc(db, "topics", topicId), { 
        lastReviewed: new Date().toISOString()
      });
      fetchTopics();
    } catch (err) { console.error(err); }
  }, [fetchTopics]);

  const handleUpdateNote = useCallback(async (topicId, text) => {
    try {
      await updateDoc(doc(db, "topics", topicId), { notes: text });
      fetchTopics();
    } catch (err) { console.error(err); }
  }, [fetchTopics]);

  const handleUpdateDetails = useCallback(async (topicId, details) => {
    try {
      await updateDoc(doc(db, "topics", topicId), details);
      fetchTopics();
    } catch (err) { console.error(err); }
  }, [fetchTopics]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-zinc-900 font-outfit antialiased selection:bg-blue-100">
      <nav className="sticky top-0 h-20 bg-white/80 backdrop-blur-xl border-b border-zinc-100 z-50 transition-all duration-300">
         <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 bg-zinc-950 rounded-2xl flex items-center justify-center shadow-2xl shadow-zinc-950/20 group hover:scale-105 transition-transform cursor-pointer">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
               </div>
               <div>
                  <h1 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-900 leading-none">LearnWise</h1>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                    Operational
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-50 p-1.5 rounded-[1.25rem] border border-zinc-100">
               {[
                 { id: 'overview', label: 'Home' },
                 { id: 'topics', label: 'Modules' },
                 { id: 'plan', label: 'Planner' },
                 { id: 'calendar', label: 'Timeline' }
               ].map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)} 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200' : 'text-zinc-400 hover:text-zinc-600'}`}
                 >
                    {tab.label}
                 </button>
               ))}
               <div className="w-px h-4 bg-zinc-200 mx-1" />
               <button 
                  onClick={() => setActiveTab('study')} 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'study' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'text-orange-500 hover:bg-orange-50'}`}
               >
                  Practice
               </button>
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-zinc-100">
               <button onClick={logout} className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
               </button>
            </div>
         </div>
      </nav>

      <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-7xl w-full mx-auto pb-48">
          {loading ? (
             <LoadingState />
          ) : (
            <div className="space-y-24">
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-24">
                  <header>
                    <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-3">Hello, {currentUser?.displayName?.split(' ')[0] || 'Learner'}</h1>
                    <p className="text-zinc-500 font-medium text-lg">System-wide health is at {analysis.learningScore}% efficiency today.</p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                     <StatsHUD score={analysis.learningScore} onStartPractice={() => setActiveTab('study')} />
                     <StudyTips insights={analysis.insights} advice={analysis.advice} />
                  </div>

                  <NextFocusRoadmap nextFocus={analysis.nextFocus} />
                  
                  <section className="bg-white border border-zinc-200 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-blue-500 transition-colors shadow-sm">
                     <div className="max-w-md">
                        <h3 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Strategic Planning</h3>
                        <p className="text-zinc-500 mt-2 font-medium leading-relaxed">Access the Weekly Planner to optimize cognitive load and eliminate performance gaps.</p>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setActiveTab('plan')} className="px-10 py-5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all">Open Planner</button>
                        <button onClick={() => setActiveTab('calendar')} className="px-10 py-5 bg-white border border-zinc-200 text-zinc-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-50 transition-all">Open Timeline</button>
                     </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-4 mb-10">
                      <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">High Priority Queue</h2>
                      {analysis.revisionQueue.high.length > 0 && (
                        <span className="bg-red-50 text-red-500 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border border-red-100 animate-pulse">
                          {analysis.revisionQueue.high.length} Items Due
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-6">
                      {analysis.revisionQueue.high.length > 0 ? (
                        analysis.revisionQueue.high.map(topic => (
                          <TopicCard 
                            key={topic.id} 
                            topic={topic} 
                            onDelete={handleDeleteTopic} 
                            onUpdateConfidence={handleUpdateConfidence}
                            onMarkReviewed={handleMarkReviewed}
                            onUpdateNote={handleUpdateNote}
                            onUpdateDetails={handleUpdateDetails}
                          />
                        ))
                      ) : (
                        <div className="p-20 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
                           <p className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Revision queue clear. All systems optimal.</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'study' && (
                <StudySession 
                  topics={studySet} 
                  onComplete={() => setActiveTab('overview')}
                  onUpdateConfidence={handleUpdateConfidence}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarView 
                  sessions={sessions} 
                  refreshSessions={fetchSessions} 
                />
              )}

              {activeTab === 'plan' && (
                <WeeklyPlan 
                  plan={analysis.weeklyPlan} 
                  sessions={sessions}
                  onScheduled={() => {
                    fetchSessions();
                    setActiveTab('calendar');
                  }} 
                />
              )}

              {activeTab === 'topics' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <Topics 
                    topics={topics} 
                    loading={loading} 
                    fetchTopics={fetchTopics} 
                    onDelete={handleDeleteTopic}
                    onUpdateConfidence={handleUpdateConfidence}
                    onMarkReviewed={handleMarkReviewed}
                    onUpdateNote={handleUpdateNote}
                    onUpdateDetails={handleUpdateDetails}
                  />
                </div>
              )}
            </div>
          )}
      </main>
    </div>
  );
}
