import React from 'react';
import { Settings, Volume2, VolumeX, Music, Eye, Monitor, RotateCcw, Palette } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { THEMES } from '../../utils/themes';
import { ThemeId } from '../../types/game';
import { ModalContainer } from '../ui/ModalContainer';
import { Button } from '../ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    setTheme,
    soundVolume,
    setSoundVolume,
    musicVolume,
    setMusicVolume,
    colorblindMode,
    toggleColorblindMode,
    largeTextMode,
    toggleLargeTextMode,
    reducedMotion,
    toggleReducedMotion,
    fpsLimit,
    setFpsLimit,
  } = useSettingsStore();

  const themeList = Object.values(THEMES);

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Game Settings"
      subtitle="Customize themes, audio FX, accessibility & graphics"
      icon={<Settings className="w-6 h-6 text-slate-300" />}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* THEME SELECTOR GRID */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-purple-400" />
            Visual Themes (8 Themes)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {themeList.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as ThemeId)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-400 shadow-glow-blue scale-105'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white mb-0.5">{t.name}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{t.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AUDIO SLIDERS */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-blue-400" />
            Audio Engine Controls
          </label>

          {/* Sound FX Volume */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                {soundVolume > 0 ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                Sound Effects
              </span>
              <span className="text-slate-400 font-mono">{Math.round(soundVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-purple-400" />
                Ambient Synth Music
              </span>
              <span className="text-slate-400 font-mono">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* ACCESSIBILITY & GRAPHICS */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            Accessibility & Visuals
          </label>

          {/* Colorblind mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Colorblind Palette Assist</div>
              <div className="text-[11px] text-slate-400">Shows logarithmic numbers on tiles</div>
            </div>
            <input
              type="checkbox"
              checked={colorblindMode}
              onChange={toggleColorblindMode}
              className="w-4 h-4 accent-blue-500 cursor-pointer rounded"
            />
          </div>

          {/* Large text mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Large Typography</div>
              <div className="text-[11px] text-slate-400">Increases font sizes on tiles</div>
            </div>
            <input
              type="checkbox"
              checked={largeTextMode}
              onChange={toggleLargeTextMode}
              className="w-4 h-4 accent-blue-500 cursor-pointer rounded"
            />
          </div>

          {/* Reduced motion */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Reduced Motion</div>
              <div className="text-[11px] text-slate-400">Disables 3D background animation for lower GPUs</div>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={toggleReducedMotion}
              className="w-4 h-4 accent-blue-500 cursor-pointer rounded"
            />
          </div>

          {/* FPS Limit */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Target Frame Rate</div>
              <div className="text-[11px] text-slate-400">Select rendering frame rate</div>
            </div>
            <div className="flex gap-1">
              {[30, 60, 120].map((fps) => (
                <button
                  key={fps}
                  onClick={() => setFpsLimit(fps)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    fpsLimit === fps ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESET DATA BUTTON */}
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all game data and stats?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            fullWidth
          >
            Reset All Game Progress & Statistics
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
};
