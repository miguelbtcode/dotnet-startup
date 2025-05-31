// src/store/featuresStore.ts
import { create } from 'zustand';
import { FeatureCategory, FeaturePreset, FeatureComplexity } from '../types/features';
import { featureCategories } from '../data/featureCategories';

interface FeaturesStore {
  selectedFeatures: Record<string, string>;
  presets: FeaturePreset[];
  complexity: FeatureComplexity;
  isValid: boolean;
  conflicts: string[];
  
  // Actions
  selectFeature: (categoryId: string, optionId: string) => void;
  applyPreset: (preset: FeaturePreset) => void;
  savePreset: (preset: Partial<FeaturePreset>) => void;
  validateSelections: () => void;
  resetFeatures: () => void;
  
  // Getters
  getSelectedOption: (categoryId: string) => string | undefined;
  getComplexityScore: () => number;
  getConflicts: () => string[];
}

export const useFeaturesStore = create<FeaturesStore>((set, get) => ({
  selectedFeatures: {},
  presets: [],
  complexity: 'Beginner',
  isValid: true,
  conflicts: [],

  selectFeature: (categoryId, optionId) => {
    set((state) => ({
      selectedFeatures: {
        ...state.selectedFeatures,
        [categoryId]: optionId
      }
    }));
    get().validateSelections();
  },

  applyPreset: (preset) => {
    set(() => ({
      selectedFeatures: { ...preset.selections },
      complexity: preset.complexity
    }));
    get().validateSelections();
  },

  savePreset: (preset) => {
    const newPreset: FeaturePreset = {
      id: `preset-${Date.now()}`,
      name: preset.name || 'Custom Preset',
      description: preset.description || '',
      complexity: preset.complexity || get().complexity,
      selections: { ...get().selectedFeatures }
    };

    set((state) => ({
      presets: [...state.presets, newPreset]
    }));
  },

  validateSelections: () => {
    const conflicts: string[] = [];
    const selections = get().selectedFeatures;

    // Check for conflicts between selected features
    Object.entries(selections).forEach(([categoryId, optionId]) => {
      const category = featureCategories.find(c => c.id === categoryId);
      const option = category?.options.find(o => o.id === optionId);

      if (option?.incompatibleWith) {
        option.incompatibleWith.forEach(incompatibleId => {
          if (Object.values(selections).includes(incompatibleId)) {
            conflicts.push(`${option.title} is incompatible with ${incompatibleId}`);
          }
        });
      }
    });

    // Calculate complexity
    const complexityScore = get().getComplexityScore();
    const complexity: FeatureComplexity = 
      complexityScore > 7 ? 'Advanced' :
      complexityScore > 4 ? 'Intermediate' : 
      'Beginner';

    set(() => ({
      conflicts,
      isValid: conflicts.length === 0,
      complexity
    }));
  },

  resetFeatures: () => {
    set(() => ({
      selectedFeatures: {},
      complexity: 'Beginner',
      isValid: true,
      conflicts: []
    }));
  },

  getSelectedOption: (categoryId) => {
    return get().selectedFeatures[categoryId];
  },

  getComplexityScore: () => {
    const selections = get().selectedFeatures;
    let score = 0;

    Object.entries(selections).forEach(([categoryId, optionId]) => {
      const category = featureCategories.find(c => c.id === categoryId);
      const option = category?.options.find(o => o.id === optionId);

      if (option) {
        score += option.complexity === 'Advanced' ? 3 :
                 option.complexity === 'Intermediate' ? 2 : 1;
      }
    });

    return score;
  },

  getConflicts: () => get().conflicts
}));