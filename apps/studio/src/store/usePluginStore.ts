import { create } from 'zustand';
import type { PluginManifestV2 } from '../services/PluginRegistry';

export interface PluginState {
  availablePlugins: PluginManifestV2[];
  installedPluginIds: string[];
  enabledPluginIds: string[];
  
  setAvailablePlugins: (plugins: PluginManifestV2[]) => void;
  installPlugin: (id: string) => void;
  togglePluginEnabled: (id: string) => void;
  uninstallPlugin: (id: string) => void;
}

export const usePluginStore = create<PluginState>((set) => ({
  availablePlugins: [],
  installedPluginIds: ['plugin-dealer-net', 'plugin-telegram'], // Defaults for demo
  enabledPluginIds: ['plugin-dealer-net', 'plugin-telegram'],

  setAvailablePlugins: (plugins) => set({ availablePlugins: plugins }),
  
  installPlugin: (id) => set((state) => ({
    installedPluginIds: state.installedPluginIds.includes(id) 
      ? state.installedPluginIds 
      : [...state.installedPluginIds, id],
    enabledPluginIds: state.enabledPluginIds.includes(id)
      ? state.enabledPluginIds
      : [...state.enabledPluginIds, id]
  })),

  togglePluginEnabled: (id) => set((state) => ({
    enabledPluginIds: state.enabledPluginIds.includes(id)
      ? state.enabledPluginIds.filter(e => e !== id)
      : [...state.enabledPluginIds, id]
  })),

  uninstallPlugin: (id) => set((state) => ({
    installedPluginIds: state.installedPluginIds.filter(i => i !== id),
    enabledPluginIds: state.enabledPluginIds.filter(e => e !== id)
  }))
}));
