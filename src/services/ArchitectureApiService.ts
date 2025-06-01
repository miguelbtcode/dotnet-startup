// src/services/ArchitectureApiService.ts
import axios from "axios";

// Tipos para el API response
export interface ArchitectureApiResponse {
  id: number;
  name: string;
  displayName: string;
  description: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  projectStructures: ProjectStructureApiResponse[];
}

export interface ProjectStructureApiResponse {
  id: number;
  projectName: string;
  displayName: string;
  description: string;
  isCore: boolean;
  layer: string;
  sortOrder: number;
  folders: string[];
  dependencies: string[];
}

export interface ProjectTypeApiResponse {
  id: number;
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DotNetVersionApiResponse {
  id: number;
  version: string;
  displayName: string;
  description: string;
  isLts: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseProviderApiResponse {
  id: number;
  name: string;
  displayName: string;
  description: string;
  connectionStringTemplate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Configuración de Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 404) {
      throw new Error("Endpoint not found");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please check your connection.");
    }

    throw error;
  }
);

export class ArchitectureApiService {
  // =================== ARQUITECTURAS ===================

  /**
   * Obtiene todas las arquitecturas disponibles desde el API
   */
  static async getArchitectures(): Promise<ArchitectureApiResponse[]> {
    try {
      const response = await apiClient.get<ArchitectureApiResponse[]>(
        "/architectures"
      );
      return response.data.filter((arch) => arch.isActive);
    } catch (error) {
      console.error("Error fetching architectures:", error);
      throw error;
    }
  }

