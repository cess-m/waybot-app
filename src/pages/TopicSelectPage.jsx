import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground'; 
import { TOPICS } from '../config/waybotConfig'; // Must import constants

const TopicSelectPage = ({ setView, studentName, handleSelectTopic, hasHistory }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <AnimatedBackground />
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button onClick={() => setView("student-login")} className="group p-2 -ml-2 rounded-lg hover:bg-slate-800 transition text-sm text-slate-500 hover:text-white mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        
        {/* Header Text */}
        <h2 className="text-3xl font-bold text-white mb-2">Hi {studentName}! 👋</h2>
        <p className="text-slate-400 mb-8">What would you like to learn today?</p>
        
        {/* Topic List */}
        <div className="space-y-3">
          {TOPICS.map((topic) => (
            <button 
              key={topic.id} 
              onClick={() => handleSelectTopic(topic.id)} 
              className="w-full text-left rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80 transition-all p-4 flex items-center gap-4 group"
            >
              {/* Topic Icon */}
              <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + topic.color + " flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform"}>
                {topic.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white group-hover:text-violet-300 transition">{topic.name}</span>
                  {/* "Continue" Badge if history exists */}
                  {hasHistory(topic.id) && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">Continue</span>}
                </div>
                <span className="text-sm text-slate-400">{topic.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicSelectPage;