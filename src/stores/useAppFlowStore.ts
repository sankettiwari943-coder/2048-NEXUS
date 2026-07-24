import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppScreen =
  | 'splash'
  | 'loading_assets'
  | 'auth'
  | 'username_setup'
  | 'avatar_setup'
  | 'cloud_sync'
  | 'main_menu'
  | 'in_game';

interface AppFlowState {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

export const useAppFlowStore = create<AppFlowState>()(
  persist(
    (set) => ({
      screen: 'splash',
      setScreen: (screen) => set({ screen }),
    }),
    {
      name: '2048-nexus-flow-v2',
    }
  )
);
