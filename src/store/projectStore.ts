// src/store/projectStore.ts
import { create } from 'zustand';
import { ProjectConfig, NuGetDependency } from '../types/project';

interface ProjectStore {
  config: ProjectConfig;
  setConfig: (config: Partial<ProjectConfig>) => void;
  resetConfig: () => void;
  addPackageToProject: (projectName: string, dependency: NuGetDependency) => void;
  removePackageFromProject: (projectName: string, packageId: string) => void;
  updatePackageVersion: (projectName: string, packageId: string, newVersion: string) => void;
  getProjectPackages: (projectName: string) => NuGetDependency[];
  getAllPackagesCount: () => number;
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
  selectedPackages: {},
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  config: defaultConfig,
  
  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),
  
  resetConfig: () => set({ config: defaultConfig }),
  
  addPackageToProject: (projectName: string, dependency: NuGetDependency) =>
    set((state) => {
      const currentPackages = state.config.selectedPackages || {};
      const projectPackages = currentPackages[projectName] || [];
      
      // Check if package already exists
      const existingIndex = projectPackages.findIndex(p => p.id === dependency.id);
      
      let updatedProjectPackages;
      if (existingIndex >= 0) {
        // Update existing package version
        updatedProjectPackages = [...projectPackages];
        updatedProjectPackages[existingIndex] = {
          ...updatedProjectPackages[existingIndex],
          version: dependency.version,
          addedAt: new Date().toISOString()
        };
      } else {
        // Add new package
        updatedProjectPackages = [...projectPackages, dependency];
      }
      
      return {
        config: {
          ...state.config,
          selectedPackages: {
            ...currentPackages,
            [projectName]: updatedProjectPackages
          }
        }
      };
    }),
  
  removePackageFromProject: (projectName: string, packageId: string) =>
    set((state) => {
      const currentPackages = state.config.selectedPackages || {};
      const projectPackages = currentPackages[projectName] || [];
      
      const updatedProjectPackages = projectPackages.filter(p => p.id !== packageId);
      
      return {
        config: {
          ...state.config,
          selectedPackages: {
            ...currentPackages,
            [projectName]: updatedProjectPackages
          }
        }
      };
    }),
  
  updatePackageVersion: (projectName: string, packageId: string, newVersion: string) =>
    set((state) => {
      const currentPackages = state.config.selectedPackages || {};
      const projectPackages = currentPackages[projectName] || [];
      
      const updatedProjectPackages = projectPackages.map(p => 
        p.id === packageId 
          ? { ...p, version: newVersion, addedAt: new Date().toISOString() }
          : p
      );
      
      return {
        config: {
          ...state.config,
          selectedPackages: {
            ...currentPackages,
            [projectName]: updatedProjectPackages
          }
        }
      };
    }),
  
  getProjectPackages: (projectName: string) => {
    const state = get();
    return state.config.selectedPackages?.[projectName] || [];
  },
  
  getAllPackagesCount: () => {
    const state = get();
    const selectedPackages = state.config.selectedPackages || {};
    return Object.values(selectedPackages).reduce((total, packages) => total + packages.length, 0);
  },
}));