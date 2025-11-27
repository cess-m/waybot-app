import React from "react";

const KEYBOARD_TABS = [
  { id: "abc", label: "abc" },      // letters / basic
  { id: "sets", label: "A {" },     // sets, braces, Greek, logic
  { id: "calc", label: "f(x)" },    // numbers, operators, limits, derivatives, integrals
  { id: "trig", label: "sin(x)" },  // trig grid
];

export const KEYBOARD_KEYS = {
  // TAB 1: abc → normal keyboard
  abc: [
    { label: "q", insert: "q" }, { label: "w", insert: "w" },
    { label: "e", insert: "e" }, { label: "r", insert: "r" },
    { label: "t", insert: "t" }, { label: "y", insert: "y" },
    { label: "u", insert: "u" }, { label: "i", insert: "i" },
    { label: "o", insert: "o" }, { label: "p", insert: "p" },

    { label: "a", insert: "a" }, { label: "s", insert: "s" },
    { label: "d", insert: "d" }, { label: "f", insert: "f" },
    { label: "g", insert: "g" }, { label: "h", insert: "h" },
    { label: "j", insert: "j" }, { label: "k", insert: "k" },
    { label: "l", insert: "l" },

    { label: "z", insert: "z" }, { label: "x", insert: "x" },
    { label: "c", insert: "c" }, { label: "v", insert: "v" },
    { label: "b", insert: "b" }, { label: "n", insert: "n" },
    { label: "m", insert: "m" },
  ],

  // TAB 2: A { → sets, logic, greek
  sets: [
    { label: "{", insert: "\\{" }, { label: "}", insert: "\\}" },
    { label: "[", insert: "[" },   { label: "]", insert: "]" },
    { label: "(", insert: "(" },   { label: ")", insert: ")" },

    { label: "∈", insert: "\\in" },
    { label: "∉", insert: "\\notin" },
    { label: "⊂", insert: "\\subset" },
    { label: "⊄", insert: "\\nsubseteq" },
    { label: "⊆", insert: "\\subseteq" },
    { label: "⊇", insert: "\\supseteq" },
    { label: "∪", insert: "\\cup" },
    { label: "∩", insert: "\\cap" },

    { label: "∅", insert: "\\emptyset" },
    { label: "ℝ", insert: "\\mathbb{R}" },
    { label: "ℚ", insert: "\\mathbb{Q}" },
    { label: "ℤ", insert: "\\mathbb{Z}" },
    { label: "ℕ", insert: "\\mathbb{N}" },

    { label: "¬", insert: "\\lnot" },
    { label: "∧", insert: "\\land" },
    { label: "∨", insert: "\\lor" },
    { label: "⇒", insert: "\\Rightarrow" },
    { label: "⇔", insert: "\\Leftrightarrow" },

    { label: "α", insert: "\\alpha" },
    { label: "β", insert: "\\beta" },
    { label: "γ", insert: "\\gamma" },
    { label: "δ", insert: "\\delta" },
    { label: "θ", insert: "\\theta" },
    { label: "λ", insert: "\\lambda" },
    { label: "μ", insert: "\\mu" },
    { label: "σ", insert: "\\sigma" },
    { label: "Ω", insert: "\\Omega" },
  ],

  // TAB 3: f(x) → calculus symbols
  calc: [
    // numbers
    { label: "1", insert: "1" }, { label: "2", insert: "2" },
    { label: "3", insert: "3" }, { label: "4", insert: "4" },
    { label: "5", insert: "5" }, { label: "6", insert: "6" },
    { label: "7", insert: "7" }, { label: "8", insert: "8" },
    { label: "9", insert: "9" }, { label: "0", insert: "0" },

    // operators
    { label: "+", insert: "+" },
    { label: "−", insert: "-" },
    { label: "·", insert: "*" },
    { label: "÷", insert: "/" },
    { label: "=", insert: "=" },
    { label: "<", insert: "<" },
    { label: ">", insert: ">" },
    { label: "≤", insert: "\\le" },
    { label: "≥", insert: "\\ge" },
    { label: "≠", insert: "\\ne" },
    { label: "∞", insert: "\\infty" },

    // templates → REAL LaTeX
    { label: "a/b", insert: "\\frac{}{}" },
    { label: "xⁿ", insert: "x^{}" },
    { label: "xₙ", insert: "x_{}" },
    { label: "√x", insert: "\\sqrt{}" },
    { label: "ⁿ√x", insert: "\\sqrt[]{}" },

    // limits
    { label: "lim", insert: "\\lim" },
    { label: "limₓ→a", insert: "\\lim_{x\\to }" },
    { label: "limₓ→∞", insert: "\\lim_{x\\to \\infty}" },

    // derivatives
    { label: "d/dx", insert: "\\frac{d}{dx} " },
    { label: "dy/dx", insert: "\\frac{dy}{dx}" },
    { label: "f′(x)", insert: "f'(x)" },
    { label: "∂/∂x", insert: "\\frac{\\partial}{\\partial x} " },

    // integrals & sums
    { label: "∫", insert: "\\int\\; dx" },
    { label: "∫ₐᵇ", insert: "\\int_{}^{}\\; dx" },
    { label: "∫₀^∞", insert: "\\int_{0}^{\\infty}\\; dx" },
    { label: "∬", insert: "\\iint\\; dA" },
    { label: "∑", insert: "\\sum_{}^{} " },
    { label: "Δx", insert: "\\Delta x" },
  ],

  // TAB 4: sin(x) → trig functions
  trig: [
    { label: "sin", insert: "\\sin" },
    { label: "cos", insert: "\\cos" },
    { label: "tan", insert: "\\tan" },
    { label: "cot", insert: "\\cot" },
    { label: "sec", insert: "\\sec" },
    { label: "csc", insert: "\\csc" },

    // inverse trig
    { label: "arcsin", insert: "\\arcsin" },
    { label: "arccos", insert: "\\arccos" },
    { label: "arctan", insert: "\\arctan" },
    { label: "arccot", insert: "\\arccot" },
    { label: "arcsec", insert: "\\arcsec" },
    { label: "arccsc", insert: "\\arccsc" },

    // powers
    { label: "sinⁿ", insert: "\\sin^{}" },
    { label: "cosⁿ", insert: "\\cos^{}" },
    { label: "tanⁿ", insert: "\\tan^{}" },
    { label: "cotⁿ", insert: "\\cot^{}" },
    { label: "secⁿ", insert: "\\sec^{}" },
    { label: "cscⁿ", insert: "\\csc^{}" },

    // hyperbolic
    { label: "sinh", insert: "\\sinh" },
    { label: "cosh", insert: "\\cosh" },
    { label: "tanh", insert: "\\tanh" },
    { label: "coth", insert: "\\coth" },
    { label: "sech", insert: "\\sech" },
    { label: "csch", insert: "\\csch" },
  ],
};

