import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';

const HomePage = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🎓</span>
            </div>
            <span className="text-xl font-bold text-white">Waybot</span>
          </div>
          <button 
            onClick={() => setView("teacher-login")} 
            className="flex items-center gap-2 p-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition text-sm font-medium" 
            title="Teacher Portal Access"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 13.5v6.75a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.25v-6.75ZM15 6.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM9 6.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
            </svg>
            Teacher Portal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            AI-Powered Learning
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Master Calculus
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Step by Step
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your personal AI tutor that guides you through every problem, teaching the process, not just the answer.
          </p>

          {/* CTA Button */}
          <button 
            onClick={() => setView("student-login")}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all"
          >
            Start Learning Free
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
            {[
              { icon: "📈", title: "Limits", desc: "Master foundational concepts" },
              { icon: "📐", title: "Differentiation", desc: "Understand rates of change" },
              { icon: "📊", title: "Integration", desc: "Calculate areas & accumulation" },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 hover:border-violet-500/50 transition-all"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Social Proof / Stats */}
          <div className="flex justify-center gap-12 mt-16 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-slate-500 text-sm">Available</div>
            </div>
            <div className="w-px bg-slate-700"></div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">∞</div>
              <div className="text-slate-500 text-sm">Practice Problems</div>
            </div>
            <div className="w-px bg-slate-700"></div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">3</div>
              <div className="text-slate-500 text-sm">Core Topics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>© 2025 Waybot. Built for STEM students.</div>
          <div className="flex items-center gap-6">
            <span>Powered by AI</span>
            <span>•</span>
            <span>No account required</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;