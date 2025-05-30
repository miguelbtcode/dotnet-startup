export type ProjectType = 'webapi' | 'mvc' | 'blazor' | 'console' | 'classlib';
export type DotNetVersion = '6.0' | '7.0' | '8.0' | '9.0';
export type Architecture = 'default' | 'clean' | 'ddd' | 'hexagonal' | 'onion';
export type Database = 'sqlserver' | 'postgresql' | 'mysql' | 'sqlite' | 'inmemory' | 'none';

export interface ProjectStructure {
  name: string;
  description: string;
  folders: string[];
  dependencies?: string[];
}

export interface ArchitectureInfo {
  description: string;
  projects: ProjectStructure[];
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
}