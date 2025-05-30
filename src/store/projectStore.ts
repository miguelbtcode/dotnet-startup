// src/store/projectStore.ts
import { create } from "zustand";
import { ProjectConfig, NuGetDependency } from "../types/project";

interface ProjectStore {
  config: ProjectConfig;
  isConfigurationSaved: boolean;
  lastSavedConfig: ProjectConfig | null;

  // Configuration actions
  setConfig: (config: Partial<ProjectConfig>) => void;
  saveConfiguration: () => void;
  resetConfig: () => void;

  // Package actions
  addPackageToProject: (
    projectName: string,
    dependency: NuGetDependency
  ) => void;
  removePackageFromProject: (projectName: string, packageId: string) => void;
  updatePackageVersion: (
    projectName: string,
    packageId: string,
    newVersion: string
  ) => void;
  getProjectPackages: (projectName: string) => NuGetDependency[];
  getAllPackagesCount: () => number;

  // Validation helpers
  isBasicConfigValid: () => boolean;
  canAccessDependencies: () => boolean;
  canAccessExport: () => boolean;
  hasUnsavedChanges: () => boolean;
}

const defaultConfig: ProjectConfig = {
  name: "",
  type: "webapi",
  dotnetVersion: "8.0",
  architecture: "default",
  database: "none",
  selectedPackages: {},
  // Legacy fields with default values for backward compatibility
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

export const useProjectStore = create<ProjectStore>((set, get) => ({
  config: defaultConfig,
  isConfigurationSaved: false,
  lastSavedConfig: null,

  setConfig: (newConfig) =>
    set((state) => {
      const updatedConfig = { ...state.config, ...newConfig };

      // Debug logging
      console.log("🏪 Store setConfig called:", {
        oldConfig: state.config,
        newConfig,
        updatedConfig,
      });

      // Check if critical fields changed
      const criticalFields = [
        "name",
        "type",
        "dotnetVersion",
        "architecture",
        "database",
      ];
      const hasCriticalChanges = criticalFields.some(
        (field) =>
          state.lastSavedConfig &&
          state.lastSavedConfig[field as keyof ProjectConfig] !==
            updatedConfig[field as keyof ProjectConfig]
      );

      return {
        config: updatedConfig,
        // Reset saved status if critical fields changed
        isConfigurationSaved: hasCriticalChanges
          ? false
          : state.isConfigurationSaved,
      };
    }),

  saveConfiguration: () =>
    set((state) => ({
      isConfigurationSaved: true,
      lastSavedConfig: { ...state.config },
    })),

  resetConfig: () =>
    set({
      config: defaultConfig,
      isConfigurationSaved: false,
      lastSavedConfig: null,
    }),

  addPackageToProject: (projectName: string, dependency: NuGetDependency) =>
    set((state) => {
      const currentPackages = state.config.selectedPackages || {};
      const projectPackages = currentPackages[projectName] || [];

      // Check if package already exists
      const existingIndex = projectPackages.findIndex(
        (p) => p.id === dependency.id
      );

      let updatedProjectPackages;
      if (existingIndex >= 0) {
        // Update existing package version
        updatedProjectPackages = [...projectPackages];
        updatedProjectPackages[existingIndex] = {
          ...updatedProjectPackages[existingIndex],
          version: dependency.version,
          addedAt: new Date().toISOString(),
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
            [projectName]: updatedProjectPackages,
          },
        },
      };
    }),

  removePackageFromProject: (projectName: string, packageId: string) =>
    set((state) => {
      const currentPackages = state.config.selectedPackages || {};
      const projectPackages = currentPackages[projectName] || [];

      const updatedProjectPackages = projectPackages.filter(
        (p) => p.id !== packageId
      );

      return {
        config: {
          ...state.config,
          selectedPackages: {
            ...currentPackages,
            [projectName]: updatedProjectPackages,
          },
        },
      };
    }),

  updatePackageVersion: (
    projectName: string,
    packageId: string,
    newVersion: string
  ) =>
    set((state) => {
      const currentPackages = state.config.selectedPackages || {};
      const projectPackages = currentPackages[projectName] || [];

      const updatedProjectPackages = projectPackages.map((p) =>
        p.id === packageId
          ? { ...p, version: newVersion, addedAt: new Date().toISOString() }
          : p
      );

      return {
        config: {
          ...state.config,
          selectedPackages: {
            ...currentPackages,
            [projectName]: updatedProjectPackages,
          },
        },
      };
    }),

  getProjectPackages: (projectName: string) => {
    const state = get();
    return state.config.selectedPackages?.[projectName] || [];
  },

  getAllPackagesCount: () => {
    const state = get();
    const selectedPackages = state.config.selectedPackages || {};
    return Object.values(selectedPackages).reduce(
      (total, packages) => total + packages.length,
      0
    );
  },

  // Validation helpers
  isBasicConfigValid: () => {
    const state = get();
    return !!(state.config.name && state.config.name.trim().length > 0);
  },

  canAccessDependencies: () => {
    const state = get();
    return state.isBasicConfigValid() && state.isConfigurationSaved;
  },

  canAccessExport: () => {
    const state = get();
    return state.isBasicConfigValid() && state.isConfigurationSaved;
  },

  hasUnsavedChanges: () => {
    const state = get();
    if (!state.lastSavedConfig) return state.isBasicConfigValid();

    const criticalFields = [
      "name",
      "type",
      "dotnetVersion",
      "architecture",
      "database",
    ];
    return criticalFields.some(
      (field) =>
        state.config[field as keyof ProjectConfig] !==
        state.lastSavedConfig![field as keyof ProjectConfig]
    );
  },
}));
