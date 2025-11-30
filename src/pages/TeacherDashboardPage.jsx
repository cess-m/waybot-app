import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import QuestionCard from '../components/QuestionCard'; // Component for rendering recent questions
import { TOPICS } from '../config/waybotConfig'; // Import TOPICS for rendering names/icons

const TeacherDashboardPage = ({
    setView,
    setTeacherAuthenticated,
    setTeacherPass,
    clearAllData,
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
    logs, // Passed for student detail drill-down logic
}) => {
    
    // Helper function moved from Waybot.jsx to be used locally here for student drill-down
    const getTopicName = (topicId) => TOPICS.find((t) => t.id === topicId)?.name || topicId;

    return (
        <div className="min-h-screen p-4 sm:p-6 relative">
            <AnimatedBackground />
            <div className="max-w-5xl mx-auto">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-slate-500">Waybot Analytics</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={clearAllData} className="text-red-400 border border-red-500/30 hover:bg-red-500/10 text-xs px-4 py-2 rounded-xl transition">Reset</button>
                        <button onClick={() => { setTeacherAuthenticated(false); setTeacherPass(""); setView("home"); }} className="text-slate-400 hover:text-white border border-slate-700 text-xs px-4 py-2 rounded-xl transition">Sign out</button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-2xl p-5">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Total Questions</p>
                        <p className="text-4xl font-bold text-white">{analytics.totalQuestions}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-5">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Confusion Rate</p>
                        <p className="text-4xl font-bold text-amber-400">{analytics.confusionRate}%</p>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Students</p>
                        <p className="text-4xl font-bold text-white">{analytics.activeStudents}</p>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Topics</p>
                        <p className="text-4xl font-bold text-white">{analytics.topicsCovered}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Questions by Topic & Concept Breakdown */}
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                        <h2 className="text-white font-semibold mb-4">Questions by Topic</h2>
                          {analytics.byTopic.length === 0 ? (
                            <p className="text-slate-500 text-sm">No data yet</p>
                          ) : (
                            <>
                              <div className="space-y-4">
                                {analytics.byTopic.map((t) => {
                                  const pct = t.total
                                    ? Math.round((t.total / analytics.totalQuestions) * 100)
                                    : 0;
                                  const confPct = t.total
                                    ? Math.round((t.confused / t.total) * 100)
                                    : 0;
                                  const topic = TOPICS.find((tp) => tp.id === t.topicId);
                                  return (
                                    <div key={t.topicId}>
                                      <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white font-medium">
                                          {topic?.icon} {t.topicName}
                                        </span>
                                        <span className="text-slate-400">
                                          {t.total} •{" "}
                                          <span
                                            className={confPct > 30 ? "text-red-400" : "text-amber-400"}
                                          >
                                            {confPct}% confused
                                          </span>
                                        </span>
                                      </div>
                                      <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                        <div
                                          className={
                                            "h-full bg-gradient-to-r " +
                                            (topic?.color || "from-violet-500 to-purple-500") +
                                            " rounded-full"
                                          }
                                          style={{ width: pct + "%" }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              {conceptStats.length > 0 && (
                                <div className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700/40">
                                  <h3 className="text-slate-300 text-sm mb-2">Concept Breakdown</h3>
                                  {conceptStats.map((c) => {
                                    const confusedPct = c.total
                                      ? Math.round((c.confused / c.total) * 100)
                                      : 0;
                                    return (
                                      <div
                                        key={c.concept}
                                        className="flex justify-between text-xs text-slate-400 py-1"
                                      >
                                        <span>{c.concept}</span>
                                        <span>
                                          {c.total} questions • {confusedPct}% confused
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          )}

                    </div>

                    
                    {/* Student Activity & Drill-down */}
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                      <h2 className="text-white font-semibold mb-4">Student Activity</h2>
                      {analytics.byStudent.length === 0 ? (
                        <p className="text-slate-500 text-sm">No students yet</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-slate-400 border-b border-slate-700/60">
                                <th className="text-left py-2 pr-2 font-medium">Student</th>
                                <th className="text-left py-2 px-2 font-medium">Questions</th>
                                <th className="text-left py-2 px-2 font-medium">Confused</th>
                                <th className="text-right py-2 pl-2 font-medium">Last active</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analytics.byStudent.map((s) => {
                                const isSelected = selectedStudentDetail === s.student;
                                return (
                                  <tr
                                    key={s.student}
                                    onClick={() => setSelectedStudentDetail(s.student)}
                                    className={
                                      "cursor-pointer border-b border-slate-800/60 hover:bg-slate-900/70 transition " +
                                      (isSelected ? "bg-slate-900/80" : "")
                                    }
                                  >
                                    <td className="py-2 pr-2 text-slate-200">
                                      {s.student}
                                    </td>
                                    <td className="py-2 px-2 text-slate-300">
                                      {s.total}
                                    </td>
                                    <td className="py-2 px-2 text-slate-300">
                                      {s.confused}
                                    </td>
                                    <td className="py-2 pl-2 text-right text-slate-500 text-xs">
                                      {new Date(s.lastActive).toLocaleString()}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {/* Student drill-down panel */}
                          {selectedStudentDetail && (
                            <div className="mt-4 rounded-xl bg-slate-900/70 border border-slate-700/70 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="text-slate-300 text-sm">
                                    Activity for{" "}
                                    <span className="font-semibold text-white">
                                      {selectedStudentDetail}
                                    </span>
                                  </p>
                                  <p className="text-slate-500 text-xs">
                                    {selectedStudentLogs.length} questions across all topics
                                  </p>
                                </div>
                                <button
                                  onClick={() => setSelectedStudentDetail(null)}
                                  className="text-xs px-3 py-1 rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                >
                                  Close
                                </button>
                              </div>

                              {selectedStudentLogs.length === 0 ? (
                                <p className="text-slate-500 text-xs">
                                  No detailed logs yet for this student.
                                </p>
                              ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                  {selectedStudentLogs.map((log) => {
                                    const topic = TOPICS.find((t) => t.id === log.topicId);
                                    const status =
                                      log.confused === true
                                        ? "Confused"
                                        : log.confused === false
                                        ? "Got it"
                                        : "Pending";
                                    const statusColor =
                                      log.confused === true
                                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                        : log.confused === false
                                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                        : "bg-slate-700/40 text-slate-300 border-slate-600/40";

                                    return (
                                      <div
                                        key={log.id}
                                        className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs"
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-slate-300">
                                              {topic?.icon} {topic?.name || log.topicId}
                                            </span>
                                            {log.concept && (
                                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
                                                {log.concept}
                                              </span>
                                            )}
                                          </div>
                                          <span
                                            className={
                                              "px-2 py-0.5 rounded-full text-[10px] border " +
                                              statusColor
                                            }
                                          >
                                            {status}
                                          </span>
                                        </div>

                                        <p className="text-slate-300 mb-1">
                                          Q: {log.question}
                                        </p>

                                        {log.explanation && (
                                          <p className="text-slate-500 italic line-clamp-2">
                                            AI: {log.explanation}
                                          </p>
                                        )}

                                        <p className="text-slate-600 mt-1 text-[10px]">
                                          {new Date(log.timestamp).toLocaleString()}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                </div>

                {/* RECENT QUESTIONS PANEL */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <h2 className="text-white font-semibold">Recent Questions</h2>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* 1. FILTER BUTTONS (All / Got it / Confused) */}
                            <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700/50">
                                {["all", "got-it", "confused", "pending"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setRecentFilter(f)}
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                                            recentFilter === f
                                                ? "bg-slate-700 text-white shadow-sm"
                                                : "text-slate-400 hover:text-slate-200"
                                        }`}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* 2. GROUPING BUTTONS (Latest / Student / Concept) */}
                            <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-700/50">
                                {["latest", "student", "concept"].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setGroupingMode(m)}
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                                            groupingMode === m
                                                ? "bg-violet-600 text-white shadow-sm"
                                                : "text-slate-400 hover:text-slate-200"
                                        }`}
                                    >
                                        {m.charAt(0).toUpperCase() + m.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CONTENT RENDERING */}
                    {filteredRecent.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-sm">No activity found for these filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* OPTION A: LATEST (Standard List) */}
                            {groupingMode === "latest" && (
                                <div className="space-y-3">
                                    {groupedQuestions.map((r) => (
                                        <QuestionCard key={r.id} r={r} />
                                    ))}
                                </div>
                            )}

                            {/* OPTION B: GROUPED (By Student or Concept) */}
                            {groupingMode !== "latest" && 
                                Object.entries(groupedQuestions).map(([groupName, questions]) => (
                                    <div key={groupName} className="border border-slate-700/50 rounded-xl overflow-hidden">
                                        <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-700/50 flex justify-between items-center">
                                            <span className="font-semibold text-slate-200 text-sm">{groupName}</span>
                                            <span className="text-xs text-slate-500">{questions.length} questions</span>
                                        </div>
                                        <div className="p-3 space-y-3 bg-slate-800/20">
                                            {questions.map((r) => (
                                               <QuestionCard key={r.id} r={r} />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboardPage;