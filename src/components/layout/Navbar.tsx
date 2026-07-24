import React from 'react';
import { User, Trophy, BarChart2, Award, Gift, Settings, Coins, ShoppingBag } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
  onOpenDailyRewards: () => void;
  onOpenSettings: () => void;
  onOpenGoldShop?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfile,
  onOpenStats,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenDailyRewards,
  onOpenSettings,
  onOpenGoldShop,
}) => {
  const { profile, dailyStreak, dailyRewardClaimed } = useUserStore();

  return (
    <nav className="relative z-20 w-full max-w-4xl mx-auto px-4 py-3 select-none">
      <div className="flex items-center justify-between p-2.5 bg-[#0F172A]/80 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-glass">
        {/* Left: Player Profile Pill */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">{profile.avatar}</span>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white flex items-center gap-1">
              {profile.username}
              <span className="text-[10px] text-amber-400 font-black">Lvl {profile.level}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">{profile.rank}</div>
          </div>
        </button>

        {/* Right: Gold Balance & Quick Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Gold Wallet Badge Button */}
          <button
            onClick={onOpenGoldShop}
            className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-950/80 to-purple-950/80 hover:from-amber-900/90 hover:to-purple-900/90 border border-amber-500/40 rounded-xl text-xs font-extrabold text-amber-300 shadow-glow-gold transition-all cursor-pointer"
            title="Nexus Gold Store"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{profile.gold}</span>
          </button>

          {/* Daily Streak Gift Button */}
          <button
            onClick={onOpenDailyRewards}
            className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
              !dailyRewardClaimed
                ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 shadow-glow-purple animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Daily Rewards"
          >
            <Gift className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-purple-500 text-white text-[9px] font-black rounded-full">
              {dailyStreak}d
            </span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 rounded-xl transition-all cursor-pointer"
            title="Leaderboards"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Achievements Button */}
          <button
            onClick={onOpenAchievements}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-yellow-400 rounded-xl transition-all cursor-pointer"
            title="Achievements"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Analytics Stats Button */}
          <button
            onClick={onOpenStats}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-400 rounded-xl transition-all cursor-pointer"
            title="Analytics & Stats"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
