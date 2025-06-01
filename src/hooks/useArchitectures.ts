// src/hooks/useArchitectures.ts
import { useState, useEffect, useCallback } from "react";
import {
  ArchitectureApiService,
  ArchitectureApiResponse,
} from "../services/ArchitectureApiService";
import { ArchitectureInfo } from "../types/project";

interface UseArchitecturesResult {
  architectures: ArchitectureApiResponse[];
  loading: boolean;
  error: string | null;
  isApiAvailable: boolean;
  refetch: () => Promise<void>;
  getArchitectureInfo: (
    architectureName: string,
    projectName: string
  ) => Promise<ArchitectureInfo>;
  getArchitectureOptions: () => Array<{
    value: string;
    label: string;
    description: string;
    complexity: string;
    apiData: ArchitectureApiResponse;
  }>;
}

export const useArchitectures = (): UseArchitecturesResult => {
  const [architectures, setArchitectures] = useState<ArchitectureApiResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(false);

  const fetchArchitectures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar si el API está disponible
      const apiHealthy = await ArchitectureApiService.healthCheck();
      setIsApiAvailable(apiHealthy);

      if (apiHealthy) {
        const apiArchitectures =
          await ArchitectureApiService.getArchitectures();
        setArchitectures(apiArchitectures);
        console.log(
          "✅ Loaded architectures from API:",
          apiArchitectures.length
        );
      } else {
        console.warn("⚠️ API not available");
        setArchitectures([]);
        setError("API not available. Please check your connection.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load architectures";
      setError(errorMessage);
      setIsApiAvailable(false);
      setArchitectures([]);
      console.error("❌ Error loading architectures:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchitectures();
  }, [fetchArchitectures]);

  const getArchitectureInfo = useCallback(
    async (
      architectureName: string,
      projectName: string
    ): Promise<ArchitectureInfo> => {
      // Solo intentar obtener datos del API si está disponible
      if (isApiAvailable && architectures.length > 0) {
        try {
          // Buscar por nombre exacto primero
          let apiArchitecture = architectures.find(
            (arch) => arch.name === architectureName
          );

          // Si no se encuentra, buscar usando el servicio de búsqueda
          if (!apiArchitecture) {
            apiArchitecture = await ArchitectureApiService.findArchitecture(
              architectureName
            );
          }

          if (apiArchitecture && apiArchitecture.projectStructures.length > 0) {
            console.log(`🏗️ Using API data for ${architectureName}`);
            return ArchitectureApiService.transformToInternalFormat(
              apiArchitecture,
              projectName
            );
          }
        } catch (error) {
          console.warn(
            `Failed to get architecture ${architectureName} from API:`,
            error
          );
        }
      }

      // Si llegamos aquí, significa que no pudimos obtener datos del API
      // En lugar de usar fallback, lanzamos un error o retornamos estructura vacía
      console.warn(
        `❌ No API data available for architecture: ${architectureName}`
      );

      // Retornar estructura mínima para evitar errores
      return {
        description: `Architecture ${architectureName} - API data not available`,
        projects: [],
      };
    },
    [isApiAvailable, architectures]
  );

  const getArchitectureOptions = useCallback(() => {
    // Solo retornar opciones del API
    if (!isApiAvailable || architectures.length === 0) {
      return [];
    }

    return architectures
      .map((arch) => ({
        value: arch.name,
        label: arch.displayName,
        description: arch.description,
        complexity: arch.complexity,
        apiData: arch,
      }))
      .sort((a, b) => {
        // Ordenar por complejidad: Beginner -> Intermediate -> Advanced
        const complexityOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        const aOrder =
          complexityOrder[a.complexity as keyof typeof complexityOrder] || 999;
        const bOrder =
          complexityOrder[b.complexity as keyof typeof complexityOrder] || 999;
        return aOrder - bOrder;
      });
  }, [isApiAvailable, architectures]);

  return {
    architectures,
    loading,
    error,
    isApiAvailable,
    refetch: fetchArchitectures,
    getArchitectureInfo,
    getArchitectureOptions,
  };
};
