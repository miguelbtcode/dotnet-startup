export interface NuGetPackage {
  id: string;
  version: string;
  description: string;
  authors: string[];
  totalDownloads: number;
  verified: boolean;
  tags: string[];
  projectUrl?: string;
  iconUrl?: string;
  licenseUrl?: string;
  versions: PackageVersion[];
}

export interface PackageVersion {
  version: string;
  downloads: number;
  published: string;
  isLatest: boolean;
  isPrerelease: boolean;
  isDeprecated: boolean;
}

export interface PackageSearchResult {
  totalHits: number;
  packages: NuGetPackage[];
}

export interface VulnerabilityReport {
  hasVulnerabilities: boolean;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  details?: string;
}

export interface PackageMetadata {
  dependencies: { [key: string]: string };
  frameworks: string[];
  releaseNotes?: string;
  readme?: string;
  repository?: {
    type: string;
    url: string;
  };
}