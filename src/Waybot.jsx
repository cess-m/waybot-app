import { useEffect, useMemo, useRef, useState } from "react";
import "mathlive";
import { autoLatex } from "./utils/autoLatex";
import AnimatedBackground from "./components/AnimatedBackground";
import { TOPICS, TEACHER_PASSWORD, ACTIVE_PROVIDER } from "./config/waybotConfig"; 
import { TUTOR_SYSTEM_PROMPT } from "./config/tutorSystemPrompt";
import QuestionCard from "./components/QuestionCard";
import ChatBubble from "./components/ChatBubble";
import FeedbackButtons from "./components/FeedbackButtons";
import StudentHeader from "./components/StudentHeader";
import ChatInput from "./components/ChatInput";
import StudentLoginPage from "./pages/StudentLoginPage";
import TopicSelectPage from "./pages/TopicSelectPage";
import HomePage from "./pages/HomePage";
import StudentChatPage from "./pages/StudentChatPage";
import TeacherLoginPage from "./pages/TeacherLoginPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import { cleanupText } from "./utils/cleanupText"; 


async function callLLM({ cleanMessages, questionText, studentName, currentTopic, TUTOR_SYSTEM_PROMPT, VITE_GEMINI_API_KEY }) {
  
  // 1. Define the API endpoint and key
  const geminiEndpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    VITE_GEMINI_API_KEY;

  // 2. Construct the full prompt text (System Prompt + Context + Conversation)
  const promptText =
    TUTOR_SYSTEM_PROMPT +
    "\n\nStudent: " +
    studentName +
    "\nTopic: " +
    (currentTopic?.name || "") +
    "\n\nConversation:\n" +
    (
      // If there are existing messages, format the conversation history
      cleanMessages.length
        ? cleanMessages.map((m) => `${m.role}: ${m.content}`).join("\n")
        : "user: " + questionText // Otherwise, just send the first question
    );

  // 3. Make the API request
  const response = await fetch(geminiEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
    }),
  });

  const data = await response.json();
  console.log("Gemini raw response:", data);

  // 4. Extract the response text
  const aiText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Hmm, I'm having trouble thinking right now. Can you try asking again?";

  return aiText;
}

