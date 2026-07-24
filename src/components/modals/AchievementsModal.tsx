import React from 'react';
import { Trophy, CheckCircle2, Lock, Sparkles, Award, Flame, Zap, Star, Gamepad2, Crown, Layers } from 'lucide-react';
import { useStatsStore } from '../../stores/useStatsStore';
import { useUserStore } from '../../stores/useUserStore';
import { ModalContainer } from '../ui/ModalContainer';
import { ProgressBar } from '../ui/ProgressBar';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-yellow-400" />,
  Award: <Award className="w-5 h-5 text-blue-400" />,
  Flame: <Flame className="w-5 h-5 text-orange-400" />,
  Zap: <Zap className="w-5 h-5 text-cyan-400" />,
  Trophy: <Trophy className="w-5 h-5 text-amber-400" />,
  Star: <Star className="w-5 h-5 text-purple-400" />,
  Gamepad2: <Gamepad2 className="w-5 h-5 text-emerald-400" />,
  Crown: <Crown className="w-5 h-5 text-amber-300" />,
  Layers: <Layers className="w-5 h-5 text-pink-400" />,
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const { achievements } = useStatsStore();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Achievements & Trophies"
      subtitle={`${unlockedCount} of ${achievements.length} Unlocked`}
      icon={<Trophy className="w-6 h-6 text-amber-400" />}
      maxWidth="lg"
    >
      <div className="space-y-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-4 border rounded-2xl transition-all ${
              ach.unlocked
                ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border-blue-500/40 shadow-glow-blue'
                : 'bg-slate-900/60 border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  {ICON_MAP[ach.icon] || <Trophy className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {ach.title}
                    {ach.unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 text-xs font-bold rounded-lg border border-purple-500/20 whitespace-nowrap">
                +{ach.rewardXP} XP
              </span>
            </div>

            <ProgressBar
              current={ach.progress}
              max={ach.requirementValue}
              gradient={ach.unlocked ? 'blue-purple' : 'cyan-emerald'}
            />
          </div>
        ))}
      </div>
    </ModalContainer>
  );
};
