import React, { useState } from 'react';
import { HelpCircle, Sparkles, Brain, Trophy, Keyboard, Smartphone } from 'lucide-react';
import { ModalContainer } from '../ui/ModalContainer';

interface HelpTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpTutorialModal: React.FC<HelpTutorialModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'rules' | 'controls' | 'ai' | 'rewards'>('rules');

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play & Guide"
      subtitle="Master the 2048 Nexus matrix"
      icon={<HelpCircle className="w-6 h-6 text-blue-400" />}
      maxWidth="lg"
    >
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setTab('rules')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            tab === 'rules' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Basic Rules
        </button>
        <button
          onClick={() => setTab('controls')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            tab === 'controls' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Controls
        </button>
        <button
          onClick={() => setTab('ai')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            tab === 'ai' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          AI Engine
        </button>
        <button
          onClick={() => setTab('rewards')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            tab === 'rewards' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          XP & Ranks
        </button>
      </div>

      {/* Rules */}
      {tab === 'rules' && (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-600 font-extrabold text-white flex items-center justify-center text-lg">
              2+2
            </span>
            <div>
              <h4 className="font-bold text-white">1. Merge Matching Tiles</h4>
              <p className="text-slate-400">Swipe tiles in any direction. When two tiles with the same number touch, they merge into one!</p>
            </div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-purple-600 font-extrabold text-white flex items-center justify-center text-lg">
              2048
            </span>
            <div>
              <h4 className="font-bold text-white">2. Reach 2048 & Beyond</h4>
              <p className="text-slate-400">Keep merging to form 512, 1024, 2048, 4096 and endless higher power tiles.</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      {tab === 'controls' && (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <Keyboard className="w-8 h-8 text-blue-400" />
            <div>
              <h4 className="font-bold text-white">Keyboard Controls</h4>
              <p className="text-slate-400">Use <span className="font-mono text-cyan-300">Arrow Keys</span> or <span className="font-mono text-cyan-300">WASD</span> to slide tiles on PC.</p>
            </div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-purple-400" />
            <div>
              <h4 className="font-bold text-white">Mobile Touch Gestures</h4>
              <p className="text-slate-400">Swipe anywhere on the screen board to slide tiles in that direction.</p>
            </div>
          </div>
        </div>
      )}

      {/* AI */}
      {tab === 'ai' && (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400" />
            <div>
              <h4 className="font-bold text-white">AI Hints & Risk Rating</h4>
              <p className="text-slate-400">Click the AI Hint button to overlay directional arrows, win probability percentages, and move risk metrics.</p>
            </div>
          </div>
        </div>
      )}

      {/* Rewards */}
      {tab === 'rewards' && (
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h4 className="font-bold text-white">Leveling & Ranks</h4>
              <p className="text-slate-400">Earn XP by merging tiles, winning matches, and maintaining daily login streaks to climb from Bronze to Grandmaster.</p>
            </div>
          </div>
        </div>
      )}
    </ModalContainer>
  );
};
