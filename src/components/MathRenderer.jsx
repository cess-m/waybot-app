import React from "react";
import { BlockMath, InlineMath } from "react-katex";

export default function MathRenderer({ text }) {
  if (!text) return null;

  // BLOCK $$...$$
  const blockRegex = /\$\$([\s\S]+?)\$\$/g;

  // INLINE \( ... \)
  const inlineRegexOld = /\\\((.+?)\\\)/g;

  // 🔥 NEW: inline $...$
  const inlineRegexDollar = /\$(.+?)\$/g;

  let parts = [];
  let lastIndex = 0;
  let match;

  // 1. PROCESS BLOCK MATH $$...$$
  while ((match = blockRegex.exec(text)) !== null) {
    parts.push(text.substring(lastIndex, match.index));
    parts.push(<BlockMath key={match.index}>{match[1]}</BlockMath>);
    lastIndex = blockRegex.lastIndex;
  }

  let remaining = text.substring(lastIndex);

  // 2. PROCESS INLINE MATH
  let inlineProcessed = [];
  let inlineLast = 0;
  let inlineMatch;

  // FIRST pass: $ ... $
  while ((inlineMatch = inlineRegexDollar.exec(remaining)) !== null) {
    inlineProcessed.push(remaining.substring(inlineLast, inlineMatch.index));
    inlineProcessed.push(
      <InlineMath key={"d" + inlineMatch.index}>
        {inlineMatch[1]}
      </InlineMath>
    );
    inlineLast = inlineRegexDollar.lastIndex;
  }

  let afterDollar = remaining.substring(inlineLast);

  // SECOND pass: \( ... \)
  let inlineProcessed2 = [];
  let inlineLast2 = 0;

  while ((inlineMatch = inlineRegexOld.exec(afterDollar)) !== null) {
    inlineProcessed2.push(afterDollar.substring(inlineLast2, inlineMatch.index));
    inlineProcessed2.push(
      <InlineMath key={"o" + inlineMatch.index}>
        {inlineMatch[1]}
      </InlineMath>
    );
    inlineLast2 = inlineRegexOld.lastIndex;
  }

  inlineProcessed2.push(afterDollar.substring(inlineLast2));

  parts.push(...inlineProcessed, ...inlineProcessed2);

  return <div className="prose text-slate-300">{parts}</div>;
}
