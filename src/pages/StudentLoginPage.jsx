import React, { useState } from "react";
import TermsModal from "../components/TermsModal";
import AnimatedBackground from "../components/AnimatedBackground";

const StudentLoginPage = ({ 
  setView,
  studentName,
  setStudentName,
  studentSection,
  setStudentSection,
  isLoading,
  setIsLoading
}) => {

  const [showTerms, setShowTerms] = useState(false);

  const handleContinueClick = () => {
    if (studentName.trim() && studentSection.trim()) {
      setShowTerms(true);
    }
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setView("topic-select");   
    }, 1000);
  };

  const handleDeclineTerms = () => {
    setShowTerms(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <AnimatedBackground />

      <div className="w-full max-w-sm">
        <button 
          onClick={() => setView("home")} 
          className="group p-2 -ml-2 mb-6 rounded-lg hover:bg-slate-800 transition text-sm text-slate-500 hover:text-white"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors"
          >
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
          onKeyDown={(e) => 
            e.key === "Enter" && studentName.trim() && studentSection.trim() && handleContinueClick()
          }
          className="w-full px-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white mb-4"
          autoFocus
        />

        <input
          type="text"
          placeholder="Your section (ex: Block E)"
          value={studentSection}
          onChange={(e) => setStudentSection(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            studentName.trim() &&
            studentSection.trim() &&
            handleContinueClick()
          }
          className="w-full px-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white mb-4"
        />

        <button
          onClick={handleContinueClick}
          disabled={!studentName.trim() || !studentSection.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 
          text-white font-semibold shadow-xl shadow-violet-500/25 transition-all 
          hover:scale-105 hover:shadow-violet-500/40 hover:brightness-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >

          {isLoading ? "Loading..." : "Continue"}
        </button>
      </div>

      {showTerms && (
        <TermsModal
          isOpen={showTerms}
          onAccept={handleAcceptTerms}
          onDecline={handleDeclineTerms}
          studentName={studentName}
        />
      )}
    </div>
  );
};

export default StudentLoginPage;
