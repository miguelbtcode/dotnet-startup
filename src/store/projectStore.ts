import { create } from 'zustand';
import { ProjectConfig } from '../types/project';

interface ProjectStore {
  config: ProjectConfig;
  setConfig: (config: Partial<ProjectConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: ProjectConfig = {
  name: '',
  type: 'webapi',
  dotnetVersion: '8.0',
  architecture: 'default',
  database: 'none',
  features: {
    jwt: false,
    swagger: false,
    docker: false,
    testing: false,
    cors: false,
    logging: false,
    healthChecks: false,
  },
};

export const useProjectStore = create<ProjectStore>((set) => ({
  config: defaultConfig,
  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),
  resetConfig: () => set({ config: defaultConfig }),
}));