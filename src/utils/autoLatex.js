// Auto-wrap math-looking lines in $ ... $ so KaTeX formats them
export function autoLatex(line) {
  const trimmed = line.trim();
  if (!trimmed) return "";

  // Do NOT convert if it has normal sentence punctuation or letters only
  if (/^[a-zA-Z\s]+$/.test(trimmed)) {
    return trimmed;   // <-- important fix
  }

  // Do NOT convert if it's clearly conversational
  if (/\b(hi|hello|hey|sad|tired|help|please|sorry|ok|yes|no)\b/i.test(trimmed)) {
    return trimmed;
  }

  // If it already contains LaTeX syntax
  if (trimmed.includes("$") || /\\[a-zA-Z]+/.test(trimmed)) {
    return trimmed;
  }

  // Pure math pattern
  const mathPattern = /^[0-9+\-*/^_=()<>∞→−\s.x]+$/i;

  if (mathPattern.test(trimmed)) {
    return `$${trimmed}$`;
  }

  return trimmed;
}