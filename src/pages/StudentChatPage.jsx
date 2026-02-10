import React, { useRef, useEffect } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import StudentHeader from '../components/StudentHeader';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';

const StudentChatPage = ({
  messages,
  isLoading,
  currentTopic,
  studentName,
  setView,
  handleClearChat,
  editorRef,
  keyboardVisible,
  sendMessage,
  handleOpenKeyboard,
  lastBotMsgWithLog,
  feedbackLog,
  feedbackGiven,
  recordUnderstanding,
  messagesEndRef, // The ref for scrolling

  onEditMessage,
  editingMsgId,
  cancelEdit,
}) => {

  
  // NOTE: The scrolling logic must remain here as the ref is defined in Waybot
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    /* FIX 1: 'fixed inset-0' locks the app to the window edges so the header CANNOT scroll away. */
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-950">
      <AnimatedBackground />

      {/* Custom Scrollbar Styles (Keep the two style blocks here for component rendering) */}
     <style>{`
        /* 1. The Wrapper: Acts as a shield so chat cursor skips over it */
        .math-wrapper {
          display: inline-block;
          vertical-align: middle;
          margin: 0 2px;
        }

        /* 2. The Math Field: The actual editable box */
        math-field {
          /* Visuals: Subtle outline so you see it */
          border: 1px solid rgba(255, 255, 255, 0.2) !important; 
          background: rgba(255, 255, 255, 0.05) !important;
          border-radius: 6px;
          
          /* Sizing & spacing */
          min-width: 40px; 
          padding: 4px 8px;
          font-size: 1.1rem;
          color: white !important;
          
          /* Interaction */
          outline: none !important;
          box-shadow: none !important;
          cursor: text; /* Shows the I-beam cursor */
        }

        /* Active State: Glows violet when you are typing */
        math-field:focus-within {
          border-color: rgba(139, 92, 246, 0.6) !important;
          background: rgba(139, 92, 246, 0.1) !important;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.2) !important;
        }

        /* Hides the default menu button inside the math field so chat is clean */
        math-field::part(menu-toggle) {
          display: none !important;
        }
      `}</style>
      <style>{`
        math-field {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          color: white !important;
          font-size: 1.1rem;
          padding: 0 4px;
          margin: 0 2px;
        }
        /* Only show a subtle box when you are actually typing inside it */
        math-field:focus-within {
          background: rgba(255, 255, 255, 0.1) !important;
          border-radius: 4px;
        }
        /* Hides the default menu button inside the math field */
        math-field::part(menu-toggle) {
          display: none;
        }
      `}</style>

      {/* HEADER */}
      <StudentHeader 
        currentTopic={currentTopic}
        studentName={studentName}
        setView={setView}
        handleClearChat={handleClearChat}
      />

      <div
        id="chat-scroll-area"
        className="flex-1 min-h-0 overflow-y-auto px-4 py-6 custom-scrollbar relative z-0"
        onClick={() => window.mathVirtualKeyboard?.hide()}
      >
       
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((m) => {
            const isStudent = m.sender === "student";
            const isEditingThis = editingMsgId === m.id;

          return (
            <div
              key={m.id}
              className="w-full"
            >
              
              <div className={`flex w-full ${isStudent ? "justify-end" : "justify-start"}`}>
                {isStudent && m.id !== "welcome" ? (
                  <div className="group flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditMessage?.(m)}
                      disabled={isLoading}
                      className={
                        "p-2 rounded-lg bg-slate-800/80 border border-slate-700 " +
                        "opacity-100 md:opacity-0 md:group-hover:opacity-100 transition " +
                        "hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      }
                      title="Edit message"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="w-4 h-4 text-slate-200"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L8.7 17.59 4 19l1.41-4.7L16.862 3.487Z"
                        />
                      </svg>
                    </button>

                    <ChatBubble m={m} />
                  </div>
                ) : (
                  <ChatBubble m={m} />
                )}
              </div>            
            </div>
          );

          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-700/50">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
      </div>
      
      {editingMsgId && (
        <div className="px-4 pb-2">
          <div className="max-w-2xl mx-auto flex items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2">
            <div className="text-sm text-violet-200">
              You are editing a previous message
            </div>
            <button
              type="button"
              onClick={() => cancelEdit?.()}
              className="text-sm text-violet-200 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* INPUT AREA*/}
      <ChatInput 
        editorRef={editorRef}
        keyboardVisible={keyboardVisible}
        sendMessage={sendMessage}
        isLoading={isLoading}
        handleOpenKeyboard={handleOpenKeyboard}
        lastBotMsgWithLog={lastBotMsgWithLog}
        feedbackLog={feedbackLog}
        feedbackGiven={feedbackGiven}
        recordUnderstanding={recordUnderstanding}
        editingMsgId={editingMsgId}
        cancelEdit={cancelEdit}   
      />
    </div> 
  );
};

export default StudentChatPage;