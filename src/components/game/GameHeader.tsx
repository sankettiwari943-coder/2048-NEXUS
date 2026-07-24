import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Brain, Bot, Pause, Play, Clock, Coins } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { useUserStore } from '../../stores/useUserStore';
import { Button } from '../ui/Button';
import { ConfirmGoldSpendModal } from '../modals/ConfirmGoldSpendModal';

interface GameHeaderProps {
  onOpenShop?: () => void;
  onShowInsufficientGold?: (cost: number) => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ onOpenShop, onShowInsufficientGold }) => {
  const {
    score,
    bestScore,
    undoStack,
    undo,
    status,
    togglePause,
    showHintOverlay,
    toggleHintOverlay,
    requestHint,
    executeSingleAIMove,
    timeRemaining,
    mode,
  } = useGameStore();

  const { profile, canAffordGold, deductGold } = useUserStore();

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    cost: number;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    cost: 5,
    action: () => {},
  });

  const handleRequestHint = () => {
    if (showHintOverlay) {
      toggleHintOverlay();
      return;
    }

    const HINT_COST = 5;
    if (!canAffordGold(HINT_COST)) {
      if (onShowInsufficientGold) onShowInsufficientGold(HINT_COST);
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Get AI Hint',
      description: 'Spend 5 Gold to analyze the board and highlight the optimal move?',
      cost: HINT_COST,
      action: () => {
        if (deductGold(HINT_COST, 'AI Hint Fee')) {
          requestHint();
        }
      },
    });
  };

  const handleAIMoveRequest = () => {
    const AUTO_MOVE_COST = 10;
    if (!canAffordGold(AUTO_MOVE_COST)) {
      if (onShowInsufficientGold) onShowInsufficientGold(AUTO_MOVE_COST);
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Execute 1 AI Move',
      description: 'Spend 10 Gold to let the AI execute exactly ONE optimal move?',
      cost: AUTO_MOVE_COST,
      action: () => {
        if (deductGold(AUTO_MOVE_COST, '1 AI Move Fee')) {
          executeSingleAIMove('expert');
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto mb-2 select-none">
      {/* Confirmation Modal */}
      <ConfirmGoldSpendModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.action}
        title={confirmModal.title}
        description={confirmModal.description}
        cost={confirmModal.cost}
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Title / Logo */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 flex items-center gap-2">
            2048 <span className="text-white text-lg font-light tracking-widest uppercase">NEXUS</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Beyond the Classic Puzzle</p>
        </div>

        {/* Gold & Score Cards */}
        <div className="flex gap-2">
          {/* Gold Wallet Badge */}
          <button
            onClick={onOpenShop}
            className="flex flex-col items-center justify-center px-3 py-1.5 bg-gradient-to-r from-amber-950/80 to-purple-950/80 border border-amber-500/40 hover:border-amber-400 rounded-2xl min-w-[70px] shadow-glow-gold transition-all cursor-pointer"
            title="Open Gold Shop"
          >
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-0.5">
              <Coins className="w-2.5 h-2.5" /> Gold
            </span>
            <span className="text-sm font-extrabold text-amber-300">{profile.gold}</span>
          </button>

          {/* Current Score */}
          <div className="flex flex-col items-center justify-center px-3.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl min-w-[70px] shadow-glass">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Score</span>
            <motion.span
              key={score}
              initial={{ scale: 1.2, color: '#38BDF8' }}
              animate={{ scale: 1, color: '#F8FAFC' }}
              className="text-base font-extrabold"
            >
              {score}
            </motion.span>
          </div>

          {/* Best Score */}
          <div className="flex flex-col items-center justify-center px-3.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl min-w-[70px] shadow-glass">
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400/90">Best</span>
            <span className="text-base font-extrabold text-amber-300">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar Bar */}
      <div className="flex items-center justify-between gap-2 p-2 bg-slate-900/70 border border-slate-800/80 rounded-2xl backdrop-blur-md">
        {/* Undo Button */}
        <Button
          variant="glass"
          size="sm"
          onClick={undo}
          disabled={undoStack.length === 0 || status !== 'playing'}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Undo ({undoStack.length})
        </Button>

        {/* AI Hint Button (5 Gold) */}
        <Button
          variant={showHintOverlay ? 'accent' : 'glass'}
          size="sm"
          onClick={handleRequestHint}
          disabled={status !== 'playing'}
          icon={<Brain className="w-3.5 h-3.5 text-cyan-400" />}
        >
          {showHintOverlay ? 'Hide Hint' : 'Hint (5 G)'}
        </Button>

        {/* AI Move Button (10 Gold per SINGLE Move) */}
        <Button
          variant="glass"
          size="sm"
          onClick={handleAIMoveRequest}
          disabled={status !== 'playing'}
          icon={<Bot className="w-3.5 h-3.5 text-purple-400" />}
        >
          1 AI Move (10 G)
        </Button>

        {/* Timed Mode Timer or Pause */}
        {mode === 'timed' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeRemaining}s</span>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePause}
            icon={status === 'paused' ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          >
            {status === 'paused' ? 'Resume' : 'Pause'}
          </Button>
        )}
      </div>
    </div>
  );
};
