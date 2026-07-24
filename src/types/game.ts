export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface TileData {
  id: string;
  value: number;
  row: number;
  col: number;
  mergedFrom?: TileData[];
  isNew?: boolean;
}

export type GameMode = 
  | 'classic'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'zen'
  | 'timed'
  | 'challenge'
  | 'endless';

export type AIDifficulty = 'easy' | 'medium' | 'expert';

export type ThemeId = 
  | 'classic'
  | 'neon'
  | 'cyberpunk'
  | 'galaxy'
  | 'minimal'
  | 'retro'
  | 'dark'
  | 'light';

export interface HintResult {
  bestMove: Direction | null;
  winProbability: number; // 0 to 100
  riskLevel: 'low' | 'medium' | 'high';
  scoreGain: number;
  futureScoreEstimate: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
  highestTile: number;
  totalMoves: number;
  totalMerges: number;
  totalTimePlayed: number; // in seconds
  averageMoveTime: number; // in seconds
  dailyStreak: number;
  lastPlayDate: string;
}

export type AuthProviderType = 'guest' | 'google' | 'facebook' | 'apple' | 'play_games' | 'email';

export interface GoldTransaction {
  id: string;
  transactionId: string;
  packName: string;
  goldAmount: number;
  priceINR: number;
  date: string;
  status: 'pending' | 'success' | 'failed';
  type: 'purchase' | 'earned' | 'spent';
  description: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  gold: number;
  rank: string;
  country: string;
  bio?: string;
  joinedDate: string;
  isGuest: boolean;
  authProvider: AuthProviderType;
  hasCompletedOnboarding: boolean;
}

export interface GoldPack {
  id: string;
  name: string;
  gold: number;
  bonusPercent: number;
  priceINR: number;
  tag?: string;
  icon: string;
  glow: 'blue' | 'purple' | 'gold' | 'cyan';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirementType: 'score' | 'tile' | 'wins' | 'games' | 'merges' | 'moves' | 'streak';
  requirementValue: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rewardXP: number;
  rewardGold?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetTile: number;
  maxMoves?: number;
  timeLimit?: number;
  rewardXP: number;
  rewardGold?: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  country: string;
  score: number;
  highestTile: number;
  totalWins: number;
  date: string;
}
