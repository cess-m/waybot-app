import React, { useState } from 'react';
import FeedbackButtons from './FeedbackButtons'; 

const ChatInput = ({ 
  editorRef, 
  keyboardVisible, 
  sendMessage, 
  isLoading, 
  handleOpenKeyboard,
  lastBotMsgWithLog,
  feedbackLog,
  feedbackGiven,
  recordUnderstanding,

  editingMsgId,    
  cancelEdit,       
}) => {

  const [hasInput, setHasInput] = useState(false);
  const handleSend = () => {
    sendMessage();
    if (editorRef.current) editorRef.current.innerHTML = "";
    setHasInput(false); 
  };
  return (
    // INPUT AREA: flex-shrink-0 ensures it stays FIXED at the bottom
    <div
      className="flex-shrink-0 p-4 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 relative z-10"
      style={{
        transition: "margin-bottom 0.25s ease",
        // This margin-bottom logic relies on the keyboardVisible state from Waybot
        marginBottom: keyboardVisible ? "320px" : "0px",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-3">
          
          <div className="relative w-full">

            {/* MATHLIVE KEYBOARD CONTAINER (Must remain here) */}
            <div
              id="mathlive-keyboard"
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#0f172a",
                borderTop: "1px solid #334155",
                zIndex: 9999,
              }}
            ></div>
            
            {/* CONTENTEDITABLE TEXT AREA */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none min-h-[48px]"
              onClick={() => window.mathVirtualKeyboard?.hide()}
              onInput={() => {
                if (!editorRef.current) return;
                const hasText = editorRef.current.innerText.trim() !== "";
                const hasMath = editorRef.current.querySelectorAll("math-field").length > 0;
                setHasInput(hasText || hasMath);
              }}
              onKeyDown={(e) => {
                // 1. SEND MESSAGE (Enter key) - Needs to call sendMessage prop
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                  return;
                }

                if (e.key === "Escape" && editingMsgId) {
                  e.preventDefault();
                  cancelEdit?.();
                  if (editorRef.current) editorRef.current.innerHTML = "";
                  setHasInput(false);
                  return;
                }

                // 2. DELETE MATH BOX (Backspace key) - Needs editorRef.current
                if (e.key === "Backspace") {
                  const sel = window.getSelection();
                  if (!sel.rangeCount || !sel.getRangeAt(0).collapsed) return;

                  const range = sel.getRangeAt(0);
                  let nodeToDelete = null;

                  // Scenario A: Cursor is inside the main div (between elements)
                  if (range.startContainer === editorRef.current) {
                    const prevNodeIndex = range.startOffset - 1;
                    if (prevNodeIndex >= 0) {
                      nodeToDelete = editorRef.current.childNodes[prevNodeIndex];
                    }
                  }
                  // Scenario B: Cursor is at the very start of a text node
                  else if (
                    range.startContainer.nodeType === Node.TEXT_NODE &&
                    range.startOffset === 0
                  ) {
                    nodeToDelete = range.startContainer.previousSibling;
                  }

                  // If we found a math wrapper immediately behind the cursor, kill it
                  if (
                    nodeToDelete &&
                    nodeToDelete.nodeType === Node.ELEMENT_NODE &&
                    (nodeToDelete.classList.contains("math-wrapper") ||
                      nodeToDelete.tagName === "MATH-FIELD")
                  ) {
                    e.preventDefault();
                    nodeToDelete.remove();
                  }
                }
              }}
            ></div>

            {/* BUTTON 1: Keyboard Toggle (Creates new math box) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()} 
              // Needs to call handleOpenKeyboard prop
              onClick={handleOpenKeyboard} 
              className="absolute right-3 top-1/2 -translate-y-1/2 
                        text-slate-400 hover:text-white hover:bg-slate-700
                        w-8 h-8 rounded-lg flex items-center justify-center transition"
              title="Open Math Keyboard"
            >
               {/* Keyboard Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 18.25H6A2.25 2.25 0 0 1 3.75 16V6ZM3.75 15.75h16.5M6 7.5h.008v.008H6V7.5Zm3 0h.008v.008H9V7.5Zm3 0h.008v.008H12V7.5Zm3 0h.008v.008H15V7.5Zm3 0h.008v.008H18V7.5ZM6 11.25h.008v.008H6V11.25Zm3 0h.008v.008H9V11.25Zm3 0h.008v.008H12V11.25Zm3 0h.008v.008H15V11.25Zm3 0h.008v.008H18V11.25Z" />
              </svg>
            </button>
          </div>
          {/* SEND BUTTON */}
          <button 
            type="button" 
            onMouseDown={(e) => e.preventDefault()}   
            // Needs to call sendMessage prop
            onClick={handleSend}
            disabled={isLoading || !hasInput}

            className="
              px-6 py-3 rounded-xl 
              bg-gradient-to-r from-violet-600 to-indigo-600
              text-white font-medium 
              shadow-lg shadow-violet-500/25
              transition-all
              hover:shadow-violet-400/40 hover:scale-105 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100
            "
          >
            {editingMsgId ? "Save" : "Send"}
          </button>
        </div>
        
        {/* FEEDBACK BUTTONS COMPONENT */}
        {/* The FeedbackButtons component is used here */}
        {!editingMsgId && (
            <FeedbackButtons
              lastBotMsgWithLog={lastBotMsgWithLog}
              feedbackLog={feedbackLog}
              feedbackGiven={feedbackGiven}
              recordUnderstanding={recordUnderstanding}
            />
          )}  
      </div>
    </div>
  );
};

export default ChatInput;