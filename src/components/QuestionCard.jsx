import React from 'react';
import { TOPICS } from '../config/waybotConfig';

const QuestionCard = ({ r }) => {
  const topic = TOPICS.find((t) => t.id === r.topicId);

  return (
    <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm flex-shrink-0 border border-slate-600">
        {topic?.icon || "📝"}
      </div>

      <div className="flex-1 min-w-0">
        {/* Top row: student, topic, status badge */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-medium text-violet-200 text-sm">{r.student}</span>
          <span className="text-slate-600 text-xs">•</span>
          <span className="text-slate-400 text-xs">{topic?.name}</span>

          {r.confused === true && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium uppercase tracking-wider">
              Confused
            </span>
          )}
          {r.confused === false && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium uppercase tracking-wider">
              Got it
            </span>
          )}
          {r.confused === null && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-slate-700/30 border border-slate-600/30 text-slate-400 text-[10px] font-medium uppercase tracking-wider">
              Pending
            </span>
          )}
        </div>

        {/* Student question */}
        <p className="text-slate-300 text-sm mb-1">{r.question}</p>

        {/* NEW: short AI explanation snippet */}
        {r.explanation && (
          <div className="pl-2 border-l-2 border-slate-700 mt-2">
            <p className="text-slate-500 text-xs line-clamp-2 italic">
              AI: {r.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;