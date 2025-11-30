import React from 'react';

const FeedbackButtons = ({ lastBotMsgWithLog, feedbackLog, feedbackGiven, recordUnderstanding }) => {

    if (!lastBotMsgWithLog) {
        return null;
    }

    // The message that explains the current feedback status
    const statusMessage = feedbackGiven
        ? feedbackLog?.confused
            ? "You marked this explanation as still confusing."
            : "You marked this explanation as clear."
        : "How was that explanation?";

    // The handler for 'Got it' (confused=false)
    const handleGotIt = () => recordUnderstanding(false, lastBotMsgWithLog.logId);
    
    // The handler for 'Still confused' (confused=true)
    const handleConfused = () => recordUnderstanding(true, lastBotMsgWithLog.logId);

    return (
        <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-slate-500">{statusMessage}</span>
            <div className="flex gap-2">
                <button
                    onClick={handleGotIt}
                    disabled={feedbackGiven}
                    className={
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition transform " +
                        (feedbackGiven
                            ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                            : "bg-slate-900/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10 hover:scale-105 active:scale-95")
                    }
                >
                    ✓ Got it
                </button>
                <button
                    onClick={handleConfused}
                    disabled={feedbackGiven}
                    className={
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition transform " +
                        (feedbackGiven
                            ? "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                            : "bg-slate-900/80 text-amber-300 border border-amber-500/40 hover:bg-amber-500/10 hover:scale-105 active:scale-95")
                    }
                >
                    ? Still confused
                </button>
            </div>
        </div>
    );
};

export default FeedbackButtons;