export default function MathKeyboard({ activeTab, setActiveTab, onInsert }) {
  return (
    <div className="mt-3 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl overflow-hidden">
      
      {/* Tabs */}
      <div className="flex text-xs border-b border-slate-800 bg-slate-900/80">
        {KEYBOARD_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={
              "flex-1 py-2 px-3 text-center transition " +
              (activeTab === tab.id
                ? "bg-slate-800 text-violet-200 border-b-2 border-violet-400 font-semibold"
                : "text-slate-400 hover:text-slate-100")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

            {/* Keys */}
      <div className="p-2 grid grid-cols-8 gap-1">
        { (KEYBOARD_KEYS[activeTab] || KEYBOARD_KEYS.abc).map((key) => (
          <button
            key={key.label + key.insert}
            onClick={() => onInsert(key.insert)}
            className="h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 
                       text-slate-100 text-sm flex items-center justify-center
                       hover:bg-violet-600/80 hover:border-violet-400 hover:text-white
                       active:scale-95 transition"
          >
            {key.label}
          </button>
        ))}
        
        {/* space bar */}
        <button
          onClick={() => onInsert(" ")}
          className="col-span-3 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80
                     text-slate-100 text-sm flex items-center justify-center
                     hover:bg-slate-700 hover:text-white active:scale-95 transition"
        >
          space
        </button>
      </div>

    </div>
  );
}
