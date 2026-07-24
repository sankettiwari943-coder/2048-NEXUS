import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, AuthProviderType, GoldTransaction } from '../types/game';

interface UserState {
  profile: UserProfile;
  goldTransactions: GoldTransaction[];
  dailyStreak: number;
  lastLoginDate: string; // YYYY-MM-DD
  dailyRewardClaimed: boolean;
  unlockedThemes: string[];

  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number) => { newLevel: number; leveledUp: boolean };
  addCoins: (amount: number) => void;
  addGold: (amount: number, description?: string, txId?: string) => void;
  deductGold: (amount: number, description: string) => boolean;
  canAffordGold: (amount: number) => boolean;
  checkDailyStreak: () => void;
  claimDailyReward: () => number;
  unlockTheme: (themeId: string) => void;
  setAuthProvider: (provider: AuthProviderType) => void;
  setUsername: (username: string) => void;
  setAvatar: (avatar: string) => void;
  completeOnboarding: () => void;
  generateRandomUsername: () => string;
  validateUsername: (username: string) => { valid: boolean; error?: string };
  logout: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: `user-guest-${Math.random().toString(36).substring(2, 9)}`,
  username: '',
  avatar: '🚀',
  level: 1,
  xp: 0,
  coins: 500,
  gold: 150, // Initial starter Gold bonus
  rank: 'Bronze',
  country: 'US',
  bio: 'Mastering the 2048 grid matrix.',
  joinedDate: new Date().toISOString().split('T')[0],
  isGuest: true,
  authProvider: 'guest',
  hasCompletedOnboarding: false,
};

export const getRankFromLevel = (level: number): string => {
  if (level >= 26) return 'Grandmaster';
  if (level >= 19) return 'Diamond';
  if (level >= 13) return 'Platinum';
  if (level >= 8) return 'Gold';
  if (level >= 4) return 'Silver';
  return 'Bronze';
};

export const getXPForNextLevel = (level: number): number => {
  return level * 250;
};

const PREFIXES = ['Cyber', 'Quantum', 'Nexus', 'Matrix', 'Aura', 'Hyper', 'Neon', 'Vortex', 'Pixel', 'Sonic'];
const SUFFIXES = ['Viper', 'Master', 'Merger', 'Pulse', 'Spark', 'Rider', 'Knight', 'Titan', 'Zero', 'Gamer'];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      goldTransactions: [],
      dailyStreak: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],
      dailyRewardClaimed: false,
      unlockedThemes: ['cyberpunk', 'dark', 'classic', 'minimal'],

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },

      addXP: (amount) => {
        const { profile } = get();
        let currentXP = profile.xp + amount;
        let currentLevel = profile.level;
        let leveledUp = false;

        let neededXP = getXPForNextLevel(currentLevel);
        while (currentXP >= neededXP) {
          currentXP -= neededXP;
          currentLevel += 1;
          leveledUp = true;
          neededXP = getXPForNextLevel(currentLevel);
        }

        const newRank = getRankFromLevel(currentLevel);

        set({
          profile: {
            ...profile,
            level: currentLevel,
            xp: currentXP,
            rank: newRank,
          },
        });

        return { newLevel: currentLevel, leveledUp };
      },

      addCoins: (amount) => {
        set((state) => ({
          profile: { ...state.profile, coins: state.profile.coins + amount },
        }));
      },

      addGold: (amount, description = 'Gold Pack Credit', txId) => {
        const transactionId = txId || `tx-earn-${Date.now()}`;
        const newRecord: GoldTransaction = {
          id: `gold-tx-${Date.now()}`,
          transactionId,
          packName: description,
          goldAmount: amount,
          priceINR: 0,
          date: new Date().toISOString(),
          status: 'success',
          type: 'earned',
          description,
        };

        set((state) => ({
          profile: { ...state.profile, gold: state.profile.gold + amount },
          goldTransactions: [newRecord, ...state.goldTransactions].slice(0, 30),
        }));
      },

      deductGold: (amount, description) => {
        const { profile, goldTransactions } = get();
        if (profile.gold < amount) return false;

        const newRecord: GoldTransaction = {
          id: `gold-spend-${Date.now()}`,
          transactionId: `spend-${Date.now()}`,
          packName: description,
          goldAmount: -amount,
          priceINR: 0,
          date: new Date().toISOString(),
          status: 'success',
          type: 'spent',
          description,
        };

        set({
          profile: { ...profile, gold: profile.gold - amount },
          goldTransactions: [newRecord, ...goldTransactions].slice(0, 30),
        });

        return true;
      },

      canAffordGold: (amount) => {
        return get().profile.gold >= amount;
      },

      checkDailyStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastLoginDate, dailyStreak } = get();

        if (lastLoginDate === today) return;

        const last = new Date(lastLoginDate);
        const now = new Date(today);
        const diffTime = Math.abs(now.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          set({
            dailyStreak: dailyStreak + 1,
            lastLoginDate: today,
            dailyRewardClaimed: false,
          });
        } else if (diffDays > 1) {
          set({
            dailyStreak: 1,
            lastLoginDate: today,
            dailyRewardClaimed: false,
          });
        }
      },

      claimDailyReward: () => {
        const { dailyStreak, dailyRewardClaimed } = get();
        if (dailyRewardClaimed) return 0;

        const rewardXP = Math.min(1000, 100 * dailyStreak);
        const rewardGold = Math.min(100, 10 * dailyStreak);

        get().addXP(rewardXP);
        get().addCoins(100 * dailyStreak);
        get().addGold(rewardGold, `Daily Login Streak Day ${dailyStreak} Bonus`);

        set({ dailyRewardClaimed: true });
        return rewardXP;
      },

      unlockTheme: (themeId) => {
        set((state) => ({
          unlockedThemes: [...new Set([...state.unlockedThemes, themeId])],
        }));
      },

      setAuthProvider: (provider) => {
        set((state) => ({
          profile: {
            ...state.profile,
            authProvider: provider,
            isGuest: provider === 'guest',
            id: provider === 'guest' ? state.profile.id : `user-${provider}-${Date.now()}`,
          },
        }));
      },

      setUsername: (username) => {
        set((state) => ({
          profile: { ...state.profile, username },
        }));
      },

      setAvatar: (avatar) => {
        set((state) => ({
          profile: { ...state.profile, avatar },
        }));
      },

      completeOnboarding: () => {
        set((state) => ({
          profile: { ...state.profile, hasCompletedOnboarding: true },
        }));
      },

      generateRandomUsername: () => {
        const pref = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
        const suff = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
        const num = Math.floor(Math.random() * 90) + 10;
        return `${pref}${suff}_${num}`;
      },

      validateUsername: (username) => {
        const trimmed = username.trim();
        if (trimmed.length < 3) return { valid: false, error: 'Username must be at least 3 characters long.' };
        if (trimmed.length > 20) return { valid: false, error: 'Username must not exceed 20 characters.' };
        const validPattern = /^[a-zA-Z0-9_]+$/;
        if (!validPattern.test(trimmed)) return { valid: false, error: 'Only letters, numbers, and underscores are allowed.' };
        return { valid: true };
      },

      logout: () => {
        set({
          profile: DEFAULT_PROFILE,
          goldTransactions: [],
        });
      },
    }),
    {
      name: '2048-nexus-user-v3',
    }
  )
);
