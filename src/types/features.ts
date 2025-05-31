// src/types/features.ts
export type FeatureComplexity = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CodeExample {
  title: string;
  code: string;
  language: 'csharp' | 'json' | 'xml';
}

export interface FeatureOption {
  id: string;
  title: string;
  description: string;
  complexity: FeatureComplexity;
  pros: string[];
  cons: string[];
  codeExamples: CodeExample[];
  isRecommended?: boolean;
  isEnterprise?: boolean;
  dependencies?: string[];
  incompatibleWith?: string[];
}

export interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  options: FeatureOption[];
  defaultOption?: string;
  isRequired?: boolean;
}

export interface FeaturePreset {
  id: string;
  name: string;
  description: string;
  complexity: FeatureComplexity;
  selections: Record<string, string>;
}

export interface FeaturesState {
  selectedFeatures: Record<string, string>;
  presets: FeaturePreset[];
  complexity: FeatureComplexity;
  isValid: boolean;
  conflicts: string[];
}