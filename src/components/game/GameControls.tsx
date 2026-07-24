import React from 'react';
import { RefreshCw, Zap, Shield, Flame, Clock, Target, Infinity as InfinityIcon } from 'lucide-react';
import { GameMode } from '../../types/game';
import { useGameStore } from '../../stores/useGameStore';
import { Button } from '../ui/Button';

export const GameControls: React.FC = () => {
  const { mode, initGame } = useGameStore();

  const gameModes: { id: GameMode; label: string; icon: React.ReactNode }[] = [
    { id: 'classic', label: 'Classic', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'easy', label: 'Easy', icon: <Shield className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'medium', label: 'Medium', icon: <Zap className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'hard', label: 'Hard', icon: <Flame className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'zen', label: 'Zen', icon: <Shield className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'timed', label: 'Timed', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'challenge', label: 'Missions', icon: <Target className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'endless', label: 'Endless', icon: <InfinityIcon className="w-3.5 h-3.5 text-pink-400" /> },
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-3 select-none">
      {/* Game Mode Selector Scrollable Pills */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar mb-3">
        {gameModes.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => initGame(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Restart Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="glass"
          size="sm"
          onClick={() => initGame()}
          icon={<RefreshCw className="w-3.5 h-3.5 text-slate-300" />}
          fullWidth
        >
          Restart Game
        </Button>
      </div>
    </div>
  );
};
