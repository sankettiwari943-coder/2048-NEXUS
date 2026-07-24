import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Brain, AlertTriangle, Sparkles } from 'lucide-react';
import { HintResult, Direction } from '../../types/game';

interface AIHintOverlayProps {
  hint: HintResult | null;
}

export const AIHintOverlay: React.FC<AIHintOverlayProps> = ({ hint }) => {
  if (!hint || !hint.bestMove) return null;

  const renderArrowIcon = (dir: Direction) => {
    switch (dir) {
      case 'UP': return <ArrowUp className="w-12 h-12 text-cyan-400 animate-bounce" />;
      case 'DOWN': return <ArrowDown className="w-12 h-12 text-cyan-400 animate-bounce" />;
      case 'LEFT': return <ArrowLeft className="w-12 h-12 text-cyan-400 animate-bounce" />;
      case 'RIGHT': return <ArrowRight className="w-12 h-12 text-cyan-400 animate-bounce" />;
    }
  };

  const riskColors = {
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-between p-4 bg-black/40 backdrop-blur-[2px] rounded-3xl border-2 border-cyan-500/50 shadow-glow-cyan"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between w-full px-4 py-2 bg-[#0F172A]/90 rounded-2xl border border-cyan-500/30">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Nexus AI Engine</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${riskColors[hint.riskLevel]}`}>
            {hint.riskLevel.toUpperCase()} RISK
          </span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {hint.winProbability}% Win Prob
          </span>
        </div>
      </div>

      {/* Center Direction Arrow */}
      <div className="flex flex-col items-center justify-center p-4 bg-cyan-950/70 border border-cyan-400/40 rounded-full shadow-glow-cyan">
        {renderArrowIcon(hint.bestMove)}
        <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest mt-1">
          SWIPE {hint.bestMove}
        </span>
      </div>

      {/* Bottom Move Info */}
      <div className="px-4 py-1.5 bg-[#0F172A]/90 rounded-xl border border-cyan-500/30 text-xs font-medium text-slate-300">
        Immediate Gain: <span className="text-amber-400 font-bold">+{hint.scoreGain} pts</span>
      </div>
    </motion.div>
  );
};
