import React, { useEffect, useState } from 'react';
import { useGameStore } from './stores/useGameStore';
import { useUserStore } from './stores/useUserStore';
import { useSettingsStore } from './stores/useSettingsStore';
import { useAppFlowStore } from './stores/useAppFlowStore';
import { THEMES } from './utils/themes';

import { Background3D } from './components/3d/Background3D';
import { SplashScreen } from './components/startup/SplashScreen';
import { LoadingScreen } from './components/startup/LoadingScreen';
import { AuthScreen } from './components/startup/AuthScreen';
import { UsernameSetupScreen } from './components/startup/UsernameSetupScreen';
import { AvatarSetupScreen } from './components/startup/AvatarSetupScreen';

import { MainMenu } from './components/menu/MainMenu';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GameHeader } from './components/game/GameHeader';
import { GameBoard } from './components/game/GameBoard';
import { GameControls } from './components/game/GameControls';

import { PlayMenuModal } from './components/menu/PlayMenuModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { StatisticsModal } from './components/modals/StatisticsModal';
import { AchievementsModal } from './components/modals/AchievementsModal';
import { LeaderboardModal } from './components/modals/LeaderboardModal';
import { DailyRewardsModal } from './components/modals/DailyRewardsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { HelpTutorialModal } from './components/modals/HelpTutorialModal';
import { CreditsModal } from './components/modals/CreditsModal';
import { GoldShopModal } from './components/shop/GoldShopModal';
import { InsufficientGoldModal } from './components/modals/InsufficientGoldModal';

import { PaymentService } from './services/paymentService';
import { Home } from 'lucide-react';
import { Button } from './components/ui/Button';

export const App: React.FC = () => {
  const { screen, setScreen } = useAppFlowStore();
  const { tickTimer, mode, status } = useGameStore();
  const { checkDailyStreak } = useUserStore();
  const { theme } = useSettingsStore();

  // Modal open states
  const [activeModal, setActiveModal] = useState<
    | 'play'
    | 'profile'
    | 'stats'
    | 'achievements'
    | 'leaderboard'
    | 'daily'
    | 'settings'
    | 'help'
    | 'credits'
    | 'gold_shop'
    | 'insufficient_gold'
    | null
  >(null);

  const [insufficientCost, setInsufficientCost] = useState(5);

  // Sync daily login streak & server-authoritative Gold balance on mount
  useEffect(() => {
    checkDailyStreak();
    PaymentService.syncServerBalance(useUserStore.getState().profile.id).then((serverGold: number | null) => {
      if (serverGold !== null) {
        useUserStore.getState().updateProfile({ gold: serverGold });
      }
    });
  }, [checkDailyStreak]);

  // Timed mode countdown ticker (1 sec interval)
  useEffect(() => {
    if (mode !== 'timed' || status !== 'playing' || screen !== 'in_game') return;

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, status, screen, tickTimer]);

  const handleShowInsufficientGold = (cost: number) => {
    setInsufficientCost(cost);
    setActiveModal('insufficient_gold');
  };

  const currentTheme = THEMES[theme] || THEMES.dark;

  // FTUE Startup Routing Screens
  if (screen === 'splash') return <SplashScreen />;
  if (screen === 'loading_assets') return <LoadingScreen mode="assets" />;
  if (screen === 'auth') return <AuthScreen />;
  if (screen === 'username_setup') return <UsernameSetupScreen />;
  if (screen === 'avatar_setup') return <AvatarSetupScreen />;
  if (screen === 'cloud_sync') return <LoadingScreen mode="cloud" />;

  return (
    <div className={`min-h-screen relative flex flex-col justify-between ${currentTheme.bgClass}`}>
      {/* 3D WebGL Background Scene */}
      <Background3D />

      {/* Top Navigation */}
      {screen === 'in_game' ? (
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setScreen('main_menu')}
            icon={<Home className="w-4 h-4 text-blue-400" />}
          >
            Main Menu
          </Button>

          <Navbar
            onOpenProfile={() => setActiveModal('profile')}
            onOpenStats={() => setActiveModal('stats')}
            onOpenAchievements={() => setActiveModal('achievements')}
            onOpenLeaderboard={() => setActiveModal('leaderboard')}
            onOpenDailyRewards={() => setActiveModal('daily')}
            onOpenSettings={() => setActiveModal('settings')}
            onOpenGoldShop={() => setActiveModal('gold_shop')}
          />
        </div>
      ) : (
        <Navbar
          onOpenProfile={() => setActiveModal('profile')}
          onOpenStats={() => setActiveModal('stats')}
          onOpenAchievements={() => setActiveModal('achievements')}
          onOpenLeaderboard={() => setActiveModal('leaderboard')}
          onOpenDailyRewards={() => setActiveModal('daily')}
          onOpenSettings={() => setActiveModal('settings')}
          onOpenGoldShop={() => setActiveModal('gold_shop')}
        />
      )}

      {/* Screen Routing Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 my-auto">
        {screen === 'main_menu' ? (
          <MainMenu
            onOpenPlayModal={() => setActiveModal('play')}
            onOpenProfileModal={() => setActiveModal('profile')}
            onOpenStatsModal={() => setActiveModal('stats')}
            onOpenAchievementsModal={() => setActiveModal('achievements')}
            onOpenLeaderboardModal={() => setActiveModal('leaderboard')}
            onOpenDailyModal={() => setActiveModal('daily')}
            onOpenSettingsModal={() => setActiveModal('settings')}
            onOpenHelpModal={() => setActiveModal('help')}
            onOpenCreditsModal={() => setActiveModal('credits')}
          />
        ) : (
          <>
            <GameHeader
              onOpenShop={() => setActiveModal('gold_shop')}
              onShowInsufficientGold={handleShowInsufficientGold}
            />
            <GameBoard />
            <GameControls />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <GoldShopModal
        isOpen={activeModal === 'gold_shop'}
        onClose={() => setActiveModal(null)}
      />
      <InsufficientGoldModal
        isOpen={activeModal === 'insufficient_gold'}
        onClose={() => setActiveModal(null)}
        onOpenShop={() => setActiveModal('gold_shop')}
        onOpenDaily={() => setActiveModal('daily')}
        requiredCost={insufficientCost}
      />
      <PlayMenuModal
        isOpen={activeModal === 'play'}
        onClose={() => setActiveModal(null)}
      />
      <ProfileModal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        onOpenShop={() => setActiveModal('gold_shop')}
        onOpenInsufficientGold={handleShowInsufficientGold}
      />
      <StatisticsModal
        isOpen={activeModal === 'stats'}
        onClose={() => setActiveModal(null)}
      />
      <AchievementsModal
        isOpen={activeModal === 'achievements'}
        onClose={() => setActiveModal(null)}
      />
      <LeaderboardModal
        isOpen={activeModal === 'leaderboard'}
        onClose={() => setActiveModal(null)}
      />
      <DailyRewardsModal
        isOpen={activeModal === 'daily'}
        onClose={() => setActiveModal(null)}
      />
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
      />
      <HelpTutorialModal
        isOpen={activeModal === 'help'}
        onClose={() => setActiveModal(null)}
      />
      <CreditsModal
        isOpen={activeModal === 'credits'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default App;
