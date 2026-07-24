import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { SoundEngine } from '../../engine/SoundEngine';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  const { soundEnabled, soundVolume } = useSettingsStore();

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30',
    accent: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-semibold shadow-lg shadow-amber-500/25 border border-amber-300/40',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 border border-red-400/30',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/50',
    glass: 'bg-slate-800/40 hover:bg-slate-700/60 text-slate-100 backdrop-blur-md border border-slate-700/60 shadow-glass',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-3 text-base font-bold rounded-2xl gap-2.5',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEnabled) SoundEngine.playClick(soundVolume);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
