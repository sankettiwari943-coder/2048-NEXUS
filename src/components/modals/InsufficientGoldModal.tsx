import React from 'react';
import { AlertCircle, Coins, Gift, ShoppingBag, X } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { ModalContainer } from '../ui/ModalContainer';
import { Button } from '../ui/Button';

interface InsufficientGoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShop: () => void;
  onOpenDaily: () => void;
  requiredCost?: number;
}

export const InsufficientGoldModal: React.FC<InsufficientGoldModalProps> = ({
  isOpen,
  onClose,
  onOpenShop,
  onOpenDaily,
  requiredCost = 5,
}) => {
  const { profile } = useUserStore();

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="You don't have enough Gold"
      subtitle={`Required: ${requiredCost} Gold • Balance: ${profile.gold} Gold`}
      icon={<AlertCircle className="w-6 h-6 text-rose-400" />}
      maxWidth="md"
    >
      <div className="space-y-4 text-center py-2">
        <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl">
          <Coins className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce" />
          <p className="text-xs text-slate-200">
            You need <span className="font-bold text-amber-300">{requiredCost - profile.gold} more Gold</span> to perform this action. Buy a Gold pack or earn free Gold via daily login rewards!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="accent"
            size="md"
            onClick={() => {
              onClose();
              onOpenShop();
            }}
            icon={<ShoppingBag className="w-4 h-4" />}
            fullWidth
          >
            Buy Gold
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              onClose();
              onOpenDaily();
            }}
            icon={<Gift className="w-4 h-4" />}
            fullWidth
          >
            Earn Free Gold
          </Button>

          <Button variant="ghost" size="md" onClick={onClose} icon={<X className="w-4 h-4" />}>
            Cancel
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};
