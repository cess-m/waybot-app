import React, { useEffect, useState, useMemo } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import QuestionCard from '../components/QuestionCard';
import { TOPICS } from '../config/waybotConfig';
import MathRenderer from "../components/MathRenderer";

const SectionDashboardPage = ({
  sectionName,
  setDashboardMode,
  setActiveSection,
  analytics,
  conceptStats,
  selectedStudentDetail,
  setSelectedStudentDetail,
  selectedStudentLogs,
  recentFilter,
  setRecentFilter,
  groupingMode,
  setGroupingMode,
  filteredRecent,
  groupedQuestions,
  logs,
}) => {
  const [expandedTopics, setExpandedTopics] = useState({});

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sections");
        const data = await res.json();
        setSections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch sections failed:", err);
        setSections([]);
      }
    };

    fetchSections();
  }, []);


  const handleAddSection = async () => {
  const name = newSectionName.trim();
  if (!name) return;

  setSavingSection(true);
  setSectionError("");

  try {
    const res = await fetch("http://localhost:5000/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSectionError(data?.error || "Failed to create section");
      return;
    }

    setSections((prev) => [...prev, data]); // ✅ updates UI immediately
    setNewSectionName("");
  } catch (err) {
    console.error("Create section failed:", err);
    setSectionError("Server error while creating section");
  } finally {
    setSavingSection(false);
  }
};


  // Filter analytics by this specific section
  const sectionAnalytics = useMemo(() => {
    if (!analytics) {
      return {
        byStudent: [],
        byTopic: [],
        totalQuestions: 0,
        confusionRate: 0,
        activeStudents: 0,
        topicsCovered: 0,
      };
    }

    const filteredByStudent = (analytics.byStudent || []).filter(
      (s) => (s.section || 'No Section') === sectionName
    );

    const totalQuestions = filteredByStudent.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalConfused = filteredByStudent.reduce((sum, s) => sum + (s.confused || 0), 0);
    const confusionRate = totalQuestions > 0 ? Math.round((totalConfused / totalQuestions) * 100) : 0;

    // Filter topics for this section
    const sectionLogs = (logs || []).filter(log => {
      const student = filteredByStudent.find(s => s.student === log.student);
      return !!student;
    });

    const topicMap = {};
    sectionLogs.forEach(log => {
      if (!topicMap[log.topicId]) {
        topicMap[log.topicId] = {
          topicId: log.topicId,
          topicName: TOPICS.find(t => t.id === log.topicId)?.name || log.topicId,
          total: 0,
          confused: 0,
        };
      }
      topicMap[log.topicId].total++;
      if (log.confused === true) topicMap[log.topicId].confused++;
    });

    const byTopic = Object.values(topicMap);

    return {
      ...analytics,
      byStudent: filteredByStudent,
      byTopic,
      activeStudents: filteredByStudent.length,
      totalQuestions,
      confusionRate,
      topicsCovered: byTopic.length,
    };
  }, [analytics, sectionName, logs]);

  const toggleTopicExpand = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const getTopicName = (topicId) => TOPICS.find((t) => t.id === topicId)?.name || topicId;

  const getPerformanceColor = (confusionRate) => {
    if (confusionRate >= 50) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (confusionRate >= 30) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  const getPerformanceLabel = (confusionRate) => {
    if (confusionRate >= 50) return 'Needs Attention';
    if (confusionRate >= 30) return 'Moderate';
    return 'Good';
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 relative">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with back button */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full">
              <button
                onClick={() => {
                  setDashboardMode("sections");
                  setActiveSection(null);
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 sm:mb-4 transition group text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to My Sections
              </button>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-2 sm:gap-3 break-words">
                <span className="text-3xl sm:text-4xl flex-shrink-0">📚</span>
                <span className="break-all">{sectionName}</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">Section Analytics &amp; Student Performance</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="group bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:shadow-violet-500/10 transition-all">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-violet-500/20 border border-violet-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1 sm:mb-2">
              Total Questions
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{sectionAnalytics.totalQuestions || 0}</p>
            <p className="text-slate-500 text-[10px] sm:text-xs mt-1 sm:mt-2">In this section</p>
          </div>

          <div className="group bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:shadow-amber-500/10 transition-all">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-amber-500/20 border border-amber-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <span
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border ${getPerformanceColor(
                  sectionAnalytics.confusionRate || 0
                )}`}
              >
                {getPerformanceLabel(sectionAnalytics.confusionRate || 0)}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1 sm:mb-2">
              Confusion Rate
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-amber-400">
              {sectionAnalytics.confusionRate || 0}%
            </p>
            <p className="text-slate-500 text-[10px] sm:text-xs mt-1 sm:mt-2">Students needing help</p>
          </div>

          <div className="group bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1 sm:mb-2">
              Active Students
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{sectionAnalytics.activeStudents || 0}</p>
            <p className="text-slate-500 text-[10px] sm:text-xs mt-1 sm:mt-2">In this section</p>
          </div>

          <div className="group bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500/20 border border-blue-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1 sm:mb-2">
              Topics Covered
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-white">{sectionAnalytics.topicsCovered || 0}</p>
            <p className="text-slate-500 text-[10px] sm:text-xs mt-1 sm:mt-2">Calculus concepts</p>
          </div>
        </div>

        {/* Topics + Student Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Topics Breakdown */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                </div>
                <h2 className="text-white font-bold text-base sm:text-lg">Questions by Topic</h2>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                {(sectionAnalytics.byTopic || []).length} topics
              </span>
            </div>

            {!sectionAnalytics.byTopic || sectionAnalytics.byTopic.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-slate-700/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm">No questions data yet</p>
                <p className="text-slate-600 text-[10px] sm:text-xs mt-1">Data will appear as students interact</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                {sectionAnalytics.byTopic.map((t) => {
                  const pct = sectionAnalytics.totalQuestions
                    ? Math.round((t.total / sectionAnalytics.totalQuestions) * 100)
                    : 0;
                  const confPct = t.total ? Math.round((t.confused / t.total) * 100) : 0;
                  const topic = TOPICS.find((tp) => tp.id === t.topicId);
                  const isExpanded = !!expandedTopics[t.topicId];
                  const topicConcepts = (conceptStats || []).filter(
                    (c) => c.topicId === t.topicId
                  );

                  return (
                    <div
                      key={t.topicId}
                      className="bg-slate-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-700/40 hover:border-slate-600/60 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="text-xl sm:text-2xl flex-shrink-0">{topic?.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                              <span className="text-white font-semibold text-sm sm:text-base break-words">
                                {t.topicName || getTopicName(t.topicId)}
                              </span>
                              {topicConcepts.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => toggleTopicExpand(t.topicId)}
                                  className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition whitespace-nowrap"
                                >
                                  {topicConcepts.length} concepts
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className={`w-2 h-2 sm:w-3 sm:h-3 inline ml-1 transition-transform ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs flex-wrap">
                              <span className="text-slate-400">{t.total} questions</span>
                              <span
                                className={`font-semibold ${
                                  confPct > 40
                                    ? 'text-red-400'
                                    : confPct > 25
                                    ? 'text-amber-400'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {confPct}% confused
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border whitespace-nowrap flex-shrink-0 ${getPerformanceColor(
                            confPct
                          )}`}
                        >
                          {getPerformanceLabel(confPct)}
                        </span>
                      </div>

                      <div className="h-2 sm:h-2.5 rounded-full bg-slate-700/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            topic?.color || 'from-violet-500 to-purple-500'
                          } transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {isExpanded && topicConcepts.length > 0 && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700/40 space-y-1.5 sm:space-y-2">
                          {topicConcepts.map((c) => {
                            const confusedPct = c.total
                              ? Math.round((c.confused / c.total) * 100)
                              : 0;
                            return (
                              <div
                                key={c.concept}
                                className="flex justify-between items-center text-[10px] sm:text-xs bg-slate-800/50 rounded-lg p-2 sm:p-2.5 gap-2"
                              >
                                <span className="text-slate-300 font-medium break-words flex-1">{c.concept}</span>
                                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                  <span className="text-slate-500">{c.total} q&apos;s</span>
                                  <span
                                    className={`px-1.5 sm:px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${
                                      confusedPct > 40
                                        ? 'text-red-400 bg-red-500/10'
                                        : confusedPct > 25
                                        ? 'text-amber-400 bg-amber-500/10'
                                        : 'text-emerald-400 bg-emerald-500/10'
                                    }`}
                                  >
                                    {confusedPct}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Student Performance Table */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                </div>
                <h2 className="text-white font-bold text-base sm:text-lg">Student Performance</h2>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                {(sectionAnalytics.byStudent || []).length} students
              </span>
            </div>

            {!sectionAnalytics.byStudent || sectionAnalytics.byStudent.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-slate-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">No student data yet</p>
                <p className="text-slate-600 text-xs mt-1">Students will appear as they use WayBot</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-700/60">
                        <th className="text-left py-3 pr-3 font-semibold">Student</th>
                        <th className="text-center py-3 px-2 font-semibold">Questions</th>
                        <th className="text-center py-3 px-2 font-semibold">Status</th>
                        <th className="text-right py-3 pl-3 font-semibold">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sectionAnalytics.byStudent.map((s) => {
                        const isSelected = selectedStudentDetail === s.student;
                        const confRate =
                          s.total > 0 ? Math.round((s.confused / s.total) * 100) : 0;
                        const perfLabel = getPerformanceLabel(confRate);

                        return (
                          <tr
                            key={s.student}
                            onClick={() => setSelectedStudentDetail(s.student)}
                            className={`cursor-pointer hover:bg-slate-900/70 transition-all group ${
                              isSelected ? 'bg-slate-900/90 shadow-inner' : ''
                            }`}
                          >
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                                  {s.student?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <p className="text-slate-200 font-medium">{s.student}</p>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-700/50 text-slate-300 font-semibold">
                                {s.total}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-slate-300 text-xs font-medium">
                                  {confRate}% confused
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getPerformanceColor(
                                    confRate
                                  )}`}
                                >
                                  {perfLabel}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 pl-3 text-right text-slate-500 text-xs">
                              {s.lastActive ? (
                                <>
                                  {new Date(s.lastActive).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                  <br />
                                  <span className="text-slate-600">
                                    {new Date(s.lastActive).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </>
                              ) : (
                                <span className="text-slate-600">No activity</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Student Detail Panel */}
                {selectedStudentDetail && (
                  <div className="mt-6 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/70 p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {selectedStudentDetail.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">{selectedStudentDetail}</p>
                          <p className="text-slate-400 text-sm">
                            {selectedStudentLogs?.length || 0} total interactions
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStudentDetail(null)}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        Close
                      </button>
                    </div>

                    {!selectedStudentLogs || selectedStudentLogs.length === 0 ? (
                      <p className="text-slate-500 text-sm text-center py-8">
                        No detailed logs available
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                        {selectedStudentLogs.map((log) => {
                          const topic = TOPICS.find((t) => t.id === log.topicId);
                          const status =
                            log.confused === true
                              ? 'Confused'
                              : log.confused === false
                              ? 'Got it'
                              : 'Pending';
                          const statusColor =
                            log.confused === true
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                              : log.confused === false
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-700/40 text-slate-400 border-slate-600/40';

                          return (
                            <div
                              key={log.id}
                              className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 transition-all"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-xl">{topic?.icon}</span>
                                  <div className="flex-1">
                                    <span className="text-slate-300 font-semibold text-sm">
                                      {topic?.name || log.topicId}
                                    </span>
                                    {log.concept && (
                                      <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-medium">
                                        {log.concept}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border whitespace-nowrap ${statusColor}`}
                                >
                                  {status}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/40">
                                  <p className="text-slate-400 text-xs font-semibold mb-1">
                                    Question:
                                  </p>
                                  <div className="text-slate-200 text-sm">
                                    <MathRenderer text={log.question} />
                                  </div>
                                </div>

                                {log.explanation && (
                                  <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                                    <p className="text-slate-400 text-xs font-semibold mb-1">
                                      AI Response:
                                    </p>
                                    <div className="text-slate-300 text-xs leading-relaxed">
                                      <MathRenderer text={log.explanation} />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <p className="text-slate-600 mt-3 text-[10px] flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-3 h-3"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                                {log.timestamp
                                  ? new Date(log.timestamp).toLocaleString()
                                  : 'No timestamp'}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recent Questions Panel */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-base sm:text-lg">Recent Questions</h2>
                <p className="text-slate-500 text-[10px] sm:text-xs">From {sectionName}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Filter Tabs */}
              <div className="flex bg-slate-900/60 rounded-xl p-1 sm:p-1.5 border border-slate-700/50 shadow-inner overflow-x-auto">
                {['all', 'got-it', 'confused', 'pending'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setRecentFilter(f)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                      recentFilter === f
                        ? 'bg-slate-700 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f === 'got-it'
                      ? '✓ Got it'
                      : f === 'confused'
                      ? '⚠ Confused'
                      : f === 'pending'
                      ? '⏳ Pending'
                      : '📊 All'}
                  </button>
                ))}
              </div>

              {/* Grouping Tabs */}
              <div className="flex bg-slate-900/60 rounded-xl p-1 sm:p-1.5 border border-slate-700/50 shadow-inner overflow-x-auto">
                {['latest', 'student', 'concept'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setGroupingMode(m)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                      groupingMode === m
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m === 'latest'
                      ? '🕐 Latest'
                      : m === 'student'
                      ? '👤 By Student'
                      : '📚 By Concept'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Rendering */}
          {!filteredRecent || filteredRecent.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-slate-700/30 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <p className="text-slate-400 font-semibold mb-1 text-sm sm:text-base">No questions found</p>
              <p className="text-slate-600 text-xs sm:text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {groupingMode === 'latest' && Array.isArray(groupedQuestions) && (
                <div className="space-y-2 sm:space-y-3">
                  {groupedQuestions.map((r) => (
                    <QuestionCard key={r.id} r={r} />
                  ))}
                </div>
              )}

              {groupingMode !== 'latest' &&
                groupedQuestions &&
                !Array.isArray(groupedQuestions) &&
                Object.entries(groupedQuestions).map(([groupName, questions]) => (
                  <div
                    key={groupName}
                    className="border border-slate-700/50 rounded-xl overflow-hidden shadow-lg"
                  >
                    <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 px-4 sm:px-5 py-2.5 sm:py-3 border-b border-slate-700/50 flex justify-between items-center gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span className="text-lg sm:text-xl flex-shrink-0">
                          {groupingMode === 'student' ? '👤' : '📚'}
                        </span>
                        <span className="font-bold text-slate-200 text-sm sm:text-base truncate">{groupName}</span>
                      </div>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-[10px] sm:text-xs font-bold text-violet-300 whitespace-nowrap">
                        {questions.length} questions
                      </span>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-slate-800/30">
                      {questions.map((r) => (
                        <QuestionCard key={r.id} r={r} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(15 23 42 / 0.4);
          border-radius: 4px;
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
  );
};

export default SectionDashboardPage;