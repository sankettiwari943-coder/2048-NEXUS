import React, { useState } from 'react';
import { BarChart2, Trophy, Flame, Clock, Layers, Target, TrendingUp, History } from 'lucide-react';
import { useStatsStore } from '../../stores/useStatsStore';
import { ModalContainer } from '../ui/ModalContainer';
import { GlassCard } from '../ui/GlassCard';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose }) => {
  const { stats, matchHistory } = useStatsStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'history'>('overview');

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const avgMovesPerGame = stats.gamesPlayed > 0 ? Math.round(stats.totalMoves / stats.gamesPlayed) : 0;

  // Format time in HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Player Analytics"
      subtitle="Detailed gameplay metrics & historical performance"
      icon={<BarChart2 className="w-6 h-6 text-blue-400" />}
      maxWidth="xl"
    >
      {/* Sub Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'charts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Performance Charts
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Match History ({matchHistory.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <GlassCard glow="gold" className="p-4 flex flex-col items-center text-center">
            <Trophy className="w-6 h-6 text-amber-400 mb-1" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Best Score</span>
            <span className="text-xl font-extrabold text-amber-300 mt-1">{stats.bestScore.toLocaleString()}</span>
          </GlassCard>

          <GlassCard glow="cyan" className="p-4 flex flex-col items-center text-center">
            <Flame className="w-6 h-6 text-cyan-400 mb-1" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Highest Tile</span>
            <span className="text-xl font-extrabold text-cyan-300 mt-1">{stats.highestTile || 0}</span>
          </GlassCard>

          <GlassCard glow="purple" className="p-4 flex flex-col items-center text-center">
            <TrendingUp className="w-6 h-6 text-purple-400 mb-1" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Win Rate</span>
            <span className="text-xl font-extrabold text-purple-300 mt-1">{winRate}%</span>
          </GlassCard>

          <GlassCard glow="none" className="p-4 flex flex-col items-center text-center">
            <Target className="w-6 h-6 text-emerald-400 mb-1" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Games Won / Played</span>
            <span className="text-lg font-bold text-slate-200 mt-1">{stats.gamesWon} / {stats.gamesPlayed}</span>
          </GlassCard>

          <GlassCard glow="none" className="p-4 flex flex-col items-center text-center">
            <Layers className="w-6 h-6 text-blue-400 mb-1" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Merges</span>
            <span className="text-lg font-bold text-slate-200 mt-1">{stats.totalMerges.toLocaleString()}</span>
          </GlassCard>

          <GlassCard glow="none" className="p-4 flex flex-col items-center text-center">
            <Clock className="w-6 h-6 text-pink-400 mb-1" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Time Played</span>
            <span className="text-lg font-bold text-slate-200 mt-1">{formatTime(stats.totalTimePlayed)}</span>
          </GlassCard>
        </div>
      )}

      {/* CHARTS TAB */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* SVG Score History Line Chart */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Recent Score Progression
            </h4>
            {matchHistory.length > 0 ? (
              <div className="w-full h-40 flex items-end gap-2 pt-4 px-2 border-b border-l border-slate-700">
                {matchHistory.slice(0, 10).reverse().map((match, idx) => {
                  const maxScoreInHistory = Math.max(...matchHistory.map((m) => m.score)) || 1;
                  const heightPct = Math.max(10, Math.round((match.score / maxScoreInHistory) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {match.score}
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm group-hover:from-blue-500 group-hover:to-cyan-300 transition-all"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">Play matches to generate performance progression graphs.</p>
            )}
          </div>
        </div>
      )}

      {/* MATCH HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {matchHistory.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No match history recorded yet.</p>
          ) : (
            matchHistory.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${match.won ? 'bg-emerald-400 shadow-glow-cyan' : 'bg-slate-600'}`} />
                  <div>
                    <div className="font-bold text-white uppercase">{match.mode} Mode</div>
                    <div className="text-[10px] text-slate-400">{match.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400">Score: </span>
                    <span className="font-extrabold text-amber-300">{match.score}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Max Tile: </span>
                    <span className="font-extrabold text-cyan-300">{match.highestTile}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </ModalContainer>
  );
};