  /**
   * Obtiene una arquitectura específica por ID
   */
  static async getArchitectureById(
    id: number
  ): Promise<ArchitectureApiResponse> {
    try {
      const response = await apiClient.get<ArchitectureApiResponse>(
        `/architectures/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching architecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca una arquitectura por múltiples criterios (nombre, displayName)
   */
  static async findArchitecture(
    searchTerm: string
  ): Promise<ArchitectureApiResponse | null> {
    try {
      console.log("🔍 Searching for architecture:", searchTerm);
      const architectures = await this.getArchitectures();
      console.log(
        "🔍 Available architectures:",
        architectures.map((a) => ({ name: a.name, displayName: a.displayName }))
      );

      // Buscar por coincidencia exacta en name
      let found = architectures.find(
        (arch) => arch.name.toLowerCase() === searchTerm.toLowerCase()
      );

      if (found) {
        console.log("✅ Found exact match by name:", found.name);
        return found;
      }

      // Buscar por coincidencia exacta en displayName
      found = architectures.find(
        (arch) => arch.displayName.toLowerCase() === searchTerm.toLowerCase()
      );

      if (found) {
        console.log("✅ Found exact match by displayName:", found.displayName);
        return found;
      }

      // Buscar por coincidencia parcial
      found = architectures.find(
        (arch) =>
          arch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          arch.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (found) {
        console.log("✅ Found partial match:", found.name);
        return found;
      }

      console.warn("❌ No architecture found for:", searchTerm);
      return null;
    } catch (error) {
      console.error(`Error searching architecture ${searchTerm}:`, error);
      return null;
    }
  }

  // =================== TIPOS DE PROYECTO ===================

  /**
   * Obtiene todos los tipos de proyecto desde el API
   */
  static async getProjectTypes(): Promise<ProjectTypeApiResponse[]> {
    try {
      const response = await apiClient.get<ProjectTypeApiResponse[]>(
        "/project-types"
      );
      return response.data.filter((type) => type.isActive);
    } catch (error) {
      console.error("Error fetching project types:", error);
      throw error;
    }
  }

  // =================== VERSIONES DE .NET ===================

  /**
   * Obtiene todas las versiones de .NET desde el API
   */
  static async getDotNetVersions(): Promise<DotNetVersionApiResponse[]> {
    try {
      const response = await apiClient.get<DotNetVersionApiResponse[]>(
        "/dotnet-versions"
      );
      return response.data.filter((version) => version.isActive);
    } catch (error) {
      console.error("Error fetching .NET versions:", error);
      throw error;
    }
  }

  // =================== PROVEEDORES DE BASE DE DATOS ===================

  /**
   * Obtiene todos los proveedores de base de datos desde el API
   */
  static async getDatabaseProviders(): Promise<DatabaseProviderApiResponse[]> {
    try {
      const response = await apiClient.get<DatabaseProviderApiResponse[]>(
        "/database-providers"
      );
      return response.data.filter((provider) => provider.isActive);
    } catch (error) {
      console.error("Error fetching database providers:", error);
      throw error;
    }
  }

  // =================== TRANSFORMACIONES ===================

  /**
   * Transforma los datos del API al formato interno usado en el frontend
   */
  static transformToInternalFormat(
    apiArchitecture: ArchitectureApiResponse
  ): import("../types/project").ArchitectureInfo {
    console.log(
      "🔄 Transforming architecture:",
      apiArchitecture.name,
      "with",
      apiArchitecture.projectStructures.length,
      "projects"
    );
    console.log("🔄 Project structures:", apiArchitecture.projectStructures);

    const transformed = {
      description: apiArchitecture.description,
      projects: apiArchitecture.projectStructures
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((structure) => {
          const transformedProject = {
            name: structure.projectName, // Usar el nombre exacto del API
            description: structure.description,
            folders: structure.folders,
            dependencies: structure.dependencies, // Usar las dependencias exactas del API
            isCore: structure.isCore,
            layer: this.normalizeLayerName(structure.layer),
          };
          console.log("🔄 Transformed project:", transformedProject);
          return transformedProject;
        }),
    };

    console.log("✅ Final transformed result:", transformed);
    return transformed;
  }

  /**
   * Normaliza los nombres de las capas para que coincidan con el formato interno
   */
  private static normalizeLayerName(
    layerName: string
  ):
    | "domain"
    | "application"
    | "infrastructure"
    | "presentation"
    | "shared"
    | undefined {
    console.log("🔄 Normalizing layer name:", layerName);

    const normalized = layerName.toLowerCase();

    // Mapeo directo si coincide exactamente
    const validLayers = [
      "domain",
      "application",
      "infrastructure",
      "presentation",
      "shared",
    ];
    if (validLayers.includes(normalized)) {
      console.log("✅ Direct match:", layerName, "->", normalized);
      return normalized as any;
    }

    // Mapeo por palabras clave si no coincide exactamente
    let result:
      | "domain"
      | "application"
      | "infrastructure"
      | "presentation"
      | "shared"
      | undefined;

    if (normalized.includes("domain") || normalized.includes("core")) {
      result = "domain";
    } else if (
      normalized.includes("application") ||
      normalized.includes("app")
    ) {
      result = "application";
    } else if (
      normalized.includes("infrastructure") ||
      normalized.includes("infra")
    ) {
      result = "infrastructure";
    } else if (
      normalized.includes("presentation") ||
      normalized.includes("api") ||
      normalized.includes("web")
    ) {
      result = "presentation";
    } else if (normalized.includes("shared") || normalized.includes("common")) {
      result = "shared";
    }

    if (result) {
      console.log("✅ Keyword match:", layerName, "->", result);
    } else {
      console.warn("⚠️ No layer match found for:", layerName);
    }

    return result;
  }

  // =================== UTILIDADES ===================

  /**
   * Verifica si el API está disponible
   */
  static async healthCheck(): Promise<boolean> {
    try {
      // Intentar obtener las arquitecturas como health check
      const response = await apiClient.get("/architectures", { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn("API health check failed:", error);
      return false;
    }
  }

  /**
   * Obtiene las opciones de arquitectura formateadas para el select
   */
  static async getArchitectureSelectOptions(): Promise<
    Array<{
      value: string;
      label: string;
      description: string;
      complexity: string;
      apiData: ArchitectureApiResponse;
    }>
  > {
    try {
      const architectures = await this.getArchitectures();

      return architectures.map((arch) => ({
        value: arch.name, // Usar el nombre del API como value
        label: arch.displayName,
        description: arch.description,
        complexity: arch.complexity,
        apiData: arch,
      }));
    } catch (error) {
      console.error("Error getting architecture options:", error);
      return [];
    }
  }
}
