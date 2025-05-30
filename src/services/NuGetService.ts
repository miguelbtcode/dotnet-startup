import { NuGetPackage, PackageSearchResult, PackageVersion, PackageMetadata, VulnerabilityReport } from '../types/nuget';

const NUGET_API_BASE = 'https://api.nuget.org/v3';
const SEARCH_ENDPOINT = `${NUGET_API_BASE}/query`;

export class NuGetService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private async fetchWithCache(key: string, fetcher: () => Promise<any>) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  async searchPackages(
    query: string,
    options: {
      packageType?: string;
      prerelease?: boolean;
      skip?: number;
      take?: number;
    } = {}
  ): Promise<PackageSearchResult> {
    const params = new URLSearchParams({
      q: query,
      prerelease: String(options.prerelease ?? false),
      skip: String(options.skip ?? 0),
      take: String(options.take ?? 20),
    });

    if (options.packageType) {
      params.append('packageType', options.packageType);
    }

    const cacheKey = `search:${params.toString()}`;
    return this.fetchWithCache(cacheKey, async () => {
      const response = await fetch(`${SEARCH_ENDPOINT}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch packages');
      const data = await response.json();
      
      return {
        totalHits: data.totalHits,
        packages: data.data.map(this.transformPackageData)
      };
    });
  }

  async getPackageVersions(packageId: string): Promise<PackageVersion[]> {
    const cacheKey = `versions:${packageId}`;
    return this.fetchWithCache(cacheKey, async () => {
      const response = await fetch(`${NUGET_API_BASE}/registration5/${packageId.toLowerCase()}/index.json`);
      if (!response.ok) throw new Error('Failed to fetch package versions');
      const data = await response.json();
      
      return data.items.map((item: any) => ({
        version: item.catalogEntry.version,
        downloads: item.catalogEntry.downloads,
        published: item.catalogEntry.published,
        isLatest: item.catalogEntry.isLatestVersion,
        isPrerelease: item.catalogEntry.isPrerelease,
        isDeprecated: item.catalogEntry.deprecation !== undefined
      }));
    });
  }

  async getPackageMetadata(packageId: string, version: string): Promise<PackageMetadata> {
    const cacheKey = `metadata:${packageId}:${version}`;
    return this.fetchWithCache(cacheKey, async () => {
      const response = await fetch(`${NUGET_API_BASE}/registration5/${packageId.toLowerCase()}/${version}.json`);
      if (!response.ok) throw new Error('Failed to fetch package metadata');
      const data = await response.json();
      
      return {
        dependencies: data.catalogEntry.dependencyGroups?.[0]?.dependencies || {},
        frameworks: data.catalogEntry.targetFrameworks || [],
        releaseNotes: data.catalogEntry.releaseNotes,
        readme: data.catalogEntry.readme,
        repository: data.catalogEntry.repository
      };
    });
  }

  async checkVulnerabilities(packageId: string, version: string): Promise<VulnerabilityReport> {
    // This is a mock implementation since NuGet API doesn't provide vulnerability data directly
    // In a real implementation, you would integrate with a security advisory database
    return {
      hasVulnerabilities: false
    };
  }

  private transformPackageData(data: any): NuGetPackage {
    return {
      id: data.id,
      version: data.version,
      description: data.description,
      authors: data.authors,
      totalDownloads: data.totalDownloads,
      verified: data.verified ?? false,
      tags: data.tags || [],
      projectUrl: data.projectUrl,
      iconUrl: data.iconUrl,
      licenseUrl: data.licenseUrl,
      versions: []
    };
  }
}

export const nugetService = new NuGetService();