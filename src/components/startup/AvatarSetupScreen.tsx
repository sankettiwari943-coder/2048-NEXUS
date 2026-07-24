import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Check, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useAppFlowStore } from '../../stores/useAppFlowStore';
import { Button } from '../ui/Button';

const AVATAR_CATEGORIES = [
  { name: 'Default', items: ['🚀', '⚡', '🔮', '🛡️', '👑', '🔥'] },
  { name: 'AI & Cyber', items: ['🤖', '🧠', '👾', '💻', '🔮', '⚡'] },
  { name: 'Minimal', items: ['☯️', '💎', '💠', '⚙️', '🛡️', '💫'] },
  { name: 'Retro Arcade', items: ['👾', '🕹️', '🎯', '🎮', '🎲', '🏆'] },
  { name: 'Mythic Beast', items: ['🐉', '🦊', '🦅', '🐲', '🐺', '🦁'] },
];

export const AvatarSetupScreen: React.FC = () => {
  const { profile, setAvatar, completeOnboarding } = useUserStore();
  const { setScreen } = useAppFlowStore();

  const [selected, setSelected] = useState(profile.avatar || '🚀');
  const [activeCategory, setActiveCategory] = useState(0);

  const handleContinue = () => {
    setAvatar(selected);
    completeOnboarding();
    setScreen('cloud_sync');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090E] text-slate-100 overflow-y-auto select-none"
    >
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />

      {/* Main Container */}
      <div className="relative w-full max-w-md bg-[#0F172A]/90 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black backdrop-blur-xl text-center my-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center text-5xl shadow-glow-purple border-2 border-purple-300 mb-3">
            {selected}
          </div>
          <h2 className="text-2xl font-black text-white">Choose Your Avatar</h2>
          <p className="text-xs text-slate-400 mt-1">Select an icon to represent <span className="text-amber-300 font-bold">{profile.username}</span>.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar pb-1">
          {AVATAR_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === idx
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Avatars Grid */}
        <div className="grid grid-cols-6 gap-2.5 mb-6 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
          {AVATAR_CATEGORIES[activeCategory].items.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelected(emoji)}
              className={`p-2.5 text-2xl rounded-xl border transition-all cursor-pointer ${
                selected === emoji
                  ? 'bg-purple-600/30 border-purple-400 scale-110 shadow-glow-purple'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          icon={<ArrowRight className="w-5 h-5" />}
          fullWidth
        >
          Finalize Setup & Sync Cloud
        </Button>
      </div>
    </motion.div>
  );
};
