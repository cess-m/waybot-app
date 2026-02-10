import React, { useState } from 'react';

const TermsModal = ({ isOpen, onAccept, onDecline, studentName }) => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false); // For "I DO NOT AGREE"

  const isDeclining = checked3;
  const canProceed = !isDeclining && checked1 && checked2;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start sm:items-center 
      p-4 sm:p-6 bg-slate-950/60 backdrop-blur-lg animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl 
        max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)]
        bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 
        rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/50 
        overflow-hidden animate-slideUp flex flex-col">


        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600"></div>

        {/* Header */}
        <div className="relative px-3 sm:px-6 md:px-8 pt-4 sm:pt-7 md:pt-8 pb-4 sm:pb-6 border-b border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">WAYBOT TERMS AND CONDITIONS</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">WayBot Learning Platform Agreement</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-violet-600/10 border border-violet-500/30 rounded-lg sm:rounded-xl backdrop-blur-sm">
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  <span className="font-semibold text-violet-400">Welcome, {studentName}!</span> Please carefully review and explicitly consent to the following terms before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content — RETAIN ORIGINAL DESIGN WITH NUMBERED SECTIONS & VERTICAL LINES */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 
          flex-1 overflow-y-auto custom-scrollbar">

          <div className="space-y-5 sm:space-y-6 md:space-y-7 text-slate-300">

            {/* Section 1: Acceptance of Terms */}
            <div className="relative pl-4 sm:pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[7px] sm:-left-[9px] top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-1.5 sm:gap-2">
                1. Acceptance of Terms
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-2">
                By accessing or using the WayBot platform, you acknowledge that you have read, understood, and voluntarily agreed to be bound by these Terms and Conditions. If you do not agree with any provision stated herein, you must discontinue the use of the service.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                These Terms constitute a legally binding agreement between you (the Student User) and the WayBot Development Team, in partnership with the University of the Philippines Cebu. Your continued use of the platform signifies your ongoing acceptance of these Terms and any future updates or amendments that may be implemented.
              </p>
            </div>

            {/* Section 2: Educational Purpose & Limitations */}
            <div className="relative pl-4 sm:pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[7px] sm:-left-[9px] top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                2. Educational Purpose and Limitations
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-2">
                WayBot is an AI-driven educational tool designed to assist students in learning foundational Calculus concepts through guided explanations, step-by-step solutions, and interactive problem-solving support.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-2">
                <span className="font-semibold text-slate-300">Please note the following:</span>
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-2">
                <span className="font-semibold text-slate-300">Supplemental Resource Only.</span> WayBot is intended to complement—not replace—formal classroom instruction, textbooks, teacher-led lectures, or official academic materials.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-2">
                <span className="font-semibold text-slate-300">No Guarantee of Accuracy.</span> While efforts are made to ensure the accuracy of AI-generated responses, the system may occasionally provide incorrect, incomplete, or outdated information.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">Student Responsibility.</span> You remain responsible for verifying critical concepts, solutions, and interpretations with your instructors or official course references before submitting academic work.
              </p>
            </div>

            {/* Section 3: Data Collection, Privacy & Teacher Dashboard Visibility */}
            <div className="relative pl-4 sm:pl-6 border-l-2 border-amber-500/40 bg-amber-500/5 rounded-r-lg sm:rounded-r-xl py-3 sm:py-4 pr-3 sm:pr-4 -ml-6 sm:-ml-8 pl-10 sm:pl-14">
              <div className="absolute left-[-1px] top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-500 border-2 border-slate-900"></div>
              <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <h4 className="text-amber-300 font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                    3. Data Collection, Privacy & Teacher Dashboard Visibility
                  </h4>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                  <span className="text-amber-400 font-bold">Please read carefully:</span> This section describes how your information and interactions are collected, stored, and used within the WayBot system.
                </p>

                <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border border-slate-700/50">
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300 mb-2">
                    <span className="font-semibold text-white">Information We Collect:</span>
                  </p>
                  <ul className="text-xs sm:text-sm text-slate-400 space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-violet-400 mt-0.5">•</span>
                      <span>Your name or student ID as provided during login</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-violet-400 mt-0.5">•</span>
                      <span>All questions and queries you submit to the WayBot chatbot</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-violet-400 mt-0.5">•</span>
                      <span>AI-generated responses and explanations provided to you</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-violet-400 mt-0.5">•</span>
                      <span>Timestamps of your interactions with the system</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-violet-400 mt-0.5">•</span>
                      <span>Your feedback indicators ("understood" or "still confused")</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-violet-400 mt-0.5">•</span>
                      <span>Topic classifications and difficulty patterns in your queries</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-900/20 rounded-lg p-3 sm:p-4 border border-amber-500/30">
                  <p className="text-xs sm:text-sm leading-relaxed text-amber-200 font-semibold mb-2">
                    ⚠️ Teacher Dashboard Visibility:
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300 mb-2">
                    <span className="font-semibold">All conversations, queries, and interactions you have with WayBot will be logged and made visible to your teachers through a dedicated Teacher Dashboard.</span> This means your instructors can access and review:
                  </p>
                  <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-amber-400 mt-0.5">→</span>
                      <span>Complete conversation histories between you and the AI</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-amber-400 mt-0.5">→</span>
                      <span>Specific questions you asked and the explanations provided</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-amber-400 mt-0.5">→</span>
                      <span>Topics you're struggling with based on your "still confused" feedback</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-amber-400 mt-0.5">→</span>
                      <span>Frequency and timing of your platform usage</span>
                    </li>
                    <li className="flex gap-1.5 sm:gap-2">
                      <span className="text-amber-400 mt-0.5">→</span>
                      <span>Analytics and summary reports of student learning patterns</span>
                    </li>
                  </ul>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                  <span className="font-semibold text-slate-300">Purpose of Data Collection:</span> This information is collected to help teachers better understand common student difficulties, identify knowledge gaps, and improve instructional strategies. It allows educators to provide more targeted support and personalized assistance based on actual student needs.
                </p>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                  <span className="font-semibold text-slate-300">Data Security & Privacy:</span> Your data is stored securely in our database and is only accessible to authorized teachers and system administrators. We do not share your personal information with external third parties. All data is handled in compliance with applicable privacy regulations and institutional policies.
                </p>
              </div>
            </div>

            {/* Section 4: Appropriate & Responsible Use */}
            <div className="relative pl-4 sm:pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[7px] sm:-left-[9px] top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                4. Appropriate & Responsible Use
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-2">
                You agree to use WayBot solely for its intended educational purpose—learning and understanding Calculus concepts. By accepting these terms, you commit to:
              </p>
              <ul className="text-xs sm:text-sm text-slate-400 space-y-1.5 sm:space-y-2 ml-3 sm:ml-4 mb-2">
                <li className="flex gap-1.5 sm:gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>Using the platform in good faith to enhance your learning</span>
                </li>
                <li className="flex gap-1.5 sm:gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>Refraining from attempting to manipulate, exploit, or misuse the AI system</span>
                </li>
                <li className="flex gap-1.5 sm:gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>Not using WayBot to complete assessments or exams where such assistance is prohibited</span>
                </li>
                <li className="flex gap-1.5 sm:gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>Avoiding any conduct that could harm the system's functionality or other users' experience</span>
                </li>
              </ul>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                Misuse of the platform, including attempts to circumvent security measures or engage in prohibited activities, may result in immediate suspension or termination of your access. Serious violations may be reported to academic authorities.
              </p>
            </div>

            {/* Section 5: Intellectual Property & Academic Integrity */}
            <div className="relative pl-4 sm:pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[7px] sm:-left-[9px] top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                5. Intellectual Property & Academic Integrity
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-2">
                All content generated by WayBot, including explanations, step-by-step solutions, and educational materials, remains the intellectual property of the WayBot development team and the University of the Philippines Cebu.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                You are expected to maintain academic integrity when using this platform. While WayBot provides guidance and explanations, you must understand the material and complete your own academic work. Using WayBot-generated content without proper understanding or attribution in submitted assignments may constitute academic dishonesty under your institution's policies.
              </p>
            </div>

            {/* Section 6: System Availability & Technical Limitations */}
            <div className="relative pl-4 sm:pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[7px] sm:-left-[9px] top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                6. System Availability & Technical Limitations
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-2">
                While we strive to maintain consistent system availability, WayBot is provided on an "as-is" basis. We do not guarantee uninterrupted access or error-free operation. The platform may experience:
              </p>
              <ul className="text-xs sm:text-sm text-slate-400 space-y-1 ml-3 sm:ml-4 mb-2">
                <li className="flex gap-1.5 sm:gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>Scheduled or emergency maintenance periods</span>
                </li>
                <li className="flex gap-1.5 sm:gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>Technical issues or server downtime</span>
                </li>
                <li className="flex gap-1.5 sm:gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>Response delays during high-traffic periods</span>
                </li>
                <li className="flex gap-1.5 sm:gap-2">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>Temporary feature limitations or modifications</span>
                </li>
              </ul>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                We are not liable for any disruption to your learning activities caused by system unavailability or technical issues. Always have backup study resources available.
              </p>
            </div>

            {/* Section 7: Modifications to Terms */}
            <div className="relative pl-4 sm:pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[7px] sm:-left-[9px] top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-2 sm:mb-3 text-base sm:text-lg">
                7. Modifications to Terms
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                The WayBot development team reserves the right to modify, update, or replace these Terms and Conditions at any time without prior notice. Changes will become effective immediately upon posting to the platform. Your continued use of WayBot after any modifications constitutes your acceptance of the updated terms. We encourage you to review these terms periodically to stay informed of any changes.
              </p>
            </div>

          </div>
        </div>

        {/* Consent Checkboxes — PREMIUM DESIGN, MATCHES YOUR ORIGINAL STYLE */}
        <div className="px-3 sm:px-6 md:px-8 py-3 bg-slate-900/50 border-t border-slate-700/30">
          <div className="space-y-3">

            {/* Checkbox 1: I AGREE TO TERMS */}
            <label className={`flex items-start gap-3 text-sm sm:text-base ${isDeclining ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-opacity`}>
              <input
                type="checkbox"
                checked={checked1}
                onChange={(e) => {
                  if (!isDeclining) setChecked1(e.target.checked);
                }}
                disabled={isDeclining}
                className="mt-1 w-4 h-4 text-violet-600 rounded focus:ring-violet-500 border border-slate-600 bg-slate-800 checked:bg-violet-600 checked:border-transparent"
              />
              <span className="text-slate-300">
                I AGREE TO THE TERMS AND CONDITIONS (Proceed to WayBot platform)
              </span>
            </label>

            {/* Checkbox 2: I UNDERSTAND AND CONSENT TO DATA PROCESSING */}
            <label className={`flex items-start gap-3 text-sm sm:text-base ${isDeclining ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-opacity`}>
              <input
                type="checkbox"
                checked={checked2}
                onChange={(e) => {
                  if (!isDeclining) setChecked2(e.target.checked);
                }}
                disabled={isDeclining}
                className="mt-1 w-4 h-4 text-violet-600 rounded focus:ring-violet-500 border border-slate-600 bg-slate-800 checked:bg-violet-600 checked:border-transparent"
              />
              <span className="text-slate-300">
                I UNDERSTAND AND CONSENT TO THE PROCESSING OF MY DATA (Required under RA 10173)
              </span>
            </label>

            {/* Checkbox 3: I DO NOT AGREE */}
            <label className="flex items-start gap-3 text-sm sm:text-base cursor-pointer">
              <input
                type="checkbox"
                checked={checked3}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setChecked3(isChecked);
                  if (isChecked) {
                    setChecked1(false);
                    setChecked2(false);
                  }
                }}
                className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500 border border-slate-600 bg-slate-800 checked:bg-red-600 checked:border-transparent"
              />
              <span className="text-slate-300">
                I DO NOT AGREE (Exit WayBot — you will not be able to use the service)
              </span>
            </label>

          </div>
        </div>

        {/* Footer Actions — NEW BUTTONS WITH VISUAL FEEDBACK */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-t border-slate-700/50 bg-gradient-to-t from-slate-800/50 to-transparent">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
            <button
              onClick={() => {
                if (checked3) {
                  onDecline();
                } else {
                  setChecked3(true);
                  setChecked1(false);
                  setChecked2(false);
                }
              }}
              className={`px-3 py-2 sm:px-6 sm:py-4 rounded-xl font-semibold transition-all active:scale-95 w-full sm:flex-1
                ${checked3 
                  ? 'bg-red-600/30 border border-red-500/50 text-red-300 shadow-lg shadow-red-500/20 animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
            >
              Exit
            </button>
            <button
              onClick={() =>
                onAccept({
                  termsAccepted: checked1,
                  dataConsent: checked2,
                })
              }
              disabled={!canProceed}
              className="px-3 py-2 sm:px-6 sm:py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-violet-500/30
                hover:shadow-violet-500/50 hover:scale-[1.02] transition-all active:scale-95 w-full sm:flex-1
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-violet-500/30 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700"
            >
              Continue
            </button>
          </div>
          <p className="text-center text-[10px] sm:text-xs text-slate-500 leading-relaxed px-1">
            {checked3 
              ? "You selected to exit. Click 'Exit' to confirm." 
              : "Both checkboxes must be selected to proceed."
            }
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-slideUp {
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgb(15 23 42 / 0.4);
            border-radius: 4px;
            margin: 6px 0;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgb(124 58 237 / 0.6), rgb(99 102 241 / 0.6));
            border-radius: 4px;
            border: 2px solid rgb(15 23 42 / 0.4);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgb(124 58 237 / 0.8), rgb(99 102 241 / 0.8));
          }
        `}</style>
      </div>
    </div>
  );
};

export default TermsModal;