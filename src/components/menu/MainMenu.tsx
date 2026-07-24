import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Gamepad2,
  User,
  Award,
  Trophy,
  BarChart2,
  Gift,
  Palette,
  Settings,
  HelpCircle,
  Code2,
  Sparkles,
  Shield,
  Cloud,
  Coins,
  LogOut,
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useStatsStore } from '../../stores/useStatsStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useAppFlowStore } from '../../stores/useAppFlowStore';
import { SoundEngine } from '../../engine/SoundEngine';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface MainMenuProps {
  onOpenPlayModal: () => void;
  onOpenProfileModal: () => void;
  onOpenStatsModal: () => void;
  onOpenAchievementsModal: () => void;
  onOpenLeaderboardModal: () => void;
  onOpenDailyModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenHelpModal: () => void;
  onOpenCreditsModal: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onOpenPlayModal,
  onOpenProfileModal,
  onOpenStatsModal,
  onOpenAchievementsModal,
  onOpenLeaderboardModal,
  onOpenDailyModal,
  onOpenSettingsModal,
  onOpenHelpModal,
  onOpenCreditsModal,
}) => {
  const { profile, dailyStreak, logout } = useUserStore();
  const { stats } = useStatsStore();
  const { soundEnabled, soundVolume } = useSettingsStore();
  const { setScreen } = useAppFlowStore();

  const handleHover = () => {
    if (soundEnabled) SoundEngine.playHover(soundVolume);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your 2048 Nexus account?')) {
      logout();
      setScreen('auth');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative z-20 w-full max-w-2xl mx-auto px-4 py-4 select-none"
    >
      {/* Top Logo & Title */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center justify-center p-2.5 bg-slate-900/90 border border-cyan-500/30 rounded-2xl shadow-glow-cyan mb-1.5"
        >
          <Gamepad2 className="w-8 h-8 text-cyan-400 animate-pulse" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 via-purple-400 to-pink-400">
          2048 <span className="text-white font-light tracking-widest uppercase text-2xl sm:text-3xl">NEXUS</span>
        </h1>
        <p className="text-[11px] text-slate-300 font-medium tracking-wide mt-0.5">Beyond the Classic Puzzle Experience</p>
      </div>

      {/* Player Dashboard Card */}
      <GlassCard glow="blue" className="mb-4 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Avatar & Level */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl shadow-md border border-purple-400/40 flex-shrink-0">
              {profile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{profile.username}</h3>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-400 font-semibold">
                <span className="text-amber-400 font-bold">Lvl {profile.level}</span>
                <span>•</span>
                <span className="text-blue-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {profile.rank}
                </span>
                <span>•</span>
                <span className="text-amber-300 flex items-center gap-1 font-mono">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  {profile.coins}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 text-center sm:text-right">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Best Score</span>
              <div className="text-base font-extrabold text-amber-300">{stats.bestScore.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Max Tile</span>
              <div className="text-base font-extrabold text-cyan-300">{stats.highestTile || 0}</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {/* PLAY GAME BUTTON */}
        <Button
          variant="primary"
          size="lg"
          onClick={onOpenPlayModal}
          onMouseEnter={handleHover}
          icon={<Play className="w-5 h-5 fill-white" />}
          className="sm:col-span-2 py-3.5 text-base font-black tracking-wider uppercase bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-glow-blue"
        >
          PLAY GAME
        </Button>

        {/* Continue Last Game */}
        <Button
          variant="glass"
          size="md"
          onClick={() => setScreen('in_game')}
          onMouseEnter={handleHover}
          icon={<RotateCcw className="w-4 h-4 text-amber-400" />}
        >
          Resume Match
        </Button>

        {/* Player Profile */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenProfileModal}
          onMouseEnter={handleHover}
          icon={<User className="w-4 h-4 text-purple-400" />}
        >
          Player Profile
        </Button>

        {/* Leaderboards */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenLeaderboardModal}
          onMouseEnter={handleHover}
          icon={<Award className="w-4 h-4 text-amber-400" />}
        >
          Leaderboards
        </Button>

        {/* Achievements */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenAchievementsModal}
          onMouseEnter={handleHover}
          icon={<Trophy className="w-4 h-4 text-yellow-400" />}
        >
          Achievements
        </Button>

        {/* Statistics & Analytics */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenStatsModal}
          onMouseEnter={handleHover}
          icon={<BarChart2 className="w-4 h-4 text-blue-400" />}
        >
          Statistics
        </Button>

        {/* Daily Rewards */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenDailyModal}
          onMouseEnter={handleHover}
          icon={<Gift className="w-4 h-4 text-pink-400" />}
        >
          Daily Rewards ({dailyStreak}d)
        </Button>

        {/* Themes & Customization */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenSettingsModal}
          onMouseEnter={handleHover}
          icon={<Palette className="w-4 h-4 text-cyan-400" />}
        >
          Themes & Skins
        </Button>

        {/* Game Settings */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenSettingsModal}
          onMouseEnter={handleHover}
          icon={<Settings className="w-4 h-4 text-slate-300" />}
        >
          Settings
        </Button>

        {/* How to Play & Help */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenHelpModal}
          onMouseEnter={handleHover}
          icon={<HelpCircle className="w-4 h-4 text-emerald-400" />}
        >
          How to Play
        </Button>

        {/* Credits */}
        <Button
          variant="glass"
          size="md"
          onClick={onOpenCreditsModal}
          onMouseEnter={handleHover}
          icon={<Code2 className="w-4 h-4 text-purple-400" />}
        >
          Credits
        </Button>
      </div>

      {/* Logout & Footer Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Cloud className="w-4 h-4 text-emerald-400" />
          Cloud Save Synchronized
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer font-bold"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </motion.div>
  );
};
