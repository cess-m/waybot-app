import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import { TEACHER_PASSWORD } from '../config/waybotConfig'; // Import the constant

const TeacherLoginPage = ({ setView, teacherPass, setTeacherPass, handleTeacherLogin }) => {
    // Note: The actual handleTeacherLogin function is still defined in Waybot.jsx 
    // because it contains state setting (setTeacherAuthenticated, setView) which 
    // must remain in the main component.

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <AnimatedBackground />

            {/* Container with top-center alignment */}
            <div className="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 px-4 sm:px-6 pb-8">
                {/* Back Button */}
                <div className="w-full max-w-md mb-6 sm:mb-8">
                    <button
                        onClick={() => setView("home")}
                        className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/50 transition-all text-slate-400 hover:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>
                        <span className="text-sm font-medium">Back to Home</span>
                    </button>
                </div>

                {/* Main Card */}
                <div className="w-full max-w-md">
                    {/* Header Section */}
                    <div className="text-center mb-5 sm:mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 backdrop-blur-xl">
                            <svg
                                className="w-6 h-6 sm:w-7 sm:h-7 text-violet-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                                />
                            </svg>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                            Teacher Portal
                        </h1>
                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                            Enter password to access analytics
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="relative">
                        {/* Gradient border effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl opacity-10 blur-sm"></div>

                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-2xl">
                            {/* Password Input */}
                            <div className="mb-4 sm:mb-5">
                                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                    Portal Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Enter portal password"
                                        value={teacherPass}
                                        onChange={(e) => setTeacherPass(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && teacherPass && handleTeacherLogin()}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm pr-10"
                                        autoFocus
                                    />
                                    {/* Lock icon */}
                                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Access Button */}
                            <button
                                onClick={handleTeacherLogin}
                                disabled={!teacherPass}
                                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-violet-500/20 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Access Dashboard
                                    <svg
                                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </button>

                            {/* Demo password hint */}
                            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                                <div className="flex items-start gap-2">
                                    <svg
                                        className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-xs font-medium text-slate-300">Demo Access</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Password: <span className="font-mono text-violet-300">{TEACHER_PASSWORD}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security badge */}
                    <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5 text-slate-500">
                        <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-xs">Secure teacher access only</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherLoginPage;