import React, { useState, useEffect } from "react";
import TermsModal from "../components/TermsModal";
import AnimatedBackground from "../components/AnimatedBackground";

const API_URL = import.meta.env.VITE_API_URL;

const StudentLoginPage = ({
  setView,
  studentName,
  setStudentName,
  studentSection,
  setStudentSection,
  isLoading,
  setIsLoading,
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [sections, setSections] = useState([]);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sections`);
      const data = await res.json();
      setSections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load sections", err);
      setSections([]);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleContinueClick = async () => {
    if (!studentName.trim() || !studentSection.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: studentName.trim(),
          section: studentSection.trim(),
        }),
      });

      const data = await res.json();

      if (data.needsConsent) {
        setShowTerms(true);
        return;
      }

      setView("topic-select");
    } catch (e) {
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTerms = async ({ termsAccepted, dataConsent }) => {
    setIsLoading(true);

    try {
      const uname = studentName.trim();

      await fetch(
        `${API_URL}/api/users/${encodeURIComponent(uname)}/consent`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ termsAccepted, dataConsent }),
        }
      );

      setShowTerms(false);

      // 🔁 LOGIN AGAIN so backend sees termsAccepted = true
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: studentName.trim(),
          section: studentSection.trim(),
        }),
      });

      const data = await res.json();

      if (data.needsConsent) {
        alert("Consent not saved. Backend issue.");
        setShowTerms(true);
        return;
      }

      setView("topic-select");
    } catch (e) {
      alert("Consent failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineTerms = () => setShowTerms(false);

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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">
              Welcome!
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Enter your name and section to start learning
            </p>
          </div>

          {/* Form Card */}
          <div className="relative">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl opacity-10 blur-sm"></div>
            
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-2xl">
              {/* Name Input */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                  Name or Student ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your name or student ID"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    studentName.trim() &&
                    studentSection.trim() &&
                    handleContinueClick()
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm"
                  autoFocus
                />
              </div>

              {/* Section Dropdown */}
              <div className="mb-4 sm:mb-5">
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                  Section
                </label>
                <div className="relative">
                  <select
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    onFocus={fetchSections}
                    onMouseDown={fetchSections}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all cursor-pointer text-sm pr-10"
                  >
                    <option value="" disabled>
                      Select your section
                    </option>

                    {sections
                      .filter((sec) => sec?.name)
                      .map((sec) => (
                        <option key={sec._id || sec.name} value={sec.name}>
                          {sec.name}
                        </option>
                      ))}
                  </select>
                  
                  {/* Custom dropdown icon */}
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
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinueClick}
                disabled={!studentName.trim() || !studentSection.trim() || isLoading}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-violet-500/20 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? "Loading..." : "Continue to Topics"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>

              {/* Helper text */}
              <p className="text-xs text-slate-500 text-center mt-3">
                New here? Just enter your details to get started
              </p>
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
            <span className="text-xs">Your data is secure and private</span>
          </div>
        </div>
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