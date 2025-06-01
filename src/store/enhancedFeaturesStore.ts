// src/store/enhancedFeaturesStore.ts
import { create } from "zustand";
import {
  FeatureGroup,
  SelectedFeatures,
  FeatureValidation,
  FeatureConfiguration,
  FeatureComplexity,
} from "../types/features";
import { enhancedFeatureGroups } from "../data/enhancedFeatures";

interface EnhancedFeaturesStore {
  selectedFeatures: SelectedFeatures;
  currentArchitecture: string;
  currentProjectType: string;

  // Computed states
  configuration: FeatureConfiguration;
  validation: FeatureValidation;
  estimatedSetupTime: number;

  // Actions
  selectFeature: (groupId: string, optionId: string) => void;
  toggleMultipleFeature: (groupId: string, optionId: string) => void;
  clearGroup: (groupId: string) => void;
  resetAllFeatures: () => void;
  setArchitecture: (architecture: string) => void;
  setProjectType: (projectType: string) => void;

  // Validation & Analysis
  validateFeatures: () => FeatureValidation;
  getFeatureConfiguration: () => FeatureConfiguration;
  getAvailableGroups: () => FeatureGroup[];
  getSelectedPackages: () => string[];
  getConfigFiles: () => string[];

  // Presets
  applyPreset: (preset: { features: SelectedFeatures }) => void;
  createPreset: () => {
    features: SelectedFeatures;
    complexity: FeatureComplexity;
  };
}

