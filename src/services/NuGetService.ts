import { NuGetPackage, PackageSearchResult, PackageVersion, PackageMetadata, VulnerabilityReport } from '../types/nuget';

// Interfaces para el service index
interface ServiceIndexResource {
  '@id': string;
  '@type': string;
  comment?: string;
}

interface ServiceIndex {
  version: string;
  resources: ServiceIndexResource[];
}

const NUGET_SERVICE_INDEX = 'https://api.nuget.org/v3/index.json';

export class NuGetService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private serviceEndpoints: Map<string, string> = new Map();
  private CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private ENDPOINTS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours para endpoints

  private async fetchWithCache(key: string, fetcher: () => Promise<any>) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * Obtiene y cachea los endpoints del service index de NuGet
   */
  private async getServiceEndpoints(): Promise<void> {
    const cacheKey = 'service-endpoints';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.ENDPOINTS_CACHE_DURATION) {
      // Los endpoints ya están cacheados
      return;
    }

    try {
      const response = await fetch(NUGET_SERVICE_INDEX);
      if (!response.ok) {
        throw new Error(`Failed to fetch service index: ${response.statusText}`);
      }

      const serviceIndex: ServiceIndex = await response.json();
      
      // Limpiar endpoints anteriores
      this.serviceEndpoints.clear();

      // Mapear todos los endpoints disponibles
      serviceIndex.resources.forEach(resource => {
        // Usar el endpoint más reciente disponible para cada tipo
        const type = resource['@type'];
        
        // Para SearchQueryService, preferir la versión 3.5.0 que soporta packageType
        if (type === 'SearchQueryService/3.5.0' || 
            (type === 'SearchQueryService' && !this.serviceEndpoints.has('SearchQueryService'))) {
          this.serviceEndpoints.set('SearchQueryService', resource['@id']);
        }
        
        // Para otros servicios importantes
        if (type === 'RegistrationsBaseUrl' && !this.serviceEndpoints.has('RegistrationsBaseUrl')) {
          this.serviceEndpoints.set('RegistrationsBaseUrl', resource['@id']);
        }
        
        if (type === 'PackageBaseAddress/3.0.0') {
          this.serviceEndpoints.set('PackageBaseAddress', resource['@id']);
        }
      });

      // Cachear los endpoints
      this.cache.set(cacheKey, { 
        data: this.serviceEndpoints, 
        timestamp: Date.now() 
      });

    } catch (error) {
      console.error('Error fetching service endpoints:', error);
      // Fallback a endpoints conocidos si falla
      this.serviceEndpoints.set('SearchQueryService', 'https://azuresearch-usnc.nuget.org/query');
      this.serviceEndpoints.set('RegistrationsBaseUrl', 'https://api.nuget.org/v3/registration5/');
    }
  }

  /**
   * Obtiene un endpoint específico del service index
   */
  private async getEndpoint(serviceType: string): Promise<string> {
    await this.getServiceEndpoints();
    
    const endpoint = this.serviceEndpoints.get(serviceType);
    if (!endpoint) {
      throw new Error(`Service endpoint not found for type: ${serviceType}`);
    }
    
    return endpoint;
  }

  async searchPackages(
    query: string,
    options: {
      packageType?: string;
      prerelease?: boolean;
      skip?: number;
      take?: number;
      semVerLevel?: string;
    } = {}
  ): Promise<PackageSearchResult> {
    // Limpiar y validar la query
    const cleanQuery = query?.trim() || '';
    
    const params = new URLSearchParams({
      q: cleanQuery,
      prerelease: String(options.prerelease ?? false),
      skip: String(options.skip ?? 0),
      take: String(Math.min(options.take ?? 20, 1000)), // NuGet.org limita a 1000
      semVerLevel: options.semVerLevel ?? '2.0.0' // Incluir SemVer 2.0.0 por defecto
    });

    // Solo agregar packageType si es válido y no está vacío
    if (options.packageType && options.packageType.trim()) {
      const validPackageTypes = ['Dependency', 'DotnetTool', 'Template'];
      const packageType = options.packageType.trim();
      
      // Validar que el packageType sea válido
      if (validPackageTypes.includes(packageType)) {
        params.append('packageType', packageType);
      } else {
        console.warn(`Invalid packageType: ${packageType}. Valid types: ${validPackageTypes.join(', ')}`);
      }
    }

    const cacheKey = `search:${params.toString()}`;
    return this.fetchWithCache(cacheKey, async () => {
      const searchEndpoint = await this.getEndpoint('SearchQueryService');
      const fullUrl = `${searchEndpoint}?${params}`;
      
      console.log('NuGet Search URL:', fullUrl); // Para debugging
      
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch packages: ${response.status} ${response.statusText} - URL: ${fullUrl}`);
      }
      
      const data = await response.json();
      
      // Log para debugging
      console.log('NuGet API Response:', {
        totalHits: data.totalHits,
        dataLength: data.data?.length || 0,
        query: cleanQuery,
        params: Object.fromEntries(params)
      });
      
      // Si no hay resultados pero la query no está vacía, intentar sin packageType
      if (data.totalHits === 0 && cleanQuery && options.packageType) {
        console.log('No results with packageType, retrying without it...');
        const paramsWithoutType = new URLSearchParams(params);
        paramsWithoutType.delete('packageType');
        
        const retryUrl = `${searchEndpoint}?${paramsWithoutType}`;
        const retryResponse = await fetch(retryUrl);
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          console.log('Retry without packageType:', {
            totalHits: retryData.totalHits,
            dataLength: retryData.data?.length || 0
          });
          
          if (retryData.totalHits > 0) {
            return {
              totalHits: retryData.totalHits,
              packages: retryData.data.map(this.transformPackageData)
            };
          }
        }
      }
      
      return {
        totalHits: data.totalHits || 0,
        packages: (data.data || []).map(this.transformPackageData)
      };
    });
  }

  async getPackageVersions(packageId: string): Promise<PackageVersion[]> {
    const cacheKey = `versions:${packageId}`;
    return this.fetchWithCache(cacheKey, async () => {
      const registrationsEndpoint = await this.getEndpoint('RegistrationsBaseUrl');
      const url = `${registrationsEndpoint}${packageId.toLowerCase()}/index.json`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch package versions: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // El formato de respuesta puede variar dependiendo del tamaño del paquete
      let items = [];
      if (data.items) {
        // Para paquetes con muchas versiones, puede estar paginado
        for (const page of data.items) {
          if (page.items) {
            items.push(...page.items);
          } else if (page.catalogEntry) {
            items.push(page);
          }
        }
      }
      
      return items.map((item: any) => ({
        version: item.catalogEntry.version,
        downloads: item.catalogEntry.downloads || 0,
        published: item.catalogEntry.published,
        isLatest: item.catalogEntry.isLatestVersion || false,
        isPrerelease: item.catalogEntry.isPrerelease || false,
        isDeprecated: item.catalogEntry.deprecation !== undefined
      }));
    });
  }

  async getPackageMetadata(packageId: string, version: string): Promise<PackageMetadata> {
    const cacheKey = `metadata:${packageId}:${version}`;
    return this.fetchWithCache(cacheKey, async () => {
      const registrationsEndpoint = await this.getEndpoint('RegistrationsBaseUrl');
      const url = `${registrationsEndpoint}${packageId.toLowerCase()}/${version.toLowerCase()}.json`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch package metadata: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        dependencies: data.catalogEntry.dependencyGroups?.[0]?.dependencies || [],
        frameworks: data.catalogEntry.targetFrameworks || [],
        releaseNotes: data.catalogEntry.releaseNotes || '',
        readme: data.catalogEntry.readme || '',
        repository: data.catalogEntry.repository || null
      };
    });
  }

  async checkVulnerabilities(packageId: string, version: string): Promise<VulnerabilityReport> {
    // Implementación mejorada que podría integrarse con el endpoint de vulnerabilidades
    const cacheKey = `vulnerabilities:${packageId}:${version}`;
    return this.fetchWithCache(cacheKey, async () => {
      try {
        // NuGet tiene un endpoint de vulnerabilidades: https://api.nuget.org/v3/vulnerabilities/index.json
        // Por ahora retornamos mock data, pero se puede implementar
        return {
          hasVulnerabilities: false
        };
      } catch (error) {
        console.warn('Could not check vulnerabilities:', error);
        return {
          hasVulnerabilities: false
        };
      }
    });
  }

  private transformPackageData(data: any): NuGetPackage {
    return {
      id: data.id,
      version: data.version,
      description: data.description || '',
      authors: Array.isArray(data.authors) ? data.authors : [data.authors].filter(Boolean),
      totalDownloads: data.totalDownloads || 0,
      verified: data.verified ?? false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      projectUrl: data.projectUrl || '',
      iconUrl: data.iconUrl || '',
      licenseUrl: data.licenseUrl || '',
      versions: data.versions || []
    };
  }

  /**
   * Método de utilidad para limpiar cache si es necesario
   */
  clearCache(): void {
    this.cache.clear();
    this.serviceEndpoints.clear();
  }

  /**
   * Método de utilidad para probar la conectividad y diagnosticar problemas
   */
  async testConnection(): Promise<{
    serviceIndexAvailable: boolean;
    searchEndpointAvailable: boolean;
    sampleSearchWorks: boolean;
    endpoints: { [key: string]: string };
    errors: string[];
  }> {
    const errors: string[] = [];
    let serviceIndexAvailable = false;
    let searchEndpointAvailable = false;
    let sampleSearchWorks = false;
    let endpoints: { [key: string]: string } = {};

    try {
      // Test 1: Service Index
      await this.getServiceEndpoints();
      serviceIndexAvailable = true;
      endpoints = Object.fromEntries(this.serviceEndpoints);
    } catch (error) {
      errors.push(`Service Index failed: ${error}`);
    }

    try {
      // Test 2: Search Endpoint availability
      const searchEndpoint = await this.getEndpoint('SearchQueryService');
      const response = await fetch(`${searchEndpoint}?q=&take=1`);
      searchEndpointAvailable = response.ok;
      if (!response.ok) {
        errors.push(`Search endpoint returned: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      errors.push(`Search endpoint failed: ${error}`);
    }

    try {
      // Test 3: Sample search
      const result = await this.searchPackages('Newtonsoft.Json', { take: 1 });
      sampleSearchWorks = result.totalHits > 0;
      if (!sampleSearchWorks) {
        errors.push('Sample search returned no results');
      }
    } catch (error) {
      errors.push(`Sample search failed: ${error}`);
    }

    return {
      serviceIndexAvailable,
      searchEndpointAvailable,
      sampleSearchWorks,
      endpoints,
      errors
    };
  }
}

export const nugetService = new NuGetService();