import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, Mail, ShieldCheck, ArrowRight, Sparkles, Gamepad2 } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useAppFlowStore } from '../../stores/useAppFlowStore';
import { AuthProviderType } from '../../types/game';
import { Button } from '../ui/Button';

export const AuthScreen: React.FC = () => {
  const { profile, setAuthProvider } = useUserStore();
  const { setScreen } = useAppFlowStore();

  const [emailInput, setEmailInput] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);

  const isReturningUser = profile.hasCompletedOnboarding && profile.username.trim().length > 0;

  const handleSelectProvider = (provider: AuthProviderType) => {
    setAuthProvider(provider);
    if (isReturningUser) {
      setScreen('cloud_sync');
    } else {
      setScreen('username_setup');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setAuthProvider('email');
    if (isReturningUser) {
      setScreen('cloud_sync');
    } else {
      setScreen('username_setup');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090E] text-slate-100 overflow-y-auto select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />

      {/* Main Glass Card Container */}
      <div className="relative w-full max-w-md bg-[#0F172A]/90 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black backdrop-blur-xl text-center my-auto">
        {/* Top Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-blue-500/10 text-cyan-400 rounded-2xl border border-blue-500/30 mb-3 shadow-glow-blue">
            <Gamepad2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">2048 Nexus</span>
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-2 leading-relaxed">
            Sign in to save your progress across all your devices, compete on leaderboards, unlock achievements, and access cloud saves.
          </p>
        </div>

        {/* RETURNING PLAYER SCREEN */}
        {isReturningUser ? (
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg border border-purple-400/40">
              {profile.avatar}
            </div>
            <h3 className="text-lg font-black text-white">
              Welcome Back, <span className="text-amber-300">{profile.username}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">Level {profile.level} • {profile.rank} Rank</p>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setScreen('cloud_sync')}
              icon={<ArrowRight className="w-5 h-5" />}
              fullWidth
            >
              Continue Playing
            </Button>
          </div>
        ) : (
          /* NEW PLAYER AUTHENTICATION OPTIONS */
          <div className="space-y-2.5 mb-6">
            {/* Continue as Guest */}
            <button
              onClick={() => handleSelectProvider('guest')}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <span>Continue as Guest</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Play Now</span>
            </button>

            {/* Google */}
            <button
              onClick={() => handleSelectProvider('google')}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 text-red-400 rounded-xl group-hover:scale-110 transition-transform font-bold">
                  G
                </div>
                <span>Sign in with Google</span>
              </div>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>

            {/* Google Play Games */}
            <button
              onClick={() => handleSelectProvider('play_games')}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <span>Sign in with Google Play Games</span>
              </div>
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSelectProvider('apple')}
              className="w-full flex items-center justify-between p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-400/50 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 text-white rounded-xl group-hover:scale-110 transition-transform font-mono">
                  
                </div>
                <span>Sign in with Apple</span>
              </div>
            </button>

            {/* Email Option Toggle */}
            {!showEmailField ? (
              <button
                onClick={() => setShowEmailField(true)}
                className="w-full flex items-center justify-between p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>Sign in with Email</span>
                </div>
              </button>
            ) : (
              <form onSubmit={handleEmailSubmit} className="p-3 bg-slate-950 border border-purple-500/40 rounded-2xl">
                <label className="block text-left text-[11px] font-bold text-slate-400 mb-1">Enter your Email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="player@nexus.com"
                    required
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <Button variant="secondary" size="sm" type="submit">
                    Next
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Encrypted Cloud Authentication Protocol
        </div>
      </div>
    </motion.div>
  );
};