export const useEnhancedFeaturesStore = create<EnhancedFeaturesStore>(
  (set, get) => ({
    selectedFeatures: {},
    currentArchitecture: "clean",
    currentProjectType: "webapi",
    configuration: {
      selectedFeatures: {},
      complexity: "Beginner",
      estimatedSetupTime: 0,
      totalPackages: 0,
      configFilesCount: 0,
    },
    validation: {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
    },
    estimatedSetupTime: 0,

    selectFeature: (groupId, optionId) => {
      set((state) => {
        const group = enhancedFeatureGroups.find((g) => g.id === groupId);
        if (!group) return state;

        const newSelectedFeatures = { ...state.selectedFeatures };

        if (group.allowMultiple) {
          // Handle multiple selection
          const currentSelection = Array.isArray(newSelectedFeatures[groupId])
            ? (newSelectedFeatures[groupId] as string[])
            : newSelectedFeatures[groupId]
            ? [newSelectedFeatures[groupId] as string]
            : [];

          if (currentSelection.includes(optionId)) {
            newSelectedFeatures[groupId] = currentSelection.filter(
              (id) => id !== optionId
            );
          } else {
            newSelectedFeatures[groupId] = [...currentSelection, optionId];
          }
        } else {
          // Handle single selection
          newSelectedFeatures[groupId] = optionId;
        }

        const newState = {
          ...state,
          selectedFeatures: newSelectedFeatures,
        };

        // Update computed states
        const validation = get().validateFeatures();
        const configuration = get().getFeatureConfiguration();

        return {
          ...newState,
          validation,
          configuration,
          estimatedSetupTime: configuration.estimatedSetupTime,
        };
      });
    },

    toggleMultipleFeature: (groupId, optionId) => {
      const group = enhancedFeatureGroups.find((g) => g.id === groupId);
      if (group?.allowMultiple) {
        get().selectFeature(groupId, optionId);
      }
    },

    clearGroup: (groupId) => {
      set((state) => {
        const newSelectedFeatures = { ...state.selectedFeatures };
        delete newSelectedFeatures[groupId];

        return {
          ...state,
          selectedFeatures: newSelectedFeatures,
        };
      });

      // Update computed states
      const validation = get().validateFeatures();
      const configuration = get().getFeatureConfiguration();
      set({
        validation,
        configuration,
        estimatedSetupTime: configuration.estimatedSetupTime,
      });
    },

    resetAllFeatures: () => {
      set({
        selectedFeatures: {},
        validation: {
          isValid: true,
          errors: [],
          warnings: [],
          suggestions: [],
        },
        configuration: {
          selectedFeatures: {},
          complexity: "Beginner",
          estimatedSetupTime: 0,
          totalPackages: 0,
          configFilesCount: 0,
        },
        estimatedSetupTime: 0,
      });
    },

    setArchitecture: (architecture) => {
      set((state) => ({
        ...state,
        currentArchitecture: architecture,
      }));

      // Revalidate features for new architecture
      const validation = get().validateFeatures();
      const configuration = get().getFeatureConfiguration();
      set({ validation, configuration });
    },

    setProjectType: (projectType) => {
      set((state) => ({
        ...state,
        currentProjectType: projectType,
      }));
    },

    validateFeatures: () => {
      const { selectedFeatures, currentArchitecture } = get();
      const errors: string[] = [];
      const warnings: string[] = [];
      const suggestions: string[] = [];

      // Check dependencies
      Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
        const group = enhancedFeatureGroups.find((g) => g.id === groupId);
        if (!group) return;

        const selectedIds = Array.isArray(selection) ? selection : [selection];

        selectedIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (!option) return;

          // Check architecture restrictions
          if (option.architectureRestrictions?.includes(currentArchitecture)) {
            errors.push(
              `${option.title} is not compatible with ${currentArchitecture} architecture`
            );
          }

          if (
            option.architectureRequired &&
            !option.architectureRequired.includes(currentArchitecture)
          ) {
            errors.push(
              `${
                option.title
              } is only available for ${option.architectureRequired.join(
                ", "
              )} architectures`
            );
          }

          // Check dependencies
          option.dependencies?.forEach((depId) => {
            const hasRequiredDependency = Object.values(selectedFeatures).some(
              (sel) =>
                Array.isArray(sel) ? sel.includes(depId) : sel === depId
            );

            if (!hasRequiredDependency) {
              const depOption = enhancedFeatureGroups
                .flatMap((g) => g.options)
                .find((o) => o.id === depId);

              if (depOption) {
                warnings.push(
                  `${option.title} works best with ${depOption.title}`
                );
              }
            }
          });

          // Check incompatibilities
          option.incompatibleWith?.forEach((incompatibleId) => {
            const hasIncompatible = Object.values(selectedFeatures).some(
              (sel) =>
                Array.isArray(sel)
                  ? sel.includes(incompatibleId)
                  : sel === incompatibleId
            );

            if (hasIncompatible) {
              const incompatibleOption = enhancedFeatureGroups
                .flatMap((g) => g.options)
                .find((o) => o.id === incompatibleId);

              if (incompatibleOption) {
                errors.push(
                  `${option.title} is incompatible with ${incompatibleOption.title}`
                );
              }
            }
          });
        });
      });

      // Add suggestions for common patterns
      if (
        selectedFeatures.authentication === "jwt" &&
        !selectedFeatures.documentation
      ) {
        suggestions.push(
          "Consider adding Swagger documentation to test JWT authentication easily"
        );
      }

      if (selectedFeatures.cqrs && !selectedFeatures.logging) {
        suggestions.push(
          "Structured logging with Serilog pairs well with CQRS for better observability"
        );
      }

      if (selectedFeatures.events && !selectedFeatures.error_handling) {
        suggestions.push(
          "Result patterns help handle event processing errors gracefully"
        );
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
      };
    },

    getFeatureConfiguration: () => {
      const { selectedFeatures } = get();
      const allSelectedOptions = enhancedFeatureGroups.flatMap((group) => {
        const selection = selectedFeatures[group.id];
        if (!selection) return [];

        const selectedIds = Array.isArray(selection) ? selection : [selection];
        return selectedIds
          .map((id) => group.options.find((o) => o.id === id))
          .filter(Boolean);
      });

      // Calculate complexity
      const complexityScores = allSelectedOptions.map((option) => {
        switch (option!.complexity) {
          case "Advanced":
            return 3;
          case "Intermediate":
            return 2;
          case "Beginner":
            return 1;
          default:
            return 1;
        }
      });

      const avgComplexity =
        complexityScores.length > 0
          ? complexityScores.reduce((a, b) => a + b, 0) /
            complexityScores.length
          : 1;

      const complexity: FeatureComplexity =
        avgComplexity >= 2.5
          ? "Advanced"
          : avgComplexity >= 1.5
          ? "Intermediate"
          : "Beginner";

      // Calculate setup time (in minutes)
      const timeEstimates = {
        Beginner: 15,
        Intermediate: 30,
        Advanced: 60,
      };

      const estimatedSetupTime = allSelectedOptions.reduce((total, option) => {
        return total + timeEstimates[option!.complexity];
      }, 0);

      // Count packages and config files
      const totalPackages = allSelectedOptions.reduce((total, option) => {
        return total + (option!.nugetPackages?.length || 0);
      }, 0);

      const configFilesCount = allSelectedOptions.reduce((total, option) => {
        return total + (option!.configFiles?.length || 0);
      }, 0);

      return {
        selectedFeatures,
        complexity,
        estimatedSetupTime,
        totalPackages,
        configFilesCount,
      };
    },

    getAvailableGroups: () => {
      const { currentArchitecture, selectedFeatures } = get();

      return enhancedFeatureGroups.filter((group) => {
        // Check if group should be shown based on current selections and architecture
        if (group.showWhen) {
          return group.showWhen(selectedFeatures, currentArchitecture);
        }
        return true;
      });
    },

    getSelectedPackages: () => {
      const { selectedFeatures } = get();
      const packages: string[] = [];

      Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
        const group = enhancedFeatureGroups.find((g) => g.id === groupId);
        if (!group) return;

        const selectedIds = Array.isArray(selection) ? selection : [selection];
        selectedIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option?.nugetPackages) {
            packages.push(...option.nugetPackages);
          }
        });
      });

      return [...new Set(packages)]; // Remove duplicates
    },

    getConfigFiles: () => {
      const { selectedFeatures } = get();
      const configFiles: string[] = [];

      Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
        const group = enhancedFeatureGroups.find((g) => g.id === groupId);
        if (!group) return;

        const selectedIds = Array.isArray(selection) ? selection : [selection];
        selectedIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option?.configFiles) {
            configFiles.push(...option.configFiles);
          }
        });
      });

      return [...new Set(configFiles)]; // Remove duplicates
    },

    applyPreset: (preset) => {
      set({
        selectedFeatures: preset.features,
      });

      // Update computed states
      const validation = get().validateFeatures();
      const configuration = get().getFeatureConfiguration();
      set({
        validation,
        configuration,
        estimatedSetupTime: configuration.estimatedSetupTime,
      });
    },

    createPreset: () => {
      const { selectedFeatures } = get();
      const configuration = get().getFeatureConfiguration();

      return {
        features: selectedFeatures,
        complexity: configuration.complexity,
      };
    },
  })
);
