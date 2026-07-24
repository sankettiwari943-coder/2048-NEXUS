import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeId } from '../types/game';

interface SettingsState {
  theme: ThemeId;
  soundVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  soundEnabled: boolean;
  musicEnabled: boolean;
  colorblindMode: boolean;
  largeTextMode: boolean;
  reducedMotion: boolean;
  fpsLimit: number; // 30, 60, 120

  setTheme: (theme: ThemeId) => void;
  setSoundVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleColorblindMode: () => void;
  toggleLargeTextMode: () => void;
  toggleReducedMotion: () => void;
  setFpsLimit: (limit: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'cyberpunk',
      soundVolume: 0.7,
      musicVolume: 0.4,
      soundEnabled: true,
      musicEnabled: true,
      colorblindMode: false,
      largeTextMode: false,
      reducedMotion: false,
      fpsLimit: 60,

      setTheme: (theme) => set({ theme }),
      setSoundVolume: (soundVolume) => set({ soundVolume, soundEnabled: soundVolume > 0 }),
      setMusicVolume: (musicVolume) => set({ musicVolume, musicEnabled: musicVolume > 0 }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
      toggleColorblindMode: () => set((state) => ({ colorblindMode: !state.colorblindMode })),
      toggleLargeTextMode: () => set((state) => ({ largeTextMode: !state.largeTextMode })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      setFpsLimit: (fpsLimit) => set({ fpsLimit }),
    }),
    {
      name: '2048-nexus-settings',
    }
  )
);
