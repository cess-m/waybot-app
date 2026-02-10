import React from 'react';
import { toast } from "sonner";

const StudentHeader = ({ currentTopic, studentName, setView, handleClearChat }) => {
  const confirmClearChat = () => {
    toast("Delete this chat?", {
      description: "This will permanently remove your chat history.",
      action: {
        label: "Yes, delete",
        onClick: () => {
          handleClearChat();
          toast.success("Chat deleted");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.message("Cancelled"),
      },
    });
  };

  // Same icon mapping from TopicSelectPage
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

  return (
    // HEADER: flex-shrink-0 keeps it from squishing
    <div className="flex-shrink-0 px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center gap-3 relative z-10">
      {/* Back Button */}
      <button 
        onClick={() => setView("topic-select")} 
        className="group p-2 -ml-2 rounded-lg hover:bg-slate-800 transition"
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
      
      {/* Topic Icon - Updated to use matching icons */}
      <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + currentTopic.color + " flex items-center justify-center shadow-lg"}>
        <div className="text-white">
          {getTopicIcon(currentTopic.id)}
        </div>
      </div>
      
      {/* Title */}
      <div className="flex-1">
        <h1 className="text-white font-semibold">{currentTopic.name} Tutor</h1>
        <p className="text-slate-500 text-xs">Learning with {studentName}</p>
      </div>
      
      {/* Clear Chat Button */}
      <button 
        onClick={confirmClearChat}
        className="group p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/50 transition-all"
        title="Clear Chat History"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  );
};

export default StudentHeader;