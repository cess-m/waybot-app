import React from "react";

export const KEYBOARD_TABS = [
  { id: "basic", label: "abc" },
  { id: "func", label: "f(x)" },
  { id: "greek", label: "y" },
  { id: "calc", label: "x²" },
];

export const KEYBOARD_KEYS = {
   basic: [
    { label: "(", insert: "(" },
    { label: ")", insert: ")" },
    { label: "[", insert: "[" },
    { label: "]", insert: "]" },
    { label: "x", insert: "x" },
    { label: "y", insert: "y" },
    { label: "z", insert: "z" },
    { label: "=", insert: "=" },
    { label: "+", insert: "+" },
    { label: "−", insert: "−" },     // exact minus
    { label: "·", insert: "·" },     // dot
    { label: "÷", insert: "÷" },
    { label: "<", insert: "<" },
    { label: ">", insert: ">" },
    { label: "≤", insert: "≤" },
    { label: "≥", insert: "≥" },
    { label: "≠", insert: "≠" },
    { label: "∞", insert: "∞" },
  ],

  func: [
    { label: "f(x)", insert: "f(x)" },
    { label: "g(x)", insert: "g(x)" },
    { label: "√", insert: "√" },
    { label: "∛", insert: "∛" },
    { label: "ln", insert: "ln" },
    { label: "log", insert: "log" },
    { label: "eˣ", insert: "e^x" },
    { label: "sin", insert: "sin" },
    { label: "cos", insert: "cos" },
    { label: "tan", insert: "tan" },
    { label: "π", insert: "π" },
  ],

  greek: [
    { label: "α", insert: "α" },
    { label: "β", insert: "β" },
    { label: "γ", insert: "γ" },
    { label: "δ", insert: "δ" },
    { label: "θ", insert: "θ" },
    { label: "λ", insert: "λ" },
    { label: "μ", insert: "μ" },
    { label: "σ", insert: "σ" },
  ],

  // NEW: Calculus tab
  calc: [
  // powers
  { label: "x²", insert: "x²" },
  { label: "x³", insert: "x³" },
  { label: "xⁿ", insert: "xⁿ" },

  // limits
  { label: "lim", insert: "lim □ → □" },
  { label: "lim a→b", insert: "lim □ → □" },
  { label: "lim ∞", insert: "lim x → ∞" },

  // arrows
  { label: "→", insert: "→" },
  { label: "⇒", insert: "⇒" },

  // derivatives
  { label: "d/dx", insert: "d/dx □" },
  { label: "dy/dx", insert: "dy/dx" },
  { label: "f′(x)", insert: "f′(x)" },
  { label: "∂/∂x", insert: "∂/∂x □" },

  // integrals
  { label: "∫", insert: "∫ □ dx" },
  { label: "∫ₐᵇ", insert: "∫□ to □ □ dx" }, 
  { label: "∫₀^∞", insert: "∫₀ to ∞ □ dx" },
  { label: "∬", insert: "∬ □ dA" },

  // sums / deltas
  { label: "∑", insert: "∑□ to □ □" },
  { label: "Δx", insert: "Δx" },
]

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
        {KEYBOARD_KEYS[activeTab].map((key) => (
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
