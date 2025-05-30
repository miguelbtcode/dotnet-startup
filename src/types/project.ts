// src/types/project.ts
export type ProjectType = 'webapi' | 'mvc' | 'blazor' | 'console' | 'classlib';
export type DotNetVersion = '6.0' | '7.0' | '8.0' | '9.0';
export type Architecture = 'default' | 'clean' | 'ddd' | 'hexagonal' | 'onion';
export type Database = 'sqlserver' | 'postgresql' | 'mysql' | 'sqlite' | 'inmemory' | 'none';

export interface NuGetDependency {
  id: string;
  version: string;
  description?: string;
  verified?: boolean;
  addedAt?: string;
}

export interface ProjectStructure {
  name: string;
  description: string;
  folders: string[];
  dependencies?: string[];
  nugetDependencies?: NuGetDependency[];
  isCore?: boolean; // Para identificar proyectos centrales
  layer?: 'domain' | 'application' | 'infrastructure' | 'presentation' | 'shared';
}

export interface ArchitectureInfo {
  description: string;
  projects: ProjectStructure[];
  recommendedPackages?: { [projectName: string]: string[] }; // Paquetes recomendados por proyecto
}

export interface ProjectConfig {
  name: string;
  type: ProjectType;
  dotnetVersion: DotNetVersion;
  architecture: Architecture;
  database: Database;
  features: {
    jwt: boolean;
    swagger: boolean;
    docker: boolean;
    testing: boolean;
    cors: boolean;
    logging: boolean;
    healthChecks: boolean;
  };
  selectedPackages?: { [projectName: string]: NuGetDependency[] }; // Dependencias por proyecto
}

export interface DependencyValidation {
  isValid: boolean;
  conflicts?: string[];
  warnings?: string[];
  suggestions?: string[];
}