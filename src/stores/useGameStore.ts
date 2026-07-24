import { create } from 'zustand';
import { Direction, GameMode, HintResult, TileData, AIDifficulty } from '../types/game';
import { GameEngine } from '../engine/GameEngine';
import { AISolver } from '../engine/AISolver';
import { SoundEngine } from '../engine/SoundEngine';
import { useStatsStore } from './useStatsStore';
import { useUserStore } from './useUserStore';
import { useSettingsStore } from './useSettingsStore';

interface GameState {
  grid: (TileData | null)[][];
  score: number;
  bestScore: number;
  mode: GameMode;
  status: 'idle' | 'playing' | 'paused' | 'won' | 'gameover';
  undoStack: { grid: (TileData | null)[][]; score: number }[];
  hint: HintResult | null;
  showHintOverlay: boolean;
  timeRemaining: number; // for Timed Mode (seconds)
  sessionStartTime: number | null;
  sessionMoves: number;
  sessionMerges: number;
  highestTileInSession: number;

  // Actions
  initGame: (mode?: GameMode) => void;
  makeMove: (direction: Direction) => boolean;
  undo: () => void;
  togglePause: () => void;
  toggleHintOverlay: () => void;
  requestHint: () => boolean;
  executeSingleAIMove: (difficulty?: AIDifficulty) => boolean;
  tickTimer: () => void;
}

export const useGameStore = create<GameState>()((set, get) => ({
  grid: GameEngine.createEmptyGrid(),
  score: 0,
  bestScore: 0,
  mode: 'classic',
  status: 'idle',
  undoStack: [],
  hint: null,
  showHintOverlay: false,
  timeRemaining: 120,
  sessionStartTime: null,
  sessionMoves: 0,
  sessionMerges: 0,
  highestTileInSession: 0,

  initGame: (mode) => {
    const selectedMode = mode || get().mode;
    let emptyGrid = GameEngine.createEmptyGrid();

    // Spawn 2 initial tiles
    const spawn1 = GameEngine.spawnRandomTile(emptyGrid, selectedMode);
    const spawn2 = GameEngine.spawnRandomTile(spawn1.grid, selectedMode);

    const initialBestScore = useStatsStore.getState().stats.bestScore;

    set({
      grid: spawn2.grid,
      score: 0,
      bestScore: initialBestScore,
      mode: selectedMode,
      status: 'playing',
      undoStack: [],
      hint: null,
      showHintOverlay: false,
      timeRemaining: selectedMode === 'timed' ? 120 : 0,
      sessionStartTime: Date.now(),
      sessionMoves: 0,
      sessionMerges: 0,
      highestTileInSession: GameEngine.getHighestTile(spawn2.grid),
    });
  },

  makeMove: (direction) => {
    const { grid, score, mode, status, undoStack, sessionMoves, sessionMerges, highestTileInSession } = get();

    if (status !== 'playing') return false;

    const res = GameEngine.move(grid, direction);
    if (!res.moved) return false;

    // Play move or merge sound
    const { soundEnabled, soundVolume } = useSettingsStore.getState();
    if (soundEnabled) {
      if (res.mergesCount > 0) {
        SoundEngine.playMerge(res.mergedMaxTile, soundVolume);
      } else {
        SoundEngine.playMove(soundVolume);
      }
    }

    // Save previous state to undo stack (max 5 undos)
    const newUndoStack = [{ grid: GameEngine.cloneGrid(grid), score }, ...undoStack].slice(0, 5);

    // Spawn new tile after move
    const spawnRes = GameEngine.spawnRandomTile(res.grid, mode);
    const newGrid = spawnRes.grid;

    const newScore = score + res.score;
    const statsBest = useStatsStore.getState().stats.bestScore;
    const newBestScore = Math.max(statsBest, newScore);
    const currentMaxTile = GameEngine.getHighestTile(newGrid);
    const newHighestTile = Math.max(highestTileInSession, currentMaxTile);

    const newMoves = sessionMoves + 1;
    const newMerges = sessionMerges + res.mergesCount;

    let newStatus: 'playing' | 'won' | 'gameover' = 'playing';

    // Check Win condition (2048 tile reached for first time in non-endless/zen)
    if (currentMaxTile >= 2048 && status === 'playing' && mode !== 'endless' && mode !== 'zen' && highestTileInSession < 2048) {
      newStatus = 'won';
      if (soundEnabled) SoundEngine.playWin(soundVolume);
    }

    // Check Game Over condition
    if (!GameEngine.hasMovesLeft(newGrid) && mode !== 'zen') {
      newStatus = 'gameover';
      if (soundEnabled) SoundEngine.playGameOver(soundVolume);

      // Record match analytics
      const timePlayed = get().sessionStartTime ? Math.round((Date.now() - get().sessionStartTime!) / 1000) : 0;
      const { newlyUnlocked } = useStatsStore.getState().recordGameResult({
        score: newScore,
        highestTile: newHighestTile,
        moves: newMoves,
        merges: newMerges,
        timePlayed,
        won: false,
        mode,
      });

      // Grant XP for newly unlocked achievements
      newlyUnlocked.forEach((ach) => useUserStore.getState().addXP(ach.rewardXP));
      // Base XP for completing game
      useUserStore.getState().addXP(Math.round(newScore / 20) + newMoves);
    }

    set({
      grid: newGrid,
      score: newScore,
      bestScore: newBestScore,
      undoStack: newUndoStack,
      status: newStatus,
      sessionMoves: newMoves,
      sessionMerges: newMerges,
      highestTileInSession: newHighestTile,
      hint: null, // Reset hint after move execution
    });

    return true;
  },

  undo: () => {
    const { undoStack, status } = get();
    if (undoStack.length === 0 || status === 'gameover') return;

    const previous = undoStack[0];
    set({
      grid: previous.grid,
      score: previous.score,
      undoStack: undoStack.slice(1),
      status: 'playing',
      hint: null,
    });
  },

  togglePause: () => {
    const { status } = get();
    if (status === 'playing') set({ status: 'paused' });
    else if (status === 'paused') set({ status: 'playing' });
  },

  toggleHintOverlay: () => {
    const nextState = !get().showHintOverlay;
    set({ showHintOverlay: nextState });
    if (nextState) {
      get().requestHint();
    }
  },

  requestHint: () => {
    const { grid, status } = get();
    if (status !== 'playing') return false;

    const hintRes = AISolver.getHint(grid);
    set({ hint: hintRes, showHintOverlay: true });
    return true;
  },

  /**
   * CRITICAL FIX: Executes EXACTLY ONE AI move and returns control to player immediately.
   * NEVER loops automatically!
   */
  executeSingleAIMove: (difficulty = 'expert') => {
    const { grid, status } = get();
    if (status !== 'playing') return false;

    const bestDir = AISolver.getAutoMove(grid, difficulty);
    if (bestDir) {
      // Performs ONE SINGLE MOVE
      return get().makeMove(bestDir);
    }
    return false;
  },

  tickTimer: () => {
    const { timeRemaining, mode, status } = get();
    if (mode !== 'timed' || status !== 'playing') return;

    if (timeRemaining <= 1) {
      set({ status: 'gameover', timeRemaining: 0 });
      const { soundEnabled, soundVolume } = useSettingsStore.getState();
      if (soundEnabled) SoundEngine.playGameOver(soundVolume);
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },
}));
