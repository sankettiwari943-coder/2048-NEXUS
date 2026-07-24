import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, Brain, Trophy, Shield, ArrowRight } from 'lucide-react';
import { useAppFlowStore } from '../../stores/useAppFlowStore';
import { Button } from '../ui/Button';

export const WelcomeScreen: React.FC = () => {
  const { setScreen } = useAppFlowStore();

  const handleComplete = () => {
    setScreen('main_menu');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090E] text-slate-100 overflow-y-auto select-none"
    >
      <div className="relative w-full max-w-lg bg-[#0F172A]/90 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black backdrop-blur-xl text-center my-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-blue-500/10 text-cyan-400 rounded-2xl border border-blue-500/30 mb-3 shadow-glow-blue">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">2048 Nexus</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">Your next-generation puzzle matrix journey starts now.</p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Merge & Scale</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Combine matching tiles to reach 2048 and beyond.</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">AI Hint Engine</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Expectimax AI analyzes risk and optimal swipes.</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Leaderboards</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Compete globally, by country, or with friends.</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">8 Visual Themes</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Switch between Cyberpunk, Neon, Galaxy & Retro.</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="ghost" size="md" onClick={handleComplete} fullWidth>
            Skip Tutorial
          </Button>
          <Button variant="primary" size="md" onClick={handleComplete} icon={<ArrowRight className="w-4 h-4" />} fullWidth>
            Enter Nexus Main Menu
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
