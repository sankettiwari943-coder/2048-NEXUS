import React from 'react';
import { Calendar, Gift, Check, Flame, Sparkles } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { ModalContainer } from '../ui/ModalContainer';
import { Button } from '../ui/Button';

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ isOpen, onClose }) => {
  const { dailyStreak, dailyRewardClaimed, claimDailyReward } = useUserStore();

  const days = [
    { day: 1, reward: 100, label: '100 XP' },
    { day: 2, reward: 200, label: '200 XP' },
    { day: 3, reward: 350, label: '350 XP' },
    { day: 4, reward: 500, label: '500 XP' },
    { day: 5, reward: 700, label: '700 XP' },
    { day: 6, reward: 900, label: '900 XP' },
    { day: 7, reward: 1500, label: '1500 XP + Theme' },
  ];

  const currentDayIndex = ((dailyStreak - 1) % 7) + 1;

  const handleClaim = () => {
    claimDailyReward();
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Reward Streak"
      subtitle={`Current Login Streak: ${dailyStreak} Days!`}
      icon={<Gift className="w-6 h-6 text-purple-400" />}
      maxWidth="md"
    >
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((d) => {
          const isCompleted = d.day < currentDayIndex || (d.day === currentDayIndex && dailyRewardClaimed);
          const isCurrent = d.day === currentDayIndex && !dailyRewardClaimed;

          return (
            <div
              key={d.day}
              className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                isCurrent
                  ? 'bg-gradient-to-b from-purple-600/30 to-pink-600/30 border-purple-400 shadow-glow-purple scale-105'
                  : isCompleted
                  ? 'bg-slate-900 border-slate-800 opacity-60'
                  : 'bg-slate-950 border-slate-900 opacity-40'
              }`}
            >
              <span className="text-[10px] font-extrabold text-slate-400 mb-1">Day {d.day}</span>
              <Gift className={`w-5 h-5 mb-1 ${isCurrent ? 'text-purple-300 animate-bounce' : 'text-slate-400'}`} />
              <span className="text-[9px] font-bold text-amber-300">{d.label}</span>
              {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400 mt-1" />}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center">
        {!dailyRewardClaimed ? (
          <>
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Day {currentDayIndex} Reward Available!
            </h4>
            <p className="text-xs text-slate-400 mb-4">Claim your login bonus now to boost your level.</p>
            <Button variant="secondary" size="md" onClick={handleClaim} icon={<Flame className="w-4 h-4" />}>
              Claim Bonus (+{Math.min(1000, 100 * dailyStreak)} XP)
            </Button>
          </>
        ) : (
          <>
            <Check className="w-8 h-8 text-emerald-400 mb-1" />
            <h4 className="text-sm font-bold text-white mb-1">Reward Claimed For Today!</h4>
            <p className="text-xs text-slate-400">Return tomorrow to keep your streak going!</p>
          </>
        )}
      </div>
    </ModalContainer>
  );
};
