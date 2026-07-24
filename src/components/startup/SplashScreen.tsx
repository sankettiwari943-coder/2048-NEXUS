import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2 } from 'lucide-react';
import { SoundEngine } from '../../engine/SoundEngine';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useAppFlowStore } from '../../stores/useAppFlowStore';

export const SplashScreen: React.FC = () => {
  const { setScreen } = useAppFlowStore();
  const { soundEnabled, soundVolume } = useSettingsStore();

  useEffect(() => {
    if (soundEnabled) {
      SoundEngine.playStartup(soundVolume);
    }

    const timer = setTimeout(() => {
      setScreen('loading_assets');
    }, 2500);

    return () => clearTimeout(timer);
  }, [setScreen, soundEnabled, soundVolume]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      onClick={() => setScreen('loading_assets')}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090E] text-slate-100 cursor-pointer overflow-hidden select-none"
    >
      {/* Background Animated Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-glow" />

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Main Logo Container */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center text-center p-8"
      >
        <div className="mb-4 p-4 bg-slate-900/80 border border-blue-500/40 rounded-3xl shadow-glow-blue backdrop-blur-xl">
          <Gamepad2 className="w-16 h-16 text-cyan-400 animate-pulse" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 via-purple-400 to-pink-500 drop-shadow-[0_0_35px_rgba(56,189,248,0.5)]">
          2048 <span className="text-white font-light tracking-widest uppercase text-4xl sm:text-6xl">NEXUS</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm sm:text-base text-slate-300 font-medium tracking-wide mt-3 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Beyond the Classic Puzzle Experience
          <Sparkles className="w-4 h-4 text-amber-400" />
        </motion.p>
      </motion.div>

      {/* Bottom Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-xs text-slate-400 tracking-wider font-mono uppercase"
      >
        Click anywhere or wait to start...
      </motion.div>
    </motion.div>
  );
};
