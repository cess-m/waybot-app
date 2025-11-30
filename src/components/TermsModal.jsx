import React, { useState } from 'react';

const TermsModal = ({ isOpen, onAccept, onDecline, studentName }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
    if (bottom) setHasScrolled(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 
      bg-slate-950/60 backdrop-blur-lg 
      animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden animate-slideUp">
        
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600"></div>
        
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Terms & Conditions</h3>
                  <p className="text-slate-400 text-sm mt-1">WayBot Learning Platform Agreement</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-violet-600/10 border border-violet-500/30 rounded-xl backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-slate-300">
                  <span className="font-semibold text-violet-400">Welcome, {studentName}!</span> Before you begin your learning journey with WayBot, please carefully review and accept the following terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div onScroll={handleScroll} className="px-8 py-6 max-h-[28rem] overflow-y-auto custom-scrollbar">
          <div className="space-y-7 text-slate-300">

            {/* Section 1 */}
            <div className="relative pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-3 text-lg flex items-center gap-2">
                1. Acceptance of Terms
              </h4>
              <p className="text-sm leading-relaxed text-slate-400 mb-2">
                By accessing and using the WayBot platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use this service.
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                This agreement constitutes a legally binding contract between you (the student user) and the WayBot development team. Your continued use of the platform signifies your ongoing acceptance of these terms and any future modifications.
              </p>
            </div>

            {/* Section 2 */}
            <div className="relative pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-3 text-lg">
                2. Educational Purpose & Limitations
              </h4>
              <p className="text-sm leading-relaxed text-slate-400 mb-2">
                WayBot is designed as an AI-powered educational tool specifically created to assist students with foundational Calculus concepts through step-by-step problem-solving guidance. The platform provides instructional support and explanations to enhance your learning experience.
              </p>
              <p className="text-sm leading-relaxed text-slate-400 mb-2">
                <span className="font-semibold text-slate-300">Important:</span> WayBot is a supplementary learning resource and should not be considered a replacement for traditional classroom instruction, textbooks, or guidance from your instructors. While we strive for accuracy, the AI-generated responses may occasionally contain errors, incomplete information, or outdated content.
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                You are responsible for verifying important information with official academic sources, course materials, and your instructors. Always cross-reference critical concepts and solutions before submitting academic work.
              </p>
            </div>

            {/* Section 3 - IMPORTANT DATA COLLECTION */}
            <div className="relative pl-6 border-l-2 border-amber-500/40 bg-amber-500/5 rounded-r-xl py-4 pr-4 -ml-8 pl-14">
              <div className="absolute left-[-1px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900"></div>
              <div className="flex items-start gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <div>
                  <h4 className="text-amber-300 font-bold mb-3 text-lg">
                    3. Data Collection, Privacy & Teacher Dashboard Visibility
                  </h4>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-slate-300 font-medium">
                  <span className="text-amber-400 font-bold">Please read carefully:</span> This section describes how your information and interactions are collected, stored, and used within the WayBot system.
                </p>
                
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-sm leading-relaxed text-slate-300 mb-2">
                    <span className="font-semibold text-white">Information We Collect:</span>
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>Your name or student ID as provided during login</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>All questions and queries you submit to the WayBot chatbot</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>AI-generated responses and explanations provided to you</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>Timestamps of your interactions with the system</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>Your feedback indicators ("understood" or "still confused")</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>Topic classifications and difficulty patterns in your queries</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <p className="text-sm leading-relaxed text-amber-200 font-semibold mb-2">
                    ⚠️ Teacher Dashboard Visibility:
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300 mb-2">
                    <span className="font-semibold">All conversations, queries, and interactions you have with WayBot will be logged and made visible to your teachers through a dedicated Teacher Dashboard.</span> This means your instructors can access and review:
                  </p>
                  <ul className="text-sm text-slate-300 space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-amber-400 mt-1">→</span>
                      <span>Complete conversation histories between you and the AI</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-400 mt-1">→</span>
                      <span>Specific questions you asked and the explanations provided</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-400 mt-1">→</span>
                      <span>Topics you're struggling with based on your "still confused" feedback</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-400 mt-1">→</span>
                      <span>Frequency and timing of your platform usage</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-400 mt-1">→</span>
                      <span>Analytics and summary reports of student learning patterns</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">
                  <span className="font-semibold text-slate-300">Purpose of Data Collection:</span> This information is collected to help teachers better understand common student difficulties, identify knowledge gaps, and improve instructional strategies. It allows educators to provide more targeted support and personalized assistance based on actual student needs.
                </p>

                <p className="text-sm leading-relaxed text-slate-400">
                  <span className="font-semibold text-slate-300">Data Security & Privacy:</span> Your data is stored securely in our database and is only accessible to authorized teachers and system administrators. We do not share your personal information with external third parties. All data is handled in compliance with applicable privacy regulations and institutional policies.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="relative pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-3 text-lg">
                4. Appropriate & Responsible Use
              </h4>
              <p className="text-sm leading-relaxed text-slate-400 mb-2">
                You agree to use WayBot solely for its intended educational purpose—learning and understanding Calculus concepts. By accepting these terms, you commit to:
              </p>
              <ul className="text-sm text-slate-400 space-y-2 ml-4 mb-2">
                <li className="flex gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Using the platform in good faith to enhance your learning</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Refraining from attempting to manipulate, exploit, or misuse the AI system</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Not using WayBot to complete assessments or exams where such assistance is prohibited</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Avoiding any conduct that could harm the system's functionality or other users' experience</span>
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-slate-400">
                Misuse of the platform, including attempts to circumvent security measures or engage in prohibited activities, may result in immediate suspension or termination of your access. Serious violations may be reported to academic authorities.
              </p>
            </div>

            {/* Section 5 */}
            <div className="relative pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-3 text-lg">
                5. Intellectual Property & Academic Integrity
              </h4>
              <p className="text-sm leading-relaxed text-slate-400 mb-2">
                All content generated by WayBot, including explanations, step-by-step solutions, and educational materials, remains the intellectual property of the WayBot development team and the University of the Philippines Cebu.
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                You are expected to maintain academic integrity when using this platform. While WayBot provides guidance and explanations, you must understand the material and complete your own academic work. Using WayBot-generated content without proper understanding or attribution in submitted assignments may constitute academic dishonesty under your institution's policies.
              </p>
            </div>

            {/* Section 6 */}
            <div className="relative pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-3 text-lg">
                6. System Availability & Technical Limitations
              </h4>
              <p className="text-sm leading-relaxed text-slate-400 mb-2">
                While we strive to maintain consistent system availability, WayBot is provided on an "as-is" basis. We do not guarantee uninterrupted access or error-free operation. The platform may experience:
              </p>
              <ul className="text-sm text-slate-400 space-y-1 ml-4 mb-2">
                <li className="flex gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Scheduled or emergency maintenance periods</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Technical issues or server downtime</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Response delays during high-traffic periods</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Temporary feature limitations or modifications</span>
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-slate-400">
                We are not liable for any disruption to your learning activities caused by system unavailability or technical issues. Always have backup study resources available.
              </p>
            </div>

            {/* Section 7 */}
            <div className="relative pl-6 border-l-2 border-violet-500/30">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-violet-600 border-2 border-slate-900"></div>
              <h4 className="text-white font-bold mb-3 text-lg">
                7. Modifications to Terms
              </h4>
              <p className="text-sm leading-relaxed text-slate-400">
                The WayBot development team reserves the right to modify, update, or replace these Terms and Conditions at any time without prior notice. Changes will become effective immediately upon posting to the platform. Your continued use of WayBot after any modifications constitutes your acceptance of the updated terms. We encourage you to review these terms periodically to stay informed of any changes.
              </p>
            </div>

            {/* Scroll Indicator */}
            {!hasScrolled && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 animate-bounce pt-4 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                <span className="font-medium">Scroll down to read all terms</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-700/50 bg-gradient-to-t from-slate-800/50 to-transparent">
          <div className="flex gap-4 mb-4">
            <button
              onClick={onDecline}
              className="flex-1 px-6 py-4 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-all active:scale-95 border border-slate-700"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!hasScrolled}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-violet-500/30
                hover:shadow-violet-500/50 hover:scale-[1.02] transition-all active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-violet-500/30 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700"
            >
              <span className="flex items-center justify-center gap-2">
                {hasScrolled ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Accept & Continue
                  </>
                ) : (
                  'Please Read All Terms'
                )}
              </span>
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 leading-relaxed">
            By clicking "Accept & Continue", you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, including the visibility of your conversations to teachers.
          </p>
        </div>
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
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(15 23 42 / 0.4);
          border-radius: 5px;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgb(124 58 237 / 0.6), rgb(99 102 241 / 0.6));
          border-radius: 5px;
          border: 2px solid rgb(15 23 42 / 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgb(124 58 237 / 0.8), rgb(99 102 241 / 0.8));
        }
      `}</style>
    </div>
  );
};

export default TermsModal;