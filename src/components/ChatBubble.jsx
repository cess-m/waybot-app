import React from 'react';
import Latex from "react-latex-next";
import { marked } from "marked";
import { autoLatex } from "../utils/autoLatex";

const ChatBubble = ({ m }) => {
  const isStudent = m.sender === "student";

  const bubbleClasses = isStudent
    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-md"
    : "bg-slate-800/80 text-slate-100 rounded-bl-md border border-slate-700/50";
  
  const layoutClasses = isStudent
    ? "justify-end"
    : "justify-start";

  return (
  <div className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 ${bubbleClasses}`}>
    {m.html
      ? (
          <div
            className="prose prose-invert"
            dangerouslySetInnerHTML={{ __html: m.html }}
            style={{ lineHeight: "1.7", fontSize: "1rem" }}
          />
        )
      : m.text.split("\n").map((line, idx) => (
          <p key={idx} className={idx > 0 ? "mt-4" : ""} style={{ lineHeight: "1.7" }}>
            <Latex>{autoLatex(line)}</Latex>
          </p>
        ))
    }
  </div>
);

};

export default ChatBubble;