import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'purple' | 'gold' | 'cyan' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  hoverEffect = false,
  ...props
}) => {
  const glowStyles = {
    blue: 'border-blue-500/30 shadow-glow-blue',
    purple: 'border-purple-500/30 shadow-glow-purple',
    gold: 'border-amber-500/30 shadow-glow-gold',
    cyan: 'border-cyan-500/30 shadow-glow-cyan',
    none: 'border-slate-800/80 shadow-glass',
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`bg-slate-900/70 backdrop-blur-xl border rounded-2xl p-5 text-slate-100 ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
