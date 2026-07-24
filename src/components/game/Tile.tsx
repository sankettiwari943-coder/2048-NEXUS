import React from 'react';
import { motion } from 'framer-motion';
import { TileData } from '../../types/game';
import { THEMES } from '../../utils/themes';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface TileProps {
  tile: TileData;
}

export const Tile: React.FC<TileProps> = ({ tile }) => {
  const { theme, colorblindMode, largeTextMode } = useSettingsStore();

  const currentTheme = THEMES[theme] || THEMES.dark;
  const styleConfig = currentTheme.tileStyles[tile.value] || currentTheme.defaultTileStyle;

  // Grid offsets calculation for 4x4 matrix (percentage layout)
  const topPercent = tile.row * 25;
  const leftPercent = tile.col * 25;

  const fontSizes: Record<number, string> = {
    2: largeTextMode ? 'text-3xl font-extrabold' : 'text-2xl sm:text-3xl font-bold',
    4: largeTextMode ? 'text-3xl font-extrabold' : 'text-2xl sm:text-3xl font-bold',
    8: largeTextMode ? 'text-3xl font-extrabold' : 'text-2xl sm:text-3xl font-bold',
    16: largeTextMode ? 'text-3xl font-extrabold' : 'text-2xl sm:text-3xl font-bold',
    32: largeTextMode ? 'text-3xl font-extrabold' : 'text-2xl sm:text-3xl font-bold',
    64: largeTextMode ? 'text-3xl font-extrabold' : 'text-2xl sm:text-3xl font-bold',
    128: largeTextMode ? 'text-2xl font-extrabold' : 'text-xl sm:text-2xl font-extrabold',
    256: largeTextMode ? 'text-2xl font-extrabold' : 'text-xl sm:text-2xl font-extrabold',
    512: largeTextMode ? 'text-2xl font-extrabold' : 'text-xl sm:text-2xl font-extrabold',
    1024: largeTextMode ? 'text-xl font-extrabold' : 'text-lg sm:text-xl font-black',
    2048: largeTextMode ? 'text-xl font-extrabold' : 'text-lg sm:text-xl font-black',
    4096: largeTextMode ? 'text-lg font-extrabold' : 'text-base sm:text-lg font-black',
  };

  const isMerged = !!tile.mergedFrom;

  return (
    <motion.div
      layoutId={tile.id}
      initial={tile.isNew ? { scale: 0, opacity: 0 } : false}
      animate={{
        scale: isMerged ? [1, 1.15, 1] : 1,
        opacity: 1,
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 25,
      }}
      style={{
        position: 'absolute',
        width: '25%',
        height: '25%',
        padding: '5px',
      }}
    >
      <div
        className={`w-full h-full rounded-2xl flex flex-col items-center justify-center select-none transition-all duration-150 ${styleConfig.bg} ${styleConfig.text} ${styleConfig.glow || ''} ${styleConfig.border || ''}`}
      >
        <span className={fontSizes[tile.value] || 'text-sm font-bold'}>
          {tile.value}
        </span>
        {colorblindMode && (
          <span className="text-[10px] opacity-75 font-mono">
            {Math.log2(tile.value)}
          </span>
        )}
      </div>
    </motion.div>
  );
};
