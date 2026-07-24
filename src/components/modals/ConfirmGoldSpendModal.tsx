import React from 'react';
import { Coins, Check, X, Sparkles } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { ModalContainer } from '../ui/ModalContainer';
import { Button } from '../ui/Button';

interface ConfirmGoldSpendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cost: number;
}

export const ConfirmGoldSpendModal: React.FC<ConfirmGoldSpendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cost,
}) => {
  const { profile } = useUserStore();
  const remainingGold = profile.gold - cost;

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Gold Purchase Confirmation"
      icon={<Coins className="w-6 h-6 text-amber-400" />}
      maxWidth="md"
    >
      <div className="space-y-4 text-center py-2">
        <p className="text-sm text-slate-200">{description}</p>

        {/* Balance Breakdown Box */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Current Gold Balance:</span>
            <span className="font-bold text-amber-300 font-mono">{profile.gold} Gold</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Item Cost:</span>
            <span className="font-bold text-rose-400 font-mono">-{cost} Gold</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold text-sm text-white">
            <span>Remaining Gold:</span>
            <span className="text-emerald-400 font-mono">{remainingGold} Gold</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" size="md" onClick={onClose} icon={<X className="w-4 h-4" />}>
            Cancel
          </Button>
          <Button
            variant="accent"
            size="md"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            icon={<Check className="w-4 h-4" />}
            fullWidth
          >
            Confirm & Spend {cost} Gold
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};
