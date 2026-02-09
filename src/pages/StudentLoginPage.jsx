import React, { useState, useEffect } from "react";
import TermsModal from "../components/TermsModal";
import AnimatedBackground from "../components/AnimatedBackground";

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
      const res = await fetch("http://localhost:5000/api/sections");
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
    const res = await fetch("http://localhost:5000/api/login", {
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
        `http://localhost:5000/api/users/${encodeURIComponent(uname)}/consent`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ termsAccepted, dataConsent }),
        }
      );

      setShowTerms(false);

      // 🔁 LOGIN AGAIN so backend sees termsAccepted = true
      const res = await fetch("http://localhost:5000/api/login", {
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
        <p className="text-slate-400 mb-8">
          Enter your name and section to start learning
        </p>

        <input
          type="text"
          placeholder="Your name or student ID"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            studentName.trim() &&
            studentSection.trim() &&
            handleContinueClick()
          }
          className="w-full px-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white mb-4"
          autoFocus
        />

        <select
          value={studentSection}
          onChange={(e) => setStudentSection(e.target.value)}
          onFocus={fetchSections}
          onMouseDown={fetchSections}
          className="w-full px-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white mb-4"
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

        <button
          onClick={handleContinueClick}
          disabled={!studentName.trim() || !studentSection.trim() || isLoading}
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