export default function Waybot() {
  const [view, setView] = useState("home");
  const [studentName, setStudentName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [teacherPass, setTeacherPass] = useState("");
  const [teacherAuthenticated, setTeacherAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState(null); 
  const [chatHistories, setChatHistories] = useState({});
  const [recentFilter, setRecentFilter] = useState("all");  
  const messagesEndRef = useRef(null);
  const [groupingMode, setGroupingMode] = useState("latest");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [awaitingConfusionReason, setAwaitingConfusionReason] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [activeKeyboardTab, setActiveKeyboardTab] = useState("basic");
  const inputRef = useRef(null);
  const mathFieldRef = useRef(null);
  const editorRef = useRef(null);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);


  // Configure main hidden mathfield to use custom keyboard container
useEffect(() => {
  // 1. Setup the invisible helper field options
  if (mathFieldRef.current) {
    mathFieldRef.current.setOptions({
      virtualKeyboardMode: "manual",
      virtualKeyboardLayout: "math",
      virtualKeyboardContainer: "#mathlive-keyboard",
       menuItems: "all",
    });
  }
  // 2. The Master Listener: Checks if the keyboard actually takes up space
  const handleKeyboardVisibility = (event) => {
    // If the keyboard height is > 0, it is OPEN. If 0, it is CLOSED.
    const rect = window.mathVirtualKeyboard?.boundingRect;
    const isVisible = rect && rect.height > 0;
    
    setKeyboardVisible(!!isVisible);
  };

  // 3. Attach the listener to the global MathLive object
  if (window.mathVirtualKeyboard) {
     window.mathVirtualKeyboard.addEventListener("geometrychange", handleKeyboardVisibility);
  }

  return () => {
    if (window.mathVirtualKeyboard) {
       window.mathVirtualKeyboard.removeEventListener("geometrychange", handleKeyboardVisibility);
    }
  };
}, []);
  
  function insertNodeAtCursor(node) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(node);

  range.setStartAfter(node);
  range.setEndAfter(node);
  sel.removeAllRanges();
  sel.addRange(range);
}

// CHANGE 1: Accept "openKeyboard" parameter (default is true)
function addEquation(openKeyboard = true) {
  const editor = editorRef.current;
  if (!editor) return;

  // 1. Create Wrapper (The Shield)
  const wrapper = document.createElement("span");
  wrapper.setAttribute("contenteditable", "false"); 
  wrapper.classList.add("math-wrapper");

  // 2. Create Math Field
  const mf = document.createElement("math-field");
  mf.classList.add("inline-mathfield");
  
  // --- FIX: Use direct properties instead of setOptions (Fixes Warnings) ---
  mf.mathVirtualKeyboardPolicy = "manual"; 
  // We don't need to set layout/container here because we did it globally in useEffect
  
  // 3. Focus Logic
  const handleFocus = (e) => {
    // If the user clicked the internal "Triple Line" menu button, 
    // we want to let MathLive handle it and NOT open the bottom keyboard.
    // We check if the click target is the menu toggle inside the Shadow DOM.
    // (Note: Usually MathLive stops propagation, but this is a safety check)
    if (e && e.target && e.target.shadowRoot) {
       // Logic to ignore clicks on the menu button itself if needed
       // For now, we allow the standard click.
    }

    if (e && e.type === "click") {
        e.stopPropagation();
    }
    
    mf.focus(); 
    
    // Only open the bottom keyboard if we explicitly asked for it
    // AND if we are sure the user isn't trying to open the context menu
    if (window.mathVirtualKeyboard && (e?.type === "click" || openKeyboard)) {
      window.mathVirtualKeyboard.show();
    }
  };

  // Only listen to CLICK to prevent auto-focus loops
  mf.addEventListener("click", handleFocus);

  // 4. Backspace Logic
  mf.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if ((e.key === "Backspace" || e.key === "Delete") && !mf.getValue()) {
      e.preventDefault();
      wrapper.remove(); 
      editor.focus(); 
    }
  });

  wrapper.appendChild(mf);

  // 5. Sandwich Insertion Logic (Allows multiple boxes on one line)
  const spaceBefore = document.createTextNode("\u00A0");
  const spaceAfter = document.createTextNode("\u00A0");
  const sel = window.getSelection();

  if (document.activeElement && document.activeElement.tagName.toLowerCase() === 'math-field') {
    const currentWrapper = document.activeElement.closest("span");
    if (currentWrapper) {
      const range = document.createRange();
      range.setStartAfter(currentWrapper);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(spaceAfter);
    range.insertNode(wrapper); 
    range.insertNode(spaceBefore);
    range.setStartAfter(spaceAfter);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    editor.appendChild(spaceBefore);
    editor.appendChild(wrapper);
    editor.appendChild(spaceAfter);
  }

  // 6. Final Focus Trigger
  setTimeout(() => {
    mf.focus(); 

    // Only open the keyboard if 'openKeyboard' is true (default).
    // If we call addEquation(false), it creates the box silently.
    if (openKeyboard) {
       handleFocus(); 
       setKeyboardVisible(true);
       document.querySelector("#mathlive-keyboard")?.classList.remove("hidden");
    }
  }, 50);

  setShowInsertMenu(false);
}

