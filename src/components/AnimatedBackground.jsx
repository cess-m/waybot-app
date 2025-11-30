import React from 'react';

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
    <div className="absolute top-0 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-900/50 rounded-full blur-3xl" />
  </div>
);

export default AnimatedBackground;