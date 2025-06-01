// src/types/features.ts
export type FeatureComplexity = "Beginner" | "Intermediate" | "Advanced";
export type FeatureCategory =
  | "security"
  | "documentation"
  | "patterns"
  | "logging"
  | "infrastructure"
  | "messaging";

export interface FeatureOption {
  id: string;
  title: string;
  description: string;
  complexity: FeatureComplexity;
  category: FeatureCategory;
  pros: string[];
  cons: string[];
  dependencies?: string[];
  incompatibleWith?: string[];
  architectureRestrictions?: string[]; // Architectures where this feature is NOT available
  architectureRequired?: string[]; // Architectures where this feature is ONLY available
  isRecommended?: boolean;
  isEnterprise?: boolean;
  nugetPackages?: string[]; // Packages that will be automatically added
  configFiles?: string[]; // Config files that will be generated
  codeExamples?: CodeExample[];
}

export interface CodeExample {
  title: string;
  code: string;
  language: "csharp" | "json" | "yaml" | "dockerfile";
  filename?: string;
}

export interface FeatureGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: FeatureCategory;
  isRequired?: boolean;
  allowMultiple?: boolean; // Can select multiple options in this group
  options: FeatureOption[];
  defaultOption?: string;
  showWhen?: (
    selectedFeatures: SelectedFeatures,
    architecture: string
  ) => boolean;
}

export interface SelectedFeatures {
  [groupId: string]: string | string[]; // string for single selection, string[] for multiple
}

export interface FeatureValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface FeatureConfiguration {
  selectedFeatures: SelectedFeatures;
  complexity: FeatureComplexity;
  estimatedSetupTime: number; // in minutes
  totalPackages: number;
  configFilesCount: number;
}

export interface FeaturePreset {
  id: string;
  name: string;
  description: string;
  complexity: FeatureComplexity;
  projectTypes: string[]; // webapi, mvc, etc.
  architectures: string[]; // clean, ddd, etc.
  features: SelectedFeatures;
  tags: string[];
  isOfficial?: boolean;
}

// New interfaces for enhanced features
export interface FeatureImpact {
  packages: string[];
  configFiles: string[];
  codeChanges: string[];
  setupSteps: string[];
}

export interface FeatureDependency {
  featureId: string;
  required: boolean;
  reason: string;
}
