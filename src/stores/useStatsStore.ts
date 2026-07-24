import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, GameStats, LeaderboardEntry } from '../types/game';

interface MatchHistoryItem {
  id: string;
  date: string;
  score: number;
  highestTile: number;
  moves: number;
  timePlayed: number;
  mode: string;
  won: boolean;
}

interface StatsState {
  stats: GameStats;
  achievements: Achievement[];
  matchHistory: MatchHistoryItem[];
  leaderboards: {
    global: LeaderboardEntry[];
    country: LeaderboardEntry[];
    friends: LeaderboardEntry[];
  };

  // Actions
  recordGameResult: (result: {
    score: number;
    highestTile: number;
    moves: number;
    merges: number;
    timePlayed: number;
    won: boolean;
    mode: string;
  }) => { newlyUnlocked: Achievement[] };

  checkAchievements: () => Achievement[];
  getLeaderboard: (type: 'global' | 'country' | 'friends') => LeaderboardEntry[];
}

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalScore: 0,
  bestScore: 0,
  highestTile: 0,
  totalMoves: 0,
  totalMerges: 0,
  totalTimePlayed: 0,
  averageMoveTime: 0,
  dailyStreak: 1,
  lastPlayDate: new Date().toISOString().split('T')[0],
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_merge', title: 'First Merge', description: 'Merge your first pair of tiles', icon: 'Sparkles', requirementType: 'merges', requirementValue: 1, progress: 0, unlocked: false, rewardXP: 50 },
  { id: 'score_1000', title: 'Century Club', description: 'Reach a score of 1,000 in a single game', icon: 'Award', requirementType: 'score', requirementValue: 1000, progress: 0, unlocked: false, rewardXP: 100 },
  { id: 'tile_512', title: 'Half Kilobyte', description: 'Create a 512 tile', icon: 'Flame', requirementType: 'tile', requirementValue: 512, progress: 0, unlocked: false, rewardXP: 150 },
  { id: 'tile_1024', title: 'Kilo Master', description: 'Create a 1,024 tile', icon: 'Zap', requirementType: 'tile', requirementValue: 1024, progress: 0, unlocked: false, rewardXP: 250 },
  { id: 'tile_2048', title: '2048 Nexus Legend', description: 'Unlock the mythical 2048 tile!', icon: 'Trophy', requirementType: 'tile', requirementValue: 2048, progress: 0, unlocked: false, rewardXP: 500 },
  { id: 'tile_4096', title: 'Supernova', description: 'Reach beyond limit to form a 4,096 tile', icon: 'Star', requirementType: 'tile', requirementValue: 4096, progress: 0, unlocked: false, rewardXP: 1000 },
  { id: 'play_10', title: 'Puzzle Apprentice', description: 'Play 10 games of 2048 Nexus', icon: 'Gamepad2', requirementType: 'games', requirementValue: 10, progress: 0, unlocked: false, rewardXP: 150 },
  { id: 'win_5', title: 'Victory Standard', description: 'Win 5 puzzle games', icon: 'Crown', requirementType: 'wins', requirementValue: 5, progress: 0, unlocked: false, rewardXP: 250 },
  { id: 'merge_500', title: 'Merge Architect', description: 'Perform 500 total tile merges', icon: 'Layers', requirementType: 'merges', requirementValue: 500, progress: 0, unlocked: false, rewardXP: 300 },
];

const INITIAL_LEADERBOARD_GLOBAL: LeaderboardEntry[] = [
  { id: '1', rank: 1, username: 'CyberViper', avatar: '⚡', country: 'JP', score: 184520, highestTile: 4096, totalWins: 42, date: '2026-07-20' },
  { id: '2', rank: 2, username: 'QuantumMerger', avatar: '🪐', country: 'US', score: 142100, highestTile: 4096, totalWins: 31, date: '2026-07-22' },
  { id: '3', rank: 3, username: 'ZenMaster99', avatar: '☯️', country: 'DE', score: 98450, highestTile: 2048, totalWins: 24, date: '2026-07-23' },
  { id: '4', rank: 4, username: 'AuraGrid', avatar: '🔮', country: 'KR', score: 76200, highestTile: 2048, totalWins: 18, date: '2026-07-21' },
  { id: '5', rank: 5, username: 'HyperTile', avatar: '🚀', country: 'CA', score: 62400, highestTile: 2048, totalWins: 14, date: '2026-07-24' },
];

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: INITIAL_STATS,
      achievements: INITIAL_ACHIEVEMENTS,
      matchHistory: [],
      leaderboards: {
        global: INITIAL_LEADERBOARD_GLOBAL,
        country: INITIAL_LEADERBOARD_GLOBAL.filter((_, idx) => idx % 2 === 0),
        friends: INITIAL_LEADERBOARD_GLOBAL.slice(2, 5),
      },

      recordGameResult: ({ score, highestTile, moves, merges, timePlayed, won, mode }) => {
        const { stats, matchHistory, achievements } = get();

        const gamesPlayed = stats.gamesPlayed + 1;
        const gamesWon = stats.gamesWon + (won ? 1 : 0);
        const totalScore = stats.totalScore + score;
        const bestScore = Math.max(stats.bestScore, score);
        const maxTile = Math.max(stats.highestTile, highestTile);
        const totalMoves = stats.totalMoves + moves;
        const totalMerges = stats.totalMerges + merges;
        const totalTimePlayed = stats.totalTimePlayed + timePlayed;
        const avgMoveTime = totalMoves > 0 ? Number((totalTimePlayed / totalMoves).toFixed(2)) : 0;

        const newStats: GameStats = {
          ...stats,
          gamesPlayed,
          gamesWon,
          totalScore,
          bestScore,
          highestTile: maxTile,
          totalMoves,
          totalMerges,
          totalTimePlayed,
          averageMoveTime: avgMoveTime,
        };

        const newHistoryItem: MatchHistoryItem = {
          id: `match-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          score,
          highestTile,
          moves,
          timePlayed,
          mode,
          won,
        };

        const updatedHistory = [newHistoryItem, ...matchHistory].slice(0, 30); // Keep last 30 matches

        // Evaluate achievements
        const newlyUnlocked: Achievement[] = [];
        const updatedAchievements = achievements.map((ach) => {
          if (ach.unlocked) return ach;

          let val = 0;
          if (ach.requirementType === 'score') val = bestScore;
          if (ach.requirementType === 'tile') val = maxTile;
          if (ach.requirementType === 'games') val = gamesPlayed;
          if (ach.requirementType === 'wins') val = gamesWon;
          if (ach.requirementType === 'merges') val = totalMerges;
          if (ach.requirementType === 'moves') val = totalMoves;

          const unlocked = val >= ach.requirementValue;
          if (unlocked) {
            newlyUnlocked.push({ ...ach, unlocked: true });
          }

          return {
            ...ach,
            progress: Math.min(ach.requirementValue, val),
            unlocked,
            unlockedAt: unlocked ? new Date().toISOString() : undefined,
          };
        });

        set({
          stats: newStats,
          matchHistory: updatedHistory,
          achievements: updatedAchievements,
        });

        return { newlyUnlocked };
      },

      checkAchievements: () => {
        return get().achievements.filter((a) => a.unlocked);
      },

      getLeaderboard: (type) => {
        return get().leaderboards[type] || [];
      },
    }),
    {
      name: '2048-nexus-stats',
    }
  )
);
