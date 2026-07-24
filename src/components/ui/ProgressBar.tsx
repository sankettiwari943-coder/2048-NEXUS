import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  sublabel?: string;
  gradient?: 'blue-purple' | 'amber-yellow' | 'pink-purple' | 'cyan-emerald';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  sublabel,
  gradient = 'blue-purple',
  showPercentage = false,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / (max || 1)) * 100)));

  const gradients = {
    'blue-purple': 'from-blue-500 to-purple-600 shadow-[0_0_12px_rgba(59,130,246,0.5)]',
    'amber-yellow': 'from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    'pink-purple': 'from-pink-500 to-purple-600 shadow-[0_0_12px_rgba(236,72,153,0.5)]',
    'cyan-emerald': 'from-cyan-400 to-emerald-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
  };

  return (
    <div className="w-full">
      {(label || sublabel || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="font-semibold text-slate-200">{label}</span>
          <span className="text-slate-400">
            {sublabel || `${current} / ${max}`} {showPercentage && `(${percentage}%)`}
          </span>
        </div>
      )}

      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${gradients[gradient]}`}
        />
      </div>
    </div>
  );
};
