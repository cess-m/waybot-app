import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground'; 
import { TOPICS } from '../config/waybotConfig'; // Must import constants

const TopicSelectPage = ({ setView, studentName, handleSelectTopic, hasHistory }) => {
  // Professional icon mapping for each topic
  const getTopicIcon = (topicId) => {
    const icons = {
      limits: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      differentiation: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      integration: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      )
    };
    return icons[topicId] || icons.limits;
  };

  // Color schemes for each topic
  const getTopicColors = (topicId) => {
    const colors = {
      limits: {
        gradient: "from-cyan-500/20 to-blue-500/20",
        icon: "text-cyan-400",
        border: "border-cyan-500/30",
        hoverBorder: "group-hover:border-cyan-500/50",
        glow: "group-hover:shadow-cyan-500/20"
      },
      differentiation: {
        gradient: "from-purple-500/20 to-pink-500/20",
        icon: "text-purple-400",
        border: "border-purple-500/30",
        hoverBorder: "group-hover:border-purple-500/50",
        glow: "group-hover:shadow-purple-500/20"
      },
      integration: {
        gradient: "from-emerald-500/20 to-teal-500/20",
        icon: "text-emerald-400",
        border: "border-emerald-500/30",
        hoverBorder: "group-hover:border-emerald-500/50",
        glow: "group-hover:shadow-emerald-500/20"
      }
    };
    return colors[topicId] || colors.limits;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />

      {/* Container with top-center alignment */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 px-4 sm:px-6 pb-8">
        {/* Back Button */}
        <div className="w-full max-w-2xl lg:max-w-xl mb-6 sm:mb-8">
          <button
            onClick={() => setView("student-login")}
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
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-2xl lg:max-w-xl">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10">
            {/* Greeting Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 backdrop-blur-xl mb-5">
              <span className="text-lg">👋</span>
              <span className="text-violet-300 text-sm font-medium">Welcome back!</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3">
              Hi <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">{studentName}</span>!
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              What would you like to learn today?
            </p>
          </div>

          {/* Topics List */}
          <div className="space-y-2.5 sm:space-y-3">
            {TOPICS.map((topic, index) => {
              const colors = getTopicColors(topic.id);
              
              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic.id)}
                  className={`group w-full text-left rounded-xl sm:rounded-2xl bg-slate-900/60 backdrop-blur-xl border ${colors.border} ${colors.hoverBorder} hover:bg-slate-900/80 transition-all duration-300 p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-lg hover:shadow-xl ${colors.glow} hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {/* Topic Icon */}
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${colors.gradient} border ${colors.border} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <div className={colors.icon}>
                      {getTopicIcon(topic.id)}
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity`}></div>
                  </div>

                  {/* Topic Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-white text-sm sm:text-base md:text-lg group-hover:text-violet-300 transition-colors">
                        {topic.name}
                      </h3>
                      
                      {/* Continue Badge */}
                      {hasHistory(topic.id) && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Continue
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-violet-400 transition-all group-hover:translate-x-1"
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
                  </div>
                </button>
              );
            })}
          </div>

          {/* Helper Text */}
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Select a topic to start your learning journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelectPage;