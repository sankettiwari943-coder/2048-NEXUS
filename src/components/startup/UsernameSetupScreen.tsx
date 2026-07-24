import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Dices, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useAppFlowStore } from '../../stores/useAppFlowStore';
import { Button } from '../ui/Button';

export const UsernameSetupScreen: React.FC = () => {
  const { profile, setUsername, validateUsername, generateRandomUsername } = useUserStore();
  const { setScreen } = useAppFlowStore();

  const [inputVal, setInputVal] = useState(profile.username || generateRandomUsername());

  const validation = validateUsername(inputVal);

  const handleRandomize = () => {
    const randomName = generateRandomUsername();
    setInputVal(randomName);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.valid) return;

    setUsername(inputVal.trim());
    setScreen('avatar_setup');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090E] text-slate-100 overflow-y-auto select-none"
    >
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl" />

      {/* Setup Card */}
      <div className="relative w-full max-w-md bg-[#0F172A]/90 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black backdrop-blur-xl text-center my-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-4xl shadow-glow-blue border border-purple-400/40 mb-3">
            {profile.avatar}
          </div>
          <h2 className="text-2xl font-black text-white">Create Player Display Name</h2>
          <p className="text-xs text-slate-400 mt-1">Choose your unique handle for leaderboards & multiplayer.</p>
        </div>

        {/* Username Form */}
        <form onSubmit={handleContinue} className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Username"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3.5 pr-12 bg-slate-950 border border-slate-700 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            {/* Randomize Dice Button */}
            <button
              type="button"
              onClick={handleRandomize}
              className="absolute right-3 top-2.5 p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl transition-all cursor-pointer"
              title="Generate Random Username"
            >
              <Dices className="w-5 h-5" />
            </button>
          </div>

          {/* Validation Feedback */}
          <div className="h-5 text-left flex items-center gap-1.5 text-xs">
            {validation.valid ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Username is available!
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {validation.error}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={!validation.valid}
            icon={<ArrowRight className="w-5 h-5" />}
            fullWidth
          >
            Continue to Avatar Selection
          </Button>
        </form>
      </div>
    </motion.div>
  );
};
