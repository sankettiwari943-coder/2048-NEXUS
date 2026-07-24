import React, { useState } from 'react';
import { Play, RotateCcw, Zap, Shield, Flame, Clock, Target, Infinity as InfinityIcon } from 'lucide-react';
import { GameMode } from '../../types/game';
import { useGameStore } from '../../stores/useGameStore';
import { useAppFlowStore } from '../../stores/useAppFlowStore';
import { ModalContainer } from '../ui/ModalContainer';
import { Button } from '../ui/Button';

interface PlayMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayMenuModal: React.FC<PlayMenuModalProps> = ({ isOpen, onClose }) => {
  const { initGame } = useGameStore();
  const { setScreen } = useAppFlowStore();

  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');

  const modeOptions: { id: GameMode; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'classic', title: 'Classic 2048', desc: 'Standard 4x4 matrix puzzle rules', icon: <Zap className="w-5 h-5 text-blue-400" /> },
    { id: 'easy', title: 'Easy Mode', desc: 'Higher 2s spawn rate, relaxed merging', icon: <Shield className="w-5 h-5 text-emerald-400" /> },
    { id: 'medium', title: 'Medium Mode', desc: 'Balanced gameplay & progression', icon: <Zap className="w-5 h-5 text-cyan-400" /> },
    { id: 'hard', title: 'Hard Challenge', desc: '35% fours spawn rate, high difficulty', icon: <Flame className="w-5 h-5 text-rose-400" /> },
    { id: 'zen', title: 'Zen Mode', desc: 'Relaxing mode with no game-over state', icon: <Shield className="w-5 h-5 text-purple-400" /> },
    { id: 'timed', title: 'Timed Challenge', desc: '120-second countdown sprint', icon: <Clock className="w-5 h-5 text-amber-400" /> },
    { id: 'challenge', title: 'Missions', desc: 'Complete specific target tile goals', icon: <Target className="w-5 h-5 text-pink-400" /> },
    { id: 'endless', title: 'Endless Mode', desc: 'Continue playing indefinitely past 2048', icon: <InfinityIcon className="w-5 h-5 text-cyan-300" /> },
  ];

  const handleStartGame = (isNew: boolean) => {
    initGame(selectedMode);
    setScreen('in_game');
    onClose();
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Select Game Mode"
      subtitle="Choose your puzzle challenge level"
      icon={<Play className="w-6 h-6 text-blue-400" />}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Mode Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
          {modeOptions.map((m) => {
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-400 shadow-glow-blue scale-[1.02]'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">{m.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" size="md" onClick={() => handleStartGame(false)} icon={<RotateCcw className="w-4 h-4" />}>
            Resume Last Game
          </Button>
          <Button variant="primary" size="md" onClick={() => handleStartGame(true)} icon={<Play className="w-4 h-4" />} fullWidth>
            Start New Game
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};
