import React from 'react';
import { Keyboard, MousePointer, Smartphone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 w-full max-w-md mx-auto px-4 py-4 text-center select-none">
      <div className="flex items-center justify-center gap-4 text-slate-400 text-xs mb-2">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3.5 h-3.5 text-blue-400" /> WASD / Arrows
        </span>
        <span className="flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-purple-400" /> Touch Swipe
        </span>
        <span className="flex items-center gap-1">
          <MousePointer className="w-3.5 h-3.5 text-cyan-400" /> Drag
        </span>
      </div>

      <p className="text-[11px] text-slate-500 font-medium">
        2048 Nexus — Beyond the Classic Puzzle Experience. Built for Web & Mobile.
      </p>
    </footer>
  );
};