function insertMathBox() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  // create the inline mathfield
  const mf = document.createElement("math-field");

  // give it a class so we can style it nicely
  mf.classList.add("inline-mathfield");

  // never auto-open MathLive’s keyboard
  mf.setOptions({
  virtualKeyboardMode: "manual",
  virtualKeyboardLayout: "math",
  virtualKeyboardContainer: "#mathlive-keyboard",

  smartFence: false,                  
  removeExtraneousParentheses: true,   
});


  // empty placeholder
  mf.value = "\\placeholder{}";

  // insert mathfield into chat input at the cursor
  range.insertNode(mf);

  // move caret into the mathfield
  setTimeout(() => {
    mf.focus();
  }, 0);
}

  useEffect(() => {
    fetch("http://localhost:5000/api/logs")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setLogs(data);
      })
      .catch(err => console.error("Backend offline:", err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const currentTopic = useMemo(() => TOPICS.find((t) => t.id === selectedTopic), [selectedTopic]);

  const analytics = useMemo(() => {
    if (!logs.length) return { totalQuestions: 0, confusionRate: 0, activeStudents: 0, topicsCovered: 0, byTopic: [], byStudent: [], recent: [] };
    const byTopicMap = new Map();
    const byStudentMap = new Map();
    logs.forEach((log) => {
      if (!byTopicMap.has(log.topicId)) byTopicMap.set(log.topicId, { topicId: log.topicId, topicName: TOPICS.find((t) => t.id === log.topicId)?.name || log.topicId, total: 0, confused: 0 });
      const t = byTopicMap.get(log.topicId);
      t.total++;
      if (log.confused === true) t.confused++;
      if (!byStudentMap.has(log.student)) byStudentMap.set(log.student, { student: log.student, total: 0, confused: 0, lastActive: log.timestamp });
      const s = byStudentMap.get(log.student);
      s.total++;
      if (log.confused === true) s.confused++;
      if (log.timestamp > s.lastActive) s.lastActive = log.timestamp;
    });
    const totalConfused = logs.filter((l) => l.confused === true).length;
    return {
      totalQuestions: logs.length,
      confusionRate: logs.length ? Math.round((totalConfused / logs.length) * 100) : 0,
      activeStudents: byStudentMap.size,
      topicsCovered: byTopicMap.size,
      byTopic: Array.from(byTopicMap.values()),
      byStudent: Array.from(byStudentMap.values()).sort((a, b) => b.lastActive - a.lastActive),
      recent: [...logs].sort((a, b) => b.timestamp - a.timestamp).slice(0, 15),
    };
  }, [logs]);

    const conceptStats = useMemo(() => {
      const map = new Map();

      logs.forEach((l) => {
        if (!l.concept) return;

        const existing = map.get(l.concept) || {
          concept: l.concept,
          total: 0,
          confused: 0,
        };

        existing.total++;
        if (l.confused === true) existing.confused++;

        map.set(l.concept, existing);
      });

      return Array.from(map.values());
    }, [logs]);

      const filteredRecent = useMemo(() => {
        const items = analytics.recent || [];

        switch (recentFilter) {
          case "got-it":
            return items.filter((r) => r.confused === false);
          case "confused":
            return items.filter((r) => r.confused === true);
          case "pending":
            return items.filter((r) => r.confused === null);
          default:
            return items;
        }
      }, [analytics.recent, recentFilter]);

      // NEW: detailed history for the student selected in the dashboard
      const selectedStudentLogs = useMemo(() => {
        if (!selectedStudentDetail) return [];
        return logs
          .filter((l) => l.student === selectedStudentDetail)
          .sort((a, b) => b.timestamp - a.timestamp);
      }, [logs, selectedStudentDetail]);

    const groupedQuestions = useMemo(() => {

    // If mode is 'latest', we don't group, just return the flat list
    if (groupingMode === "latest") return filteredRecent;

    const groups = {};
    
    filteredRecent.forEach((log) => {
      // Decide what key to group by: Student Name OR Concept Name
      const key = groupingMode === "student" 
        ? log.student 
        : (log.concept || "General"); 
        
      if (!groups[key]) groups[key] = [];
      groups[key].push(log);
    });

    return groups; 
  }, [filteredRecent, groupingMode]);
    const handleStudentLogin = async () => {
  if (!studentName.trim()) return;

  // Ask for consent before saving ANY data
  const consent = confirm(
    "Before we continue, do you agree that your questions and AI explanations will be visible to your teacher in the analytics dashboard? This helps them understand where students struggle."
  );

  if (!consent) {
    alert("No worries! Your data will not be stored. You may still explore, but analytics will be disabled.");
    // Go to topics but DO NOT store to backend
    setView("topic-select");
    return;
  }

  // Student consented → save login to backend
  try {
    await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: studentName.trim(),
        consent: true   // ← you can also store this in DB
      })
    });
  } catch (e) {
    console.error("Login sync failed", e);
  }

  // Continue to topic selection
  setView("topic-select");
};

  const handleTeacherLogin = () => {
    if (teacherPass === TEACHER_PASSWORD) {
      setTeacherAuthenticated(true);
      setView("teacher-dashboard");
      setTeacherPass(""); // Clear password for security
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const handleSelectTopic = async (topicId) => {
  setSelectedTopic(topicId);
  const historyKey = studentName.toLowerCase() + "-" + topicId;
  const topicName = TOPICS.find((t) => t.id === topicId)?.name;

  try {
    const res = await fetch(`http://localhost:5000/api/chat/${historyKey}`);
    const savedMsgs = await res.json();

    if (Array.isArray(savedMsgs) && savedMsgs.length > 0) {
      setMessages(savedMsgs);
    } else {
      // no history → default welcome
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text:
            "Hello " +
            studentName +
            ". I'm ready to help you master " +
            topicName +
            ". \n\nWhat's on your mind?",
        },
      ]);
    }
  } catch (e) {
    console.error("Failed to load chat history:", e);
    // fetch failed → STILL give a welcome message
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text:
          "Hello " +
          studentName +
          ". I'm ready to help you master " +
          topicName +
          ". \n\nWhat's on your mind?",
      },
    ]);
  }

  setView("student-chat");
};

  const saveChatHistory = async (msgs) => {
    const historyKey = studentName.toLowerCase() + "-" + selectedTopic;
    setChatHistories((prev) => ({ ...prev, [historyKey]: msgs })); // Keep UI fast

    // Send to Server
    await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ historyKey, messages: msgs })
    });
  };
  
  const handleClearChat = async () => {
    if (!confirm("Are you sure you want to clear this conversation?")) return;
    
    const historyKey = studentName.toLowerCase() + "-" + selectedTopic;

    try {
      // 1. Tell Server to delete it
      await fetch(`http://localhost:5000/api/chat/${historyKey}`, { method: "DELETE" });

      // 2. Reset the UI to the Welcome Message
      const topicName = TOPICS.find((t) => t.id === selectedTopic)?.name;
      const resetMsg = [{ 
        id: "welcome", 
        sender: "bot", 
        text: "Chat cleared! 🧹\n\nHello " + studentName + ". I'm ready to help you master " + topicName + ". \n\nWhat's on your mind?" 
      }];
      
      setMessages(resetMsg);
      setChatHistories((prev) => ({ ...prev, [historyKey]: resetMsg }));
      
    } catch (e) {
      console.error("Failed to clear chat", e);
    }
  };

      const handleInsertFromKeyboard = (snippet) => {
        if (mathFieldRef.current) {
          // Insert LaTeX into the MathLive field
          mathFieldRef.current.executeCommand("insert", snippet);

          // Sync React state with the field's LaTeX value
          const v = mathFieldRef.current.getValue("latex");
          setInput(v);
        } else {
          // Fallback: append to plain input if mathField not available
          setInput((prev) => prev + snippet);
        }
      };
  
  // 1. Opens the Bottom Keyboard (Numbers, Symbols, Calculus)
  // 1. Opens the Bottom Keyboard (Numbers, Symbols)
  // 1. Forces a NEW Math Box every time the button is clicked
const handleOpenKeyboard = () => {
  // If the user is currently INSIDE a math field, we need to step out of it 
  // so we don't try to put a box inside a box.
  if (document.activeElement && document.activeElement.tagName.toLowerCase() === 'math-field') {
    const currentWrapper = document.activeElement.closest("span");
    if (currentWrapper) {
      // Move cursor immediately AFTER the current math box
      const range = document.createRange();
      range.setStartAfter(currentWrapper);
      range.collapse(true);
      
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
  addEquation(true);
};

const handleOpenContextMenu = () => {
  if (!editorRef.current) return;

  // 1) Try currently focused math-field
  let targetMf = document.querySelector("math-field:focus-within");

  // 2) If none focused, fallback: use the last math-field in the editor
  if (!targetMf) {
    const allMfs = editorRef.current.querySelectorAll("math-field");
    if (allMfs.length > 0) {
      targetMf = allMfs[allMfs.length - 1];
    }
  }

  const openMenuFor = (mf) => {
    if (!mf) return;

    mf.focus();

    const rect = mf.getBoundingClientRect();

    // 👉 This tells MathLive to open its built-in context menu
    mf.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    );
  };

  if (targetMf) {
    // If math-field already exists → open menu
    openMenuFor(targetMf);
  } else {
    // No math-field? → create one automatically
    addEquation(false);

    setTimeout(() => {
      const allMfs = editorRef.current?.querySelectorAll("math-field");
      const newMf =
        allMfs && allMfs.length > 0 ? allMfs[allMfs.length - 1] : null;

      openMenuFor(newMf);
    }, 40);
  }
};


  const sendMessage = async () => {
  if (!editorRef.current) return;

 // --- REPLACEMENT START ---
  const { cleanText, rawHtml } = cleanupText(editorRef.current);

  // Validation: If both text and HTML are empty, don't send
  if (!cleanText && !rawHtml) return;
  // --- REPLACEMENT END ---

  // Close Keyboard
  setKeyboardVisible(false);
  if (window.mathVirtualKeyboard) {
    window.mathVirtualKeyboard.hide();
  }

  // CLEAR THE EDITOR
  editorRef.current.innerHTML = "";

  // 2) Add the student's message to the UI
  const userMessage = {
      id: Date.now() + "-user",
      sender: "student",
      html: rawHtml,   // Shows the math boxes correctly
      text: cleanText  // Shows "$x^2$" to the AI
    };
  const newMessages = [...messages, userMessage];
  setMessages(newMessages);

  const questionText = cleanText; // Send the readable text to AI
  setInput("");

  // clear the MathLive field refs if any exist in memory
  if (mathFieldRef.current) {
    mathFieldRef.current.setValue("");
  }

  setIsLoading(true);

  // 3) Log this question for analytics
  const logEntry = {
    id: Date.now().toString(),
    student: studentName.trim(),
    topicId: selectedTopic,
    concept: currentTopic?.name ? `${currentTopic.name} – basics` : "General",
    explanation: null,
    question: questionText, 
    confused: null,
    timestamp: Date.now(),
  };

  setLogs((prev) => [...prev, logEntry]);

  // SAVE LOG TO SERVER
  fetch("http://localhost:5000/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry)
  }).catch(err => console.error("Log save failed", err));

  try {
    // 3) Convert messages into generic chat format
    const apiMessages = newMessages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: m.sender === "student" ? "user" : "assistant",
        content: m.text, // Sends the processed text
      }));

    const cleanMessages = [];
    for (const msg of apiMessages) {
      if (cleanMessages.length === 0 && msg.role === "assistant") continue;
      if (
        cleanMessages.length > 0 &&
        cleanMessages[cleanMessages.length - 1].role === msg.role
      ) {
        cleanMessages[cleanMessages.length - 1].content += "\n" + msg.content;
        continue;
      }
      cleanMessages.push(msg);
    }

    // 4) Call the LLM
    const aiText = await callLLM({
    cleanMessages,
    questionText,
    studentName,
    currentTopic,
    TUTOR_SYSTEM_PROMPT: TUTOR_SYSTEM_PROMPT,
    VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
});

    // Attach AI explanation to log entry
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logEntry.id ? { ...log, explanation: aiText } : log
      )
    );

    // Save explanation to backend
    fetch(`http://localhost:5000/api/logs/${logEntry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ explanation: aiText })
    }).catch(err => console.error("Explanation save failed", err));


    // 5) Add the bot's reply to chat
    const botMessage = {
      id: Date.now() + "-bot",
      sender: "bot",
      text: aiText,
      logId: logEntry.id,
    };
    const finalMessages = [...newMessages, botMessage];
    setFeedbackStatus(null);
    setMessages(finalMessages);
    saveChatHistory(finalMessages);
  } catch (e) {
    console.error("API Error:", e);
    const errorMsg = {
      id: Date.now() + "-error",
      sender: "bot",
      text:
        "Oops! I couldn't connect. Please try again in a moment. 🙁",
      logId: logEntry.id,
    };
    setMessages([...newMessages, errorMsg]);
  }

  setIsLoading(false);
};

  const recordUnderstanding = (confused, logId) => {
    // 1) Update logs for analytics (Local UI)
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logId ? { ...log, confused } : log
      )
    );

    // 2) Update local feedback status
    setFeedbackStatus(confused ? "confused" : "got-it");

    // 3) SEND UPDATE TO BACKEND (The missing part!)
    fetch(`http://localhost:5000/api/logs/${logId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confused })
    }).catch(err => console.error("Feedback save failed", err));

    // 4) Add feedback message in chat
    setMessages((prev) => {
      const feedbackLabel = confused ? "Still confused" : "Got it";
      const studentMsg = {
        id: Date.now() + "-feedback-student",
        sender: "student",
        text: feedbackLabel,
      };

      const botMsg = {
        id: Date.now() + "-feedback-bot",
        sender: "bot",
        text: confused
          ? "Thanks for letting me know. You can ask a follow-up question or we can try a simpler example."
          : "Great! I’m glad that made sense.",
      };

      const updated = [...prev, studentMsg, botMsg];
      saveChatHistory(updated);
      return updated;
    });
  };

  const clearAllData = async () => {
    if (!confirm("Reset all data? This will delete all data from the database.")) return;
    
    // 1. Tell Server to delete everything
    try {
      await fetch("http://localhost:5000/api/reset", { method: "DELETE" });
      
      // 2. Clear Local State
      setLogs([]);
      setChatHistories({});
      alert("All data has been reset successfully!");
    } catch (e) {
      console.error("Reset failed", e);
      alert("Failed to reset database.");
    }
  };

  const hasHistory = (topicId) => {
    const key = studentName.toLowerCase() + "-" + topicId;
    return chatHistories[key]?.length > 0;
  };

  // HOME
  if (view === "home") {
    return <HomePage setView={setView} />;
  }

 // STUDENT LOGIN REPLACEMENT
  if (view === "student-login") {
    return (
      <StudentLoginPage 
        setView={setView} 
        studentName={studentName} 
        setStudentName={setStudentName} 
        handleStudentLogin={handleStudentLogin} 
        isLoading={isLoading} 
      />
    );
  }

  // TOPIC SELECT REPLACEMENT
  if (view === "topic-select") {
    return (
      <TopicSelectPage 
        setView={setView} 
        studentName={studentName} 
        handleSelectTopic={handleSelectTopic} 
        hasHistory={hasHistory} 
      />
    );
  }

  // STUDENT CHAT 
  if (view === "student-chat" && currentTopic) {
    // NOTE: Keep these local variables here, as they are calculated right before the return
    const lastBotMsgWithLog = [...messages].reverse().find((m) => m.sender === "bot" && m.logId);
    const feedbackLog =
      lastBotMsgWithLog &&
      logs.find((l) => l.id === lastBotMsgWithLog.logId);

    const feedbackGiven = !!feedbackLog && feedbackLog.confused !== null;
    
    return (
      <StudentChatPage
        messages={messages}
        isLoading={isLoading}
        currentTopic={currentTopic}
        studentName={studentName}
        setView={setView}
        handleClearChat={handleClearChat}
        editorRef={editorRef}
        keyboardVisible={keyboardVisible}
        sendMessage={sendMessage}
        handleOpenKeyboard={handleOpenKeyboard}
        lastBotMsgWithLog={lastBotMsgWithLog}
        feedbackLog={feedbackLog}
        feedbackGiven={feedbackGiven}
        recordUnderstanding={recordUnderstanding}
        messagesEndRef={messagesEndRef}
      />
    );
  }

 // TEACHER LOGIN
  if (view === "teacher-login") {
    return (
      <TeacherLoginPage 
        setView={setView} 
        teacherPass={teacherPass} 
        setTeacherPass={setTeacherPass} 
        handleTeacherLogin={handleTeacherLogin} 
      />
    );
  }

  // TEACHER DASHBOARD 
  if (view === "teacher-dashboard" && teacherAuthenticated) {
    return (
      <TeacherDashboardPage
        setView={setView}
        setTeacherAuthenticated={setTeacherAuthenticated}
        setTeacherPass={setTeacherPass}
        clearAllData={clearAllData}
        analytics={analytics}
        conceptStats={conceptStats}
        selectedStudentDetail={selectedStudentDetail}
        setSelectedStudentDetail={setSelectedStudentDetail}
        selectedStudentLogs={selectedStudentLogs}
        recentFilter={recentFilter}
        setRecentFilter={setRecentFilter}
        groupingMode={groupingMode}
        setGroupingMode={setGroupingMode}
        filteredRecent={filteredRecent}
        groupedQuestions={groupedQuestions}
        logs={logs}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <AnimatedBackground />
      <p className="text-slate-400">Loading Waybot...</p>
    </div>
  );
  // --- HELPER COMPONENT FOR DASHBOARD ---
};
