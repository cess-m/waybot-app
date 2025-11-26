import React from "react";

const KEYBOARD_TABS = [
  { id: "abc", label: "abc" },      // letters / basic
  { id: "sets", label: "A {" },     // sets, braces, Greek, logic
  { id: "calc", label: "f(x)" },    // numbers, operators, limits, derivatives, integrals
  { id: "trig", label: "sin(x)" },  // trig grid
];

export const KEYBOARD_KEYS = {
  // TAB 1: abc → QWERTY letters (space is handled by the big space bar below)
  abc: [
    // row 1
    { label: "q", insert: "q" },
    { label: "w", insert: "w" },
    { label: "e", insert: "e" },
    { label: "r", insert: "r" },
    { label: "t", insert: "t" },
    { label: "y", insert: "y" },
    { label: "u", insert: "u" },
    { label: "i", insert: "i" },
    { label: "o", insert: "o" },
    { label: "p", insert: "p" },

    // row 2
    { label: "a", insert: "a" },
    { label: "s", insert: "s" },
    { label: "d", insert: "d" },
    { label: "f", insert: "f" },
    { label: "g", insert: "g" },
    { label: "h", insert: "h" },
    { label: "j", insert: "j" },
    { label: "k", insert: "k" },
    { label: "l", insert: "l" },

    // row 3
    { label: "z", insert: "z" },
    { label: "x", insert: "x" },
    { label: "c", insert: "c" },
    { label: "v", insert: "v" },
    { label: "b", insert: "b" },
    { label: "n", insert: "n" },
    { label: "m", insert: "m" },
  ],

  // TAB 2: A { → sets, braces, Greek, logic
  sets: [
    { label: "{", insert: "{" },
    { label: "}", insert: "}" },
    { label: "[", insert: "[" },
    { label: "]", insert: "]" },
    { label: "(", insert: "(" },
    { label: ")", insert: ")" },

    { label: "∈", insert: "∈" },
    { label: "∉", insert: "∉" },
    { label: "⊂", insert: "⊂" },
    { label: "⊄", insert: "⊄" },
    { label: "⊆", insert: "⊆" },
    { label: "⊇", insert: "⊇" },
    { label: "∪", insert: "∪" },
    { label: "∩", insert: "∩" },

    { label: "∅", insert: "∅" },
    { label: "ℝ", insert: "ℝ" },
    { label: "ℚ", insert: "ℚ" },
    { label: "ℤ", insert: "ℤ" },
    { label: "ℕ", insert: "ℕ" },

    { label: "¬", insert: "¬" },
    { label: "∧", insert: "∧" },
    { label: "∨", insert: "∨" },
    { label: "⇒", insert: "⇒" },
    { label: "⇔", insert: "⇔" },

    { label: "α", insert: "α" },
    { label: "β", insert: "β" },
    { label: "γ", insert: "γ" },
    { label: "δ", insert: "δ" },
    { label: "θ", insert: "θ" },
    { label: "λ", insert: "λ" },
    { label: "μ", insert: "μ" },
    { label: "σ", insert: "σ" },
    { label: "Ω", insert: "Ω" },
  ],

  // TAB 3: f(x) → numbers, operators, limits, derivatives, integrals, etc.
  calc: [
    // numbers
    { label: "1", insert: "1" },
    { label: "2", insert: "2" },
    { label: "3", insert: "3" },
    { label: "4", insert: "4" },
    { label: "5", insert: "5" },
    { label: "6", insert: "6" },
    { label: "7", insert: "7" },
    { label: "8", insert: "8" },
    { label: "9", insert: "9" },
    { label: "0", insert: "0" },

    // operators & comparisons
    { label: "+", insert: "+" },
    { label: "−", insert: "−" },
    { label: "·", insert: "·" },
    { label: "÷", insert: "÷" },
    { label: "=", insert: "=" },
    { label: "<", insert: "<" },
    { label: ">", insert: ">" },
    { label: "≤", insert: "≤" },
    { label: "≥", insert: "≥" },
    { label: "≠", insert: "≠" },
    { label: "∞", insert: "∞" },

    // templates
    { label: "a/b", insert: "□/□" },
    { label: "xⁿ", insert: "x^□" },
    { label: "xₙ", insert: "x_□" },
    { label: "√x", insert: "√□" },
    { label: "ⁿ√x", insert: "√[□]□" },

    // limits
    { label: "lim", insert: "lim" },
    { label: "limₓ→a", insert: "lim x→□" },
    { label: "limₓ→∞", insert: "lim x→∞" },

    // derivatives
    { label: "d/dx", insert: "d/dx □" },
    { label: "dy/dx", insert: "dy/dx" },
    { label: "f′(x)", insert: "f′(x)" },
    { label: "∂/∂x", insert: "∂/∂x □" },

    // integrals & sums
    { label: "∫", insert: "∫ □ dx" },
    { label: "∫ₐᵇ", insert: "∫[□,□] □ dx" },
    { label: "∫₀^∞", insert: "∫[0,∞] □ dx" },
    { label: "∬", insert: "∬ □ dA" },
    { label: "∑", insert: "∑_{□}^{□} □" },
    { label: "Δx", insert: "Δx" },
  ],

  // TAB 4: sin(x) → trig grid
  trig: [
    // basic trig
    { label: "sin", insert: "sin" },
    { label: "cos", insert: "cos" },
    { label: "tan", insert: "tan" },
    { label: "cot", insert: "cot" },
    { label: "sec", insert: "sec" },
    { label: "csc", insert: "csc" },

    // inverse trig
    { label: "arcsin", insert: "arcsin" },
    { label: "arccos", insert: "arccos" },
    { label: "arctan", insert: "arctan" },
    { label: "arccot", insert: "arccot" },
    { label: "arcsec", insert: "arcsec" },
    { label: "arccsc", insert: "arccsc" },

    // trig powers
    { label: "sinⁿ", insert: "sin^□" },
    { label: "cosⁿ", insert: "cos^□" },
    { label: "tanⁿ", insert: "tan^□" },
    { label: "cotⁿ", insert: "cot^□" },
    { label: "secⁿ", insert: "sec^□" },
    { label: "cscⁿ", insert: "csc^□" },

    // hyperbolic
    { label: "sinh", insert: "sinh" },
    { label: "cosh", insert: "cosh" },
    { label: "tanh", insert: "tanh" },
    { label: "coth", insert: "coth" },
    { label: "sech", insert: "sech" },
    { label: "csch", insert: "csch" },
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
