import React, { useState } from 'react';
import { Award, Search, Globe, Shield, UserCheck, Flame } from 'lucide-react';
import { useStatsStore } from '../../stores/useStatsStore';
import { ModalContainer } from '../ui/ModalContainer';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { getLeaderboard } = useStatsStore();
  const [tab, setTab] = useState<'global' | 'country' | 'friends'>('global');
  const [searchQuery, setSearchQuery] = useState('');

  const list = getLeaderboard(tab).filter((entry) =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Global Leaderboards"
      subtitle="Top players worldwide & hall of fame"
      icon={<Award className="w-6 h-6 text-amber-400" />}
      maxWidth="lg"
    >
      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setTab('global')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'global' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          Global
        </button>
        <button
          onClick={() => setTab('country')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'country' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Country
        </button>
        <button
          onClick={() => setTab('friends')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            tab === 'friends' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Friends
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by player username..."
          className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Leaderboard Table List */}
      <div className="space-y-2">
        {list.map((entry) => {
          const isTop3 = entry.rank <= 3;
          const rankColors: Record<number, string> = {
            1: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-glow-gold',
            2: 'bg-gradient-to-r from-slate-300 to-slate-400 text-black',
            3: 'bg-gradient-to-r from-amber-700 to-amber-800 text-white',
          };

          return (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                isTop3
                  ? 'bg-slate-900/90 border-amber-500/30'
                  : 'bg-slate-900/50 border-slate-800/80'
              }`}
            >
              {/* Rank & Avatar & Name */}
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                    rankColors[entry.rank] || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{entry.rank}
                </span>

                <span className="text-xl">{entry.avatar}</span>

                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {entry.username}
                    <span className="text-[10px] text-slate-400 font-mono">[{entry.country}]</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{entry.totalWins} Wins</div>
                </div>
              </div>

              {/* Score & Highest Tile */}
              <div className="text-right">
                <div className="text-sm font-extrabold text-amber-300">
                  {entry.score.toLocaleString()}
                </div>
                <div className="text-[10px] text-cyan-400 flex items-center justify-end gap-1 font-semibold">
                  <Flame className="w-3 h-3" /> Tile {entry.highestTile}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
};
