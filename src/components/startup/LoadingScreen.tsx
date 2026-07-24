import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lightbulb, Cloud, Brain, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAppFlowStore } from '../../stores/useAppFlowStore';
import { useUserStore } from '../../stores/useUserStore';

const ASSET_LOADING_STEPS = [
  'Initializing Game Engine...',
  'Loading Textures & Assets...',
  'Preparing UI Framework...',
  'Optimizing Expectimax AI...',
  'Ready...',
];

const CLOUD_SYNC_STEPS = [
  'Creating Player Profile...',
  'Saving Username & Avatar...',
  'Syncing Cloud Progress...',
  'Loading Statistics & Matches...',
  'Loading Achievements & Badges...',
  'Loading Global Leaderboards...',
  'Preparing Daily Rewards Streak...',
  'Finalizing Setup...',
];

const GAMEPLAY_TIPS = [
  'Keep your highest value tile locked in a corner to build seamless merge chains.',
  'Stuck? Activate AI Hints to see risk meters and optimal move probabilities.',
  'Log in daily to maintain your streak and claim bonus XP and exclusive themes.',
  'Timed mode gives 120 seconds to score as high as possible with merge multipliers.',
  'Challenge mode offers specific missions like reaching 512 in under 30 moves.',
];

interface LoadingScreenProps {
  mode?: 'assets' | 'cloud';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ mode = 'assets' }) => {
  const { setScreen } = useAppFlowStore();
  const { profile } = useUserStore();

  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const stepsList = mode === 'cloud' ? CLOUD_SYNC_STEPS : ASSET_LOADING_STEPS;

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * GAMEPLAY_TIPS.length));

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (mode === 'assets') {
              setScreen('auth');
            } else {
              setScreen('main_menu');
            }
          }, 350);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 18) + 6;
        const currentNext = Math.min(100, next);

        const calculatedIndex = Math.floor((currentNext / 100) * (stepsList.length - 1));
        setStepIndex(calculatedIndex);

        return currentNext;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [setScreen, mode, stepsList]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#07090E] text-slate-100 select-none overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-full blur-3xl" />

      {/* Floating Decorative Tiles in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 text-6xl font-black animate-float">2048</div>
        <div className="absolute top-1/3 right-16 text-5xl font-black animate-float" style={{ animationDelay: '1s' }}>1024</div>
        <div className="absolute bottom-20 left-20 text-5xl font-black animate-float" style={{ animationDelay: '2s' }}>512</div>
        <div className="absolute bottom-1/3 right-1/4 text-4xl font-black animate-float" style={{ animationDelay: '1.5s' }}>256</div>
      </div>

      {/* Top Brand Logo */}
      <div className="pt-8 text-center">
        <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          2048 NEXUS
        </h2>
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
          {mode === 'cloud' ? 'Cloud Sync Protocol' : 'Initializing Engine'}
        </span>
      </div>

      {/* Center Circular Progress & Step Message */}
      <div className="flex flex-col items-center justify-center my-auto text-center max-w-sm">
        {/* Spinner & Percent */}
        <div className="relative flex items-center justify-center w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-slate-800"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              className="text-cyan-400"
              strokeWidth="7"
              strokeDasharray="263.89"
              strokeDashoffset={263.89 - (263.89 * progress) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-white font-mono">{progress}%</span>
            {mode === 'cloud' && profile.username && (
              <span className="text-[10px] text-amber-300 font-bold max-w-[80px] truncate">
                {profile.username}
              </span>
            )}
          </div>
        </div>

        {/* Loading Step Text */}
        <div className="h-6 mb-4">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-cyan-300 flex items-center justify-center gap-2"
          >
            {mode === 'cloud' ? <Cloud className="w-4 h-4 text-purple-400 animate-pulse" /> : <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />}
            {stepsList[stepIndex]}
          </motion.p>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-full shadow-glow-cyan"
          />
        </div>
      </div>

      {/* Bottom Gameplay Tip Banner */}
      <div className="w-full max-w-md p-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md text-center">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5 mb-1">
          <Lightbulb className="w-3.5 h-3.5" />
          Pro Gameplay Tip
        </div>
        <p className="text-xs text-slate-300 font-medium">"{GAMEPLAY_TIPS[tipIndex]}"</p>
      </div>
    </motion.div>
  );
};
