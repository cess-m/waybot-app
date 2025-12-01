import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';

const HomePage = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/25">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.95"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Waybot</span>
          </div>
          <button 
            onClick={() => setView("teacher-login")} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all text-sm font-semibold backdrop-blur-sm" 
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Teacher Portal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8 backdrop-blur-xl">
            <div className="relative">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse block"></span>
              <span className="absolute inset-0 w-2 h-2 bg-violet-400 rounded-full animate-ping"></span>
            </div>
            Powered by Advanced AI
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white mb-8 leading-tight tracking-tight">
            Master Calculus
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transform your calculus journey with an AI tutor that explains every concept clearly, step by step.
          </p>

          {/* CTA Button */}
          <button 
            onClick={() => setView("student-login")}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-[1.02] transition-all duration-300"
          >
            <span>Start Learning Now</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity"></div>
          </button>

          <p className="text-slate-500 text-sm mt-4">No credit card required • Free forever</p>

          {/* Core Topics Section */}
          <div className="mt-32 mb-20">
            <h2 className="text-3xl font-bold text-white mb-4">Core Topics Covered</h2>
            <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
              Master the fundamental concepts of calculus with interactive lessons and practice
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { 
                  latex: "\\lim_{x \\to a} f(x)",
                  title: "Limits", 
                  desc: "Understanding the behavior of functions as they approach specific values",
                  gradient: "from-violet-500/10 to-purple-500/10",
                  border: "border-violet-500/20",
                  hoverBorder: "group-hover:border-violet-500/50",
                  icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                },
                { 
                  latex: "\\frac{dy}{dx}",
                  title: "Derivatives", 
                  desc: "Analyzing rates of change and understanding how functions evolve",
                  gradient: "from-indigo-500/10 to-blue-500/10",
                  border: "border-indigo-500/20",
                  hoverBorder: "group-hover:border-indigo-500/50",
                  icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                },
                { 
                  latex: "\\int f(x) \\, dx",
                  title: "Integrals", 
                  desc: "Computing areas, volumes, and understanding accumulation of quantities",
                  gradient: "from-purple-500/10 to-pink-500/10",
                  border: "border-purple-500/20",
                  hoverBorder: "group-hover:border-purple-500/50",
                  icon: "M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                }
              ].map((topic, i) => (
                <div 
                  key={i} 
                  className={`group relative p-8 rounded-3xl bg-gradient-to-br ${topic.gradient} border ${topic.border} ${topic.hoverBorder} transition-all duration-300 backdrop-blur-xl hover:scale-[1.02]`}
                >
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d={topic.icon} />
                    </svg>
                  </div>
                  
                  <div className="relative">
                    <div className="text-5xl font-bold text-violet-400 mb-6 font-serif">
                      {topic.latex === "\\lim_{x \\to a} f(x)" && (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl">lim</span>
                          <span className="text-xl text-violet-300">x→a</span>
                        </div>
                      )}
                      {topic.latex === "\\frac{dy}{dx}" && (
                        <span className="text-4xl">dy/dx</span>
                      )}
                      {topic.latex === "\\int f(x) \\, dx" && (
                        <span className="text-5xl">∫</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{topic.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
            <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart AI Tutor</h3>
              <p className="text-slate-400 leading-relaxed">
                Get personalized explanations that adapt to your learning pace and style. Never feel lost again.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Progress</h3>
              <p className="text-slate-400 leading-relaxed">
                Monitor your improvement with detailed analytics. See exactly where you excel and what needs work.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Learn Anytime</h3>
              <p className="text-slate-400 leading-relaxed">
                Available 24/7 with unlimited practice problems. Study at your own pace, whenever inspiration strikes.
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-32 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Loved by Students</h2>
            <p className="text-slate-400 mb-12">
              Join thousands of students who've transformed their calculus grades
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 backdrop-blur-xl text-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-xl">
                    S
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">Sarah Mitchell</div>
                    <div className="text-sm text-slate-400">UCLA • Calculus II</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed text-lg">
                  "This completely changed how I understand derivatives. The explanations are crystal clear and I can finally see the big picture. Went from struggling to top of my class!"
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 backdrop-blur-xl text-left">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-xl">
                    J
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">James Rodriguez</div>
                    <div className="text-sm text-slate-400">MIT • Engineering</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed text-lg">
                  "Having an AI tutor available 24/7 is a game-changer. I can work through problems at 2 AM during finals week and get instant, detailed help. Absolutely essential for engineering students."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-slate-800/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div className="text-sm">© 2025 Waybot. Empowering STEM students worldwide.</div>
          <div className="flex items-center gap-8 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Powered by AI
            </span>
            <span>•</span>
            <span>Free Forever</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;