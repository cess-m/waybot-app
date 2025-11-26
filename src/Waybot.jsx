import { useEffect, useMemo, useRef, useState } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import MathKeyboard from "./components/MathKeyboard";

const TOPICS = [
  { id: "limits", name: "Limits", description: "Behavior as x approaches a value", color: "from-sky-500 to-cyan-400", icon: "📈" },
  { id: "differentiation", name: "Differentiation", description: "Rates of change and slopes", color: "from-violet-500 to-purple-400", icon: "📐" },
  { id: "integration", name: "Integration", description: "Areas and accumulation", color: "from-emerald-500 to-teal-400", icon: "📊" },
];

const TEACHER_PASSWORD = "teacher123";
const ACTIVE_PROVIDER = "gemini"; 

const TUTOR_SYSTEM_PROMPT = `You are Waybot, an expert University-level Calculus Teaching Assistant (TA).

YOUR GOAL:
Help college students master Calculus. Your teaching style must be "Easy-to-Advanced":
1. Briefly explain the concept simply.
2. IMMEDIATELY apply it to a non-trivial, college-level function.

AUDIENCE:
- The user is a Senior High or College student. 
- Do NOT use "baby" examples like "1 + 1" or "x + 2" unless illustrating a very basic arithmetic property.
- Assume they know basic algebra. Focus on the Calculus.

CONVERSATION BEHAVIOR:
1. ADAPTIVE RESPONSES:
   - Be natural. If the student says "hey", reply based on context (e.g., "Ready to solve some problems?").
   - Do not re-introduce yourself if you already have.
2. PROGRESSION (The "Easy-to-Advanced" Rule):
   - Step 1: State the definition/rule clearly.
   - Step 2: Give a "Check" example (simple but relevant).
   - Step 3: Move to "Real" examples using:
     - Trigonometry (sin, cos, tan, sec)
     - Exponentials and Logarithms (e^x, ln x)
     - Rational functions with holes or asymptotes
     - Chain rule composites (e.g., sin(x^2))

3. SOCIAL PAUSE & REDIRECTION:
   - If the user sends a simple GREETING (e.g., "hi", "hello", "hey"): Acknowledge briefly and politely (e.g., "Hello there!"). Do NOT start teaching or give an example yet. The student must initiate the math problem.
   - If the user asks a META QUESTION (e.g., "Who are you?", "What can you do?", "Did I ask you?"): Answer briefly and non-argumentatively, then immediately redirect them back to the math topic.
   - Example response to Meta: "I'm Waybot, your Calculus TA. Are you ready to start on Limits?"


4. HANDLING MATH REQUESTS:
   - If they ask "teach me", start the lesson immediately.
   - If they give a problem, solve it step-by-step.
   - If the student says "I don't know", "idk", or gives a wrong answer:
     - Do NOT say "That's right" or "Great job".
     - Instead, acknowledge the gap simply (e.g., "That's okay," or "Let's figure it out together") and then explain the next step.

5. HANDLING INVALID INPUT:
   - If the student sends gibberish, nonsensical short phrases, or spam (e.g., "dddd", "ss", "jajaja"):
     - Do NOT try to start a lesson or interpret it as a math question.
     - Reply with a brief, polite social response asking them to clarify their math question.
     - Example: "I didn't quite catch that. Could you please type out your question about Calculus?"

6. ON RECEIVING FEEDBACK (ACTIONABLE FLOW):
   - If the student's last message was the system-generated response "I got it!":
     - Acknowledge their success briefly and move immediately to the next example or the next major step in the problem.
     - You MUST advance the lesson; do NOT re-explain the previous point.
   - If the student's last message was the system-generated response "I'm still confused.":
     - Acknowledge their confusion and apologize.
     - Immediately rephrase the previous explanation using simpler language or ask them which specific part (e.g., the algebra, the rule, the concept) is unclear.

TEACHING STYLE:
1. Keep replies concise (under 100 words).
2. Use standard mathematical terminology (e.g., "As x approaches infinity...", "Using the Chain Rule...").
3. When asking a question, challenge them.
   - Bad: "What is 2 + 2?"
   - Good: "If we plug in 0, we get 0/0. What technique should we use here?"
4. Break complex problems into 2-3 steps. Do not dump the whole solution.
5. **CHECK FOR UNDERSTANDING (STRATEGIC & ACTIONABLE):**
   - Do NOT ask "Does this make sense?" after simple greetings or short answers.
   - ONLY ask when:
     a. You have just explained a difficult concept.
     b. You have completed a major step in a calculation.
     c. The student was previously confused.
   - **CRITICAL:** When you DO check in, explicitly guide them to the UI.
   - Example phrase: "Are you following this step? (Please click **Got it** or **Still confused**)."
   - This ensures the student knows to use the buttons to proceed.

FORMATTING RULES (CRITICAL FOR MATH):
- Use PLAIN TEXT for conversation.
- Use LaTeX for ALL math equations.
- Do NOT use asterisks (**) for bolding. Do NOT use italics.
- STRICTLY follow these LaTeX rules:
  - Inline math: $f(x) = x^2$ (Single dollar signs)
  - Block math (for major steps):
    $$ \lim_{x \to 0} \frac{\sin(x)}{x} $$
  - Fractions: Use \\frac{a}{b}
  - Roots: Use \\sqrt{x}
  - ESCAPE BACKSLASHES: You must write \\frac, \\sqrt, \\int.

EXAMPLE INTERACTION:
Student: "Teach me limits."
Waybot: "A limit asks what value a function approaches as x gets closer to a specific point, even if it doesn't reach it.
For example, take the classic indeterminate form:
$$ \lim_{x \to 0} \frac{\sin(x)}{x} $$
If we plug in 0 directly, we get $\frac{0}{0}$, which is undefined. Do you remember what this specific limit evaluates to, or should we look at the graph?"

CRITICAL RULES:
- Never just drop the final answer without explanation.
- Always guide the student through the reasoning.
- If the student goes off-topic (non-calculus), briefly respond and gently redirect back to Calculus.`;

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
    <div className="absolute top-0 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-900/50 rounded-full blur-3xl" />
  </div>
);

async function callLLM(provider, { cleanMessages, questionText, studentName, currentTopic }) {
  if (provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + import.meta.env.VITE_OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        max_tokens: 800,
        messages: [
          {
            role: "system",
            content:
              TUTOR_SYSTEM_PROMPT +
              "\n\nStudent: " +
              studentName +
              "\nTopic: " +
              (currentTopic?.name || ""),
          },
          ...(cleanMessages.length
            ? cleanMessages
            : [{ role: "user", content: questionText }]),
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenAI raw response:", data);

    const aiText =
      data.choices?.[0]?.message?.content ||
      "Hmm, I'm having trouble thinking right now. Can you try asking again?";
    return aiText;
  }

  if (provider === "claude") {
    // to be implemented later
    throw new Error("Claude provider not set up yet.");
  }

  if (provider === "gemini") {
  const geminiEndpoint =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
  import.meta.env.VITE_GEMINI_API_KEY;

  const promptText =
    TUTOR_SYSTEM_PROMPT +
    "\n\nStudent: " +
    studentName +
    "\nTopic: " +
    (currentTopic?.name || "") +
    "\n\nConversation:\n" +
    (
      cleanMessages.length
        ? cleanMessages.map((m) => `${m.role}: ${m.content}`).join("\n")
        : "user: " + questionText
    );

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

  const aiText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Hmm, I'm having trouble thinking right now. Can you try asking again?";

  return aiText;
}


  throw new Error("Unknown provider: " + provider);
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

  const handleSelectTopic = async (topicId) => {
    setSelectedTopic(topicId);
    const historyKey = studentName.toLowerCase() + "-" + topicId;
    
    try {
      // Get chat history from your server
      const res = await fetch(`http://localhost:5000/api/chat/${historyKey}`);
      const savedMsgs = await res.json();
      
      if (savedMsgs && savedMsgs.length > 0) {
        setMessages(savedMsgs);
      } else {
        const topicName = TOPICS.find((t) => t.id === topicId)?.name;
        setMessages([{ 
          id: "welcome", 
          sender: "bot", 
          text: "Hello " + studentName + ". I'm ready to help you master " + topicName + ". \n\nWhat's on your mind?" 
        }]);
      }
    } catch (e) { console.error(e); }
    
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
    // default: append at the end if the ref is missing
    if (!inputRef.current) {
      setInput((prev) => prev + snippet);
      return;
    }

    const el = inputRef.current;
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;

    const nextValue = input.slice(0, start) + snippet + input.slice(end);
    setInput(nextValue);

    // put cursor after the inserted text
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

    const sendMessage = async () => {
    if (!input.trim() || !selectedTopic || isLoading) return;

    // 1) Add the student's message to the UI
    const userMessage = {
      id: Date.now() + "-user",
      sender: "student",
      text: input.trim(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const questionText = input.trim();
    setInput("");
    setIsLoading(true);

    // 2) Log this question for analytics
    // ... inside sendMessage ...
    const logEntry = {
      // ... keep your existing logEntry fields ...
      id: Date.now().toString(), // Ensure ID is string for consistency
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

    // ... continue with API call ...

    try {
      // 3) Convert messages into generic chat format
      const apiMessages = newMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.sender === "student" ? "user" : "assistant",
          content: m.text,
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

      // 4) Call the active LLM (Gemini, because ACTIVE_PROVIDER = "gemini")
      const aiText = await callLLM(ACTIVE_PROVIDER, {
        cleanMessages,
        questionText,
        studentName,
        currentTopic,
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
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <AnimatedBackground />
        
        {/* Header */}
        <header className="relative z-10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎓</span>
              </div>
              <span className="text-xl font-bold text-white">Waybot</span>
            </div>
            <button 
              onClick={() => setView("teacher-login")} 
              className="flex items-center gap-2 p-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition text-sm font-medium" 
              title="Teacher Portal Access"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 13.5v6.75a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.25v-6.75ZM15 6.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM9 6.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              </svg>
              Teacher Portal
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
              AI-Powered Learning
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Master Calculus
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Step by Step
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Your personal AI tutor that guides you through every problem, teaching the process, not just the answer.
            </p>

            {/* CTA Button */}
            <button 
              onClick={() => setView("student-login")}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all"
            >
              Start Learning Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
              {[
                { icon: "📈", title: "Limits", desc: "Master foundational concepts" },
                { icon: "📐", title: "Differentiation", desc: "Understand rates of change" },
                { icon: "📊", title: "Integration", desc: "Calculate areas & accumulation" },
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="group p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 hover:border-violet-500/50 transition-all"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Social Proof / Stats */}
            <div className="flex justify-center gap-12 mt-16 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-slate-500 text-sm">Available</div>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">∞</div>
                <div className="text-slate-500 text-sm">Practice Problems</div>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">3</div>
                <div className="text-slate-500 text-sm">Core Topics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-6 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div>© 2025 Waybot. Built for STEM students.</div>
            <div className="flex items-center gap-6">
              <span>Powered by AI</span>
              <span>•</span>
              <span>No account required</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // STUDENT LOGIN
  if (view === "student-login") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <AnimatedBackground />
        <div className="w-full max-w-sm">
          <button onClick={() => setView("home")} className="group p-2 -ml-2 rounded-lg hover:bg-slate-800 transition text-sm text-slate-500 hover:text-white mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
          <p className="text-slate-400 mb-8">Enter your name to start learning</p>
          <input type="text" placeholder="Your name or student ID" value={studentName} onChange={(e) => setStudentName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()} className="w-full px-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition mb-4" autoFocus />
          <button onClick={handleStudentLogin} disabled={!studentName.trim()} className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-xl shadow-violet-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Continue
          </button>
        </div>
      </div>
    );
  }

  // TOPIC SELECT
  if (view === "topic-select") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <AnimatedBackground />
        <div className="w-full max-w-md">
          <button onClick={() => setView("student-login")} className="group p-2 -ml-2 rounded-lg hover:bg-slate-800 transition text-sm text-slate-500 hover:text-white mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Hi {studentName}! 👋</h2>
          <p className="text-slate-400 mb-8">What would you like to learn today?</p>
          <div className="space-y-3">
            {TOPICS.map((topic) => (
              <button key={topic.id} onClick={() => handleSelectTopic(topic.id)} className="w-full text-left rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80 transition-all p-4 flex items-center gap-4 group">
                <div className={"w-12 h-12 rounded-xl bg-gradient-to-br " + topic.color + " flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform"}>
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white group-hover:text-violet-300 transition">{topic.name}</span>
                    {hasHistory(topic.id) && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">Continue</span>}
                  </div>
                  <span className="text-sm text-slate-400">{topic.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STUDENT CHAT
  if (view === "student-chat" && currentTopic) {
    const lastBotMsgWithLog = [...messages].reverse().find((m) => m.sender === "bot" && m.logId);
    const feedbackLog =
      lastBotMsgWithLog &&
      logs.find((l) => l.id === lastBotMsgWithLog.logId);

    const feedbackGiven = !!feedbackLog && feedbackLog.confused !== null;

    return (
      /* FIX 1: 'fixed inset-0' locks the app to the window edges so the header CANNOT scroll away. */
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-950">
        <AnimatedBackground />

        {/* Custom Scrollbar Styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(148, 163, 184, 0.4);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(148, 163, 184, 0.6);
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.4) transparent;
          }
        `}</style>

        {/* HEADER: flex-shrink-0 keeps it from squishing */ }
        <div className="flex-shrink-0 px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center gap-3 relative z-10">
          {/* NEW: Professional Back Button (SVG) */}
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
          
          <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + currentTopic.color + " flex items-center justify-center text-xl shadow-lg"}>
            {currentTopic.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-white font-semibold">{currentTopic.name} Tutor</h1>
            <p className="text-slate-500 text-xs">Learning with {studentName}</p>
          </div>
          {/* NEW: Clear Chat Button (Pro SVG Version) */}
          <button 
            onClick={handleClearChat}
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

        {/* FIX 2: Added 'min-h-0'. 
           This is crucial! It stops the long text from expanding the container beyond the screen height. 
           It forces the 'overflow-y-auto' to work correctly. */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 custom-scrollbar relative z-0">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={"flex " + (m.sender === "student" ? "justify-end" : "justify-start")}>
                <div className={"max-w-[85%] rounded-2xl px-4 py-3 " + (m.sender === "student" ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-md" : "bg-slate-800/80 text-slate-100 rounded-bl-md border border-slate-700/50")}>
                 {/* We add .replace to strip asterisks automatically */}
                  {/* Replace /\*+/g removes ALL asterisks (single or double) */}
                    {m.text.replace(/\*+/g, "").split("\n").map((line, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                      <Latex>{line}</Latex>
                    </p>
                  ))}
                </div>
              </div>
            ))}
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

        {/* INPUT AREA: flex-shrink-0 ensures it stays FIXED at the bottom */}
        <div className="flex-shrink-0 p-4 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              {/* Keyboard toggle button */}
              <button
                type="button"
                onClick={() => setShowKeyboard((prev) => !prev)}
                className="hidden sm:flex items-center justify-center h-12 w-12 rounded-xl
                          bg-slate-800/80 border border-slate-700 text-slate-300
                          hover:bg-slate-700 hover:text-white transition"
                title="Toggle math keyboard"
              >
                {/* small keyboard icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5"
                    className="w-5 h-5">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M7 10h2M11 10h2M15 10h2M7 14h2M11 14h2M15 14h2" />
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700
                          text-white placeholder:text-slate-500 focus:outline-none
                          focus:ring-2 focus:ring-violet-500 disabled:opacity-50 transition"
              />

              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600
                          text-white font-medium shadow-lg shadow-violet-500/25
                          disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </div>
            {showKeyboard && (
              <MathKeyboard
                activeTab={activeKeyboardTab}
                setActiveTab={setActiveKeyboardTab}
                onInsert={handleInsertFromKeyboard}
              />
            )}
            {lastBotMsgWithLog && (
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-slate-500">
                  {feedbackGiven
                    ? feedbackLog?.confused
                      ? "You marked this explanation as still confusing."
                      : "You marked this explanation as clear."
                    : "How was that explanation?"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      recordUnderstanding(false, lastBotMsgWithLog.logId)
                    }
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
                    onClick={() =>
                      recordUnderstanding(true, lastBotMsgWithLog.logId)
                    }
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
            )}
          </div>
        </div>
      </div>
    );
  }

  // TEACHER LOGIN
  if (view === "teacher-login") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <AnimatedBackground />
        <div className="w-full max-w-sm">
          <button onClick={() => setView("home")} className="group p-2 -ml-2 rounded-lg hover:bg-slate-800 transition text-sm text-slate-500 hover:text-white mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Teacher Portal</h2>
          <p className="text-slate-400 mb-8">Enter password to access analytics</p>
          <input type="password" placeholder="Portal password" value={teacherPass} onChange={(e) => setTeacherPass(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && teacherPass === TEACHER_PASSWORD) { setTeacherAuthenticated(true); setView("teacher-dashboard"); }}} className="w-full px-4 py-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition mb-4" autoFocus />
          <button onClick={() => { if (teacherPass === TEACHER_PASSWORD) { setTeacherAuthenticated(true); setView("teacher-dashboard"); }}} className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-xl shadow-violet-500/25 transition-all">
            Access Dashboard
          </button>
          <p className="text-slate-600 text-xs text-center mt-4">Demo: teacher123</p>
        </div>
      </div>
    );
  }

  // TEACHER DASHBOARD
  if (view === "teacher-dashboard" && teacherAuthenticated) {
    return (
      <div className="min-h-screen p-4 sm:p-6 relative">
        <AnimatedBackground />
        <div className="max-w-5xl mx-auto">
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
                  {/* NEW: Student drill-down panel */}
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

          {/* RECENT QUESTIONS PANEL (UPDATED) */}
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <AnimatedBackground />
      <p className="text-slate-400">Loading Waybot...</p>
    </div>
  );
  // --- HELPER COMPONENT FOR DASHBOARD ---
};

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
