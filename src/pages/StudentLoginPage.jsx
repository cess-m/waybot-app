import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground'; // Don't forget this import!

const StudentLoginPage = ({ setView, studentName, setStudentName, handleStudentLogin, isLoading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <AnimatedBackground />
      <div className="w-full max-w-sm">
        {/* Back Button */}
        <button onClick={() => setView("home")} className="group p-2 -ml-2 rounded-lg hover:bg-slate-800 transition text-sm text-slate-500 hover:text-white mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
        <p className="text-slate-400 mb-8">Enter your name to start learning</p>
        <input 
          type="text" 
          placeholder="Your name or student ID" 
          value={studentName} 
          onChange={(e) => setStudentName(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()} 
          className="w-full px-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition mb-4" 
          autoFocus 
        />
        <button 
          onClick={handleStudentLogin} 
          disabled={!studentName.trim()} 
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-xl shadow-violet-500/25 transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none 
            hover:scale-105 hover:shadow-violet-500/40 hover:brightness-110 active:scale-95"
        >
          {isLoading ? "Loading..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default StudentLoginPage;