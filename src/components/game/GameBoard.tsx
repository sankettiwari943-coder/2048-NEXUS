import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Bot, Flame, RotateCcw } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { THEMES } from '../../utils/themes';
import { Tile } from './Tile';
import { AIHintOverlay } from './AIHintOverlay';
import { Button } from '../ui/Button';

export const GameBoard: React.FC = () => {
  const {
    grid,
    status,
    mode,
    score,
    showHintOverlay,
    hint,
    makeMove,
    initGame,
    undo,
  } = useGameStore();

  const { theme } = useSettingsStore();
  const currentTheme = THEMES[theme] || THEMES.dark;

  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          makeMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          makeMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          makeMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          makeMove('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, makeMove]);

  // Confetti on Win
  useEffect(() => {
    if (status === 'won') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [status]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (status !== 'playing') return;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current || status !== 'playing') return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartPos.current.x;
    const deltaY = touch.clientY - touchStartPos.current.y;

    const minThreshold = 30; // Min px swipe distance

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minThreshold) {
        if (deltaX > 0) makeMove('RIGHT');
        else makeMove('LEFT');
      }
    } else {
      if (Math.abs(deltaY) > minThreshold) {
        if (deltaY > 0) makeMove('DOWN');
        else makeMove('UP');
      }
    }

    touchStartPos.current = null;
  };

  // Flatten active non-null tiles for smooth rendering
  const activeTiles = grid.flatMap((row) => row.filter((t): t is NonNullable<typeof t> => t !== null));

  return (
    <div className="relative w-full max-w-md aspect-square mx-auto my-4 select-none touch-none">
      {/* Outer Board Box */}
      <div
        ref={boardRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full h-full rounded-3xl p-3 shadow-2xl transition-colors duration-300 ${currentTheme.boardBg}`}
      >
        {/* 4x4 Grid Empty Cell Placeholders */}
        <div className="grid grid-cols-4 grid-rows-4 gap-3 w-full h-full">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className={`w-full h-full rounded-2xl transition-colors ${currentTheme.emptyCellBg}`}
            />
          ))}
        </div>

        {/* Active Animated Tiles */}
        <div className="absolute inset-3 pointer-events-none">
          <AnimatePresence>
            {activeTiles.map((tile) => (
              <Tile key={tile.id} tile={tile} />
            ))}
          </AnimatePresence>
        </div>

        {/* AI Hint Directional Overlay */}
        {showHintOverlay && <AIHintOverlay hint={hint} />}

        {/* Paused Overlay */}
        {status === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md rounded-3xl p-6 text-center"
          >
            <h3 className="text-3xl font-extrabold text-white mb-2">Game Paused</h3>
            <p className="text-sm text-slate-300 mb-6">Take a break or resume your nexus puzzle.</p>
            <Button variant="primary" size="lg" onClick={() => useGameStore.getState().togglePause()}>
              Resume Game
            </Button>
          </motion.div>
        )}

        {/* Victory Screen Overlay */}
        {status === 'won' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-b from-blue-950/90 via-purple-950/90 to-black/95 backdrop-blur-md rounded-3xl p-6 text-center border-2 border-amber-400/50 shadow-glow-gold"
          >
            <Trophy className="w-16 h-16 text-amber-400 mb-2 animate-bounce" />
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
              2048 UNLOCKED!
            </h3>
            <p className="text-sm text-slate-200 mt-1 mb-4">You have mastered the matrix. High Score: {score}</p>
            <div className="flex gap-3">
              <Button variant="accent" onClick={() => initGame('endless')} icon={<Flame className="w-4 h-4" />}>
                Keep Playing
              </Button>
              <Button variant="primary" onClick={() => initGame()} icon={<RefreshCw className="w-4 h-4" />}>
                Play Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Game Over Screen Overlay */}
        {status === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md rounded-3xl p-6 text-center border border-rose-500/30"
          >
            <h3 className="text-3xl font-extrabold text-rose-400 mb-1">Game Over</h3>
            <p className="text-sm text-slate-300 mb-4">No more moves remaining! Final score: <span className="text-amber-400 font-bold">{score}</span></p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={undo} icon={<RotateCcw className="w-4 h-4" />}>
                Undo Move
              </Button>
              <Button variant="primary" onClick={() => initGame()} icon={<RefreshCw className="w-4 h-4" />}>
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
