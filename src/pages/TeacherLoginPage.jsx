import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import { TEACHER_PASSWORD } from '../config/waybotConfig'; // Import the constant

const TeacherLoginPage = ({ setView, teacherPass, setTeacherPass, handleTeacherLogin }) => {
    // Note: The actual handleTeacherLogin function is still defined in Waybot.jsx 
    // because it contains state setting (setTeacherAuthenticated, setView) which 
    // must remain in the main component.

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
                <h2 className="text-3xl font-bold text-white mb-2">Teacher Portal</h2>
                <p className="text-slate-400 mb-8">Enter password to access analytics</p>
                <input 
                    type="password" 
                    placeholder="Portal password" 
                    value={teacherPass} 
                    onChange={(e) => setTeacherPass(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && handleTeacherLogin()} 
                    className="w-full px-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition mb-4" 
                    autoFocus 
                />
                <button 
                    onClick={handleTeacherLogin} 
                    // Disable if password field is empty
                    disabled={!teacherPass}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-xl shadow-violet-500/25 transition-all 
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none 
                        hover:shadow-violet-500/50 hover:scale-105 active:scale-95"
                >
                    Access Dashboard
                </button>
                <p className="text-slate-600 text-xs text-center mt-4">Demo: {TEACHER_PASSWORD}</p>
            </div>
        </div>
    );
};

export default TeacherLoginPage;