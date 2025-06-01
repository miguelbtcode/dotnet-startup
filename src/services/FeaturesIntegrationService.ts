// src/services/FeaturesIntegrationService.ts
import { SelectedFeatures } from "../types/features";
import { enhancedFeatureGroups } from "../data/enhancedFeatures";
import { NuGetDependency } from "../types/project";

export class FeaturesIntegrationService {
  /**
   * Convierte las features seleccionadas en dependencias NuGet organizadas por proyecto
   */
  static convertFeaturesToDependencies(
    selectedFeatures: SelectedFeatures,
    projectName: string,
    architecture: string
  ): { [projectName: string]: NuGetDependency[] } {
    const dependencies: { [projectName: string]: NuGetDependency[] } = {};

    // Mapeo de features a proyectos según la arquitectura
    const projectMapping = this.getProjectMapping(architecture, projectName);

    Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
      if (!selection) return;

      const group = enhancedFeatureGroups.find((g) => g.id === groupId);
      if (!group) return;

      const selectedIds = Array.isArray(selection) ? selection : [selection];

      selectedIds.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (!option?.nugetPackages) return;

        // Determinar en qué proyecto(s) instalar los paquetes
        const targetProjects = this.getTargetProjects(
          groupId,
          optionId,
          projectMapping
        );

        targetProjects.forEach((targetProject) => {
          if (!dependencies[targetProject]) {
            dependencies[targetProject] = [];
          }

          option.nugetPackages!.forEach((packageId) => {
            // Evitar duplicados
            const exists = dependencies[targetProject].some(
              (dep) => dep.id === packageId
            );
            if (!exists) {
              dependencies[targetProject].push({
                id: packageId,
                version: this.getRecommendedVersion(packageId),
                description: `Auto-added from ${option.title} feature`,
                verified: this.isVerifiedPackage(packageId),
                addedAt: new Date().toISOString(),
              });
            }
          });
        });
      });
    });

    return dependencies;
  }

  /**
   * Genera configuración de archivos basada en las features seleccionadas
   */
  static generateConfigurationFiles(selectedFeatures: SelectedFeatures): {
    [fileName: string]: string;
  } {
    const configFiles: { [fileName: string]: string } = {};

    Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
      if (!selection) return;

      const group = enhancedFeatureGroups.find((g) => g.id === groupId);
      if (!group) return;

      const selectedIds = Array.isArray(selection) ? selection : [selection];

      selectedIds.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (!option?.codeExamples) return;

        option.codeExamples.forEach((example) => {
          if (example.filename) {
            configFiles[example.filename] = example.code;
          }
        });
      });
    });

    return configFiles;
  }

  /**
   * Valida que las features seleccionadas sean compatibles con la arquitectura
   */
  static validateFeaturesForArchitecture(
    selectedFeatures: SelectedFeatures,
    architecture: string
  ): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
      if (!selection) return;

      const group = enhancedFeatureGroups.find((g) => g.id === groupId);
      if (!group) return;

      const selectedIds = Array.isArray(selection) ? selection : [selection];

      selectedIds.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (!option) return;

        // Verificar restricciones de arquitectura
        if (option.architectureRestrictions?.includes(architecture)) {
          errors.push(
            `${option.title} is not compatible with ${architecture} architecture`
          );
        }

        if (
          option.architectureRequired &&
          !option.architectureRequired.includes(architecture)
        ) {
          errors.push(
            `${option.title} requires ${option.architectureRequired.join(
              " or "
            )} architecture`
          );
        }

        // Verificar si la feature es avanzada para arquitectura simple
        if (architecture === "default" && option.complexity === "Advanced") {
          warnings.push(
            `${option.title} is an advanced feature. Consider using Clean Architecture or DDD for better organization`
          );
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Mapea proyectos según la arquitectura
   */
  private static getProjectMapping(
    architecture: string,
    baseName: string
  ): { [key: string]: string } {
    switch (architecture) {
      case "clean":
        return {
          domain: `${baseName}.Domain`,
          application: `${baseName}.Application`,
          infrastructure: `${baseName}.Infrastructure`,
          api: `${baseName}.API`,
        };
      case "ddd":
        return {
          domain: `${baseName}.Domain`,
          application: `${baseName}.Application`,
          infrastructure: `${baseName}.Infrastructure`,
          api: `${baseName}.API`,
          shared: `${baseName}.Shared`,
        };
      case "hexagonal":
        return {
          core: `${baseName}.Core`,
          adapters: `${baseName}.Adapters`,
          infrastructure: `${baseName}.Infrastructure`,
          api: `${baseName}.API`,
        };
      case "onion":
        return {
          core: `${baseName}.Core`,
          services: `${baseName}.Services`,
          infrastructure: `${baseName}.Infrastructure`,
          web: `${baseName}.Web`,
        };
      default:
        return {
          main: baseName,
        };
    }
  }

  /**
   * Determina en qué proyectos instalar los paquetes según la feature
   */
  private static getTargetProjects(
    groupId: string,
    optionId: string,
    projectMapping: { [key: string]: string }
  ): string[] {
    // Lógica para determinar dónde instalar cada tipo de feature
    switch (groupId) {
      case "authentication":
        return [
          projectMapping.api || projectMapping.web || projectMapping.main,
        ];

      case "documentation":
        return [
          projectMapping.api || projectMapping.web || projectMapping.main,
        ];

      case "cqrs":
        return [
          projectMapping.application,
          projectMapping.domain,
          projectMapping.core,
        ].filter(Boolean);

      case "logging":
        return [
          projectMapping.api || projectMapping.web || projectMapping.main,
          projectMapping.infrastructure,
        ].filter(Boolean);

      case "error_handling":
        return [
          projectMapping.domain,
          projectMapping.application,
          projectMapping.core,
        ].filter(Boolean);

      case "containerization":
        // Docker files van al root, pero no necesitan paquetes NuGet
        return [];

      case "events":
        return [
          projectMapping.domain,
          projectMapping.application,
          projectMapping.infrastructure,
          projectMapping.core,
        ].filter(Boolean);

      default:
        // Por defecto, instalar en el proyecto principal
        return [projectMapping.main || Object.values(projectMapping)[0]];
    }
  }

  /**
   * Obtiene la versión recomendada para un paquete
   */
  private static getRecommendedVersion(packageId: string): string {
    // Versiones recomendadas por paquete
    const versionMap: { [key: string]: string } = {
      "Microsoft.AspNetCore.Authentication.JwtBearer": "8.0.11",
      "System.IdentityModel.Tokens.Jwt": "8.1.2",
      "Swashbuckle.AspNetCore": "6.5.0",
      MediatR: "12.2.0",
      "MediatR.Extensions.Microsoft.DependencyInjection": "11.1.0",
      "Serilog.AspNetCore": "8.0.0",
      "Serilog.Sinks.Console": "5.0.1",
      "Serilog.Sinks.File": "5.0.0",
      FluentResults: "3.15.2",
      ErrorOr: "1.2.1",
      MassTransit: "8.1.3",
      "MassTransit.RabbitMQ": "8.1.3",
      AutoMapper: "12.0.1",
      FluentValidation: "11.9.0",
      Polly: "8.2.0",
    };

    return versionMap[packageId] || "latest";
  }

  /**
   * Verifica si un paquete está verificado por Microsoft
   */
  private static isVerifiedPackage(packageId: string): boolean {
    const verifiedPackages = [
      "Microsoft.AspNetCore.Authentication.JwtBearer",
      "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
      "Microsoft.AspNetCore.Identity.UI",
      "Microsoft.EntityFrameworkCore",
      "Microsoft.EntityFrameworkCore.SqlServer",
      "Microsoft.EntityFrameworkCore.Tools",
      "Microsoft.Extensions.Hosting",
      "Microsoft.Extensions.DependencyInjection",
      "Microsoft.Extensions.Configuration",
      "Microsoft.AspNetCore.OpenApi",
      "System.IdentityModel.Tokens.Jwt",
      "Microsoft.IdentityModel.Tokens",
    ];

    return (
      verifiedPackages.includes(packageId) || packageId.startsWith("Microsoft.")
    );
  }

  /**
   * Genera un resumen de las features seleccionadas para mostrar al usuario
   */
  static generateFeaturesSummary(selectedFeatures: SelectedFeatures): {
    totalFeatures: number;
    complexityLevel: "Beginner" | "Intermediate" | "Advanced";
    estimatedTime: number;
    categories: string[];
    recommendations: string[];
  } {
    let totalComplexity = 0;
    let featureCount = 0;
    const categories = new Set<string>();
    const recommendations: string[] = [];

    Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
      if (!selection) return;

      const group = enhancedFeatureGroups.find((g) => g.id === groupId);
      if (!group) return;

      const selectedIds = Array.isArray(selection) ? selection : [selection];
      featureCount += selectedIds.length;

      selectedIds.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (!option) return;

        categories.add(option.category);

        // Calcular complejidad
        switch (option.complexity) {
          case "Advanced":
            totalComplexity += 3;
            break;
          case "Intermediate":
            totalComplexity += 2;
            break;
          case "Beginner":
            totalComplexity += 1;
            break;
        }

        // Agregar recomendaciones específicas
        if (
          option.id === "jwt" &&
          !Object.values(selectedFeatures).flat().includes("swagger_extended")
        ) {
          recommendations.push(
            "Consider using Extended Swagger to test JWT authentication easily"
          );
        }

        if (
          option.id === "mediatr" &&
          !Object.values(selectedFeatures).flat().includes("serilog")
        ) {
          recommendations.push(
            "Serilog pairs well with MediatR for better request/response logging"
          );
        }
      });
    });

    const avgComplexity = featureCount > 0 ? totalComplexity / featureCount : 1;
    const complexityLevel =
      avgComplexity >= 2.5
        ? "Advanced"
        : avgComplexity >= 1.5
        ? "Intermediate"
        : "Beginner";

    // Estimar tiempo de configuración (en minutos)
    const baseTime = featureCount * 15; // 15 minutos base por feature
    const complexityMultiplier = avgComplexity;
    const estimatedTime = Math.round(baseTime * complexityMultiplier);

    return {
      totalFeatures: featureCount,
      complexityLevel,
      estimatedTime,
      categories: Array.from(categories),
      recommendations,
    };
  }

  /**
   * Genera comandos de instalación para las dependencias
   */
  static generateInstallationCommands(
    selectedFeatures: SelectedFeatures,
    projectName: string,
    architecture: string
  ): { [projectName: string]: string[] } {
    const dependencies = this.convertFeaturesToDependencies(
      selectedFeatures,
      projectName,
      architecture
    );
    const commands: { [projectName: string]: string[] } = {};

    Object.entries(dependencies).forEach(([project, deps]) => {
      commands[project] = deps.map(
        (dep) =>
          `dotnet add ${project} package ${dep.id} --version ${dep.version}`
      );
    });

    return commands;
  }

  /**
   * Genera documentación markdown para las features seleccionadas
   */
  static generateDocumentation(
    selectedFeatures: SelectedFeatures,
    projectName: string,
    architecture: string
  ): string {
    const summary = this.generateFeaturesSummary(selectedFeatures);
    let markdown = `# ${projectName} - Features Configuration\n\n`;

    markdown += `## Summary\n`;
    markdown += `- **Architecture**: ${architecture}\n`;
    markdown += `- **Complexity Level**: ${summary.complexityLevel}\n`;
    markdown += `- **Total Features**: ${summary.totalFeatures}\n`;
    markdown += `- **Estimated Setup Time**: ${summary.estimatedTime} minutes\n`;
    markdown += `- **Categories**: ${summary.categories.join(", ")}\n\n`;

    markdown += `## Selected Features\n\n`;

    Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
      if (!selection) return;

      const group = enhancedFeatureGroups.find((g) => g.id === groupId);
      if (!group) return;

      markdown += `### ${group.title}\n`;
      markdown += `${group.description}\n\n`;

      const selectedIds = Array.isArray(selection) ? selection : [selection];

      selectedIds.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (!option) return;

        markdown += `#### ${option.title}\n`;
        markdown += `**Complexity**: ${option.complexity}\n\n`;
        markdown += `${option.description}\n\n`;

        if (option.pros.length > 0) {
          markdown += `**Advantages**:\n`;
          option.pros.forEach((pro) => (markdown += `- ${pro}\n`));
          markdown += `\n`;
        }

        if (option.nugetPackages && option.nugetPackages.length > 0) {
          markdown += `**NuGet Packages**:\n`;
          option.nugetPackages.forEach((pkg) => (markdown += `- ${pkg}\n`));
          markdown += `\n`;
        }

        if (option.codeExamples && option.codeExamples.length > 0) {
          markdown += `**Code Examples**:\n\n`;
          option.codeExamples.forEach((example) => {
            markdown += `##### ${example.title}\n`;
            if (example.filename) {
              markdown += `*File: ${example.filename}*\n\n`;
            }
            markdown += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`;
          });
        }
      });
    });

    if (summary.recommendations.length > 0) {
      markdown += `## Recommendations\n\n`;
      summary.recommendations.forEach((rec) => (markdown += `- ${rec}\n`));
      markdown += `\n`;
    }

    const commands = this.generateInstallationCommands(
      selectedFeatures,
      projectName,
      architecture
    );
    if (Object.keys(commands).length > 0) {
      markdown += `## Installation Commands\n\n`;
      Object.entries(commands).forEach(([project, projectCommands]) => {
        markdown += `### ${project}\n`;
        markdown += `\`\`\`bash\n`;
        projectCommands.forEach((cmd) => (markdown += `${cmd}\n`));
        markdown += `\`\`\`\n\n`;
      });
    }

    markdown += `---\n`;
    markdown += `*Generated on ${new Date().toLocaleDateString()} by .NET Project Generator*\n`;

    return markdown;
  }

  /**
   * Exporta la configuración completa en formato JSON
   */
  static exportConfiguration(
    selectedFeatures: SelectedFeatures,
    projectName: string,
    architecture: string,
    projectType: string
  ): object {
    const dependencies = this.convertFeaturesToDependencies(
      selectedFeatures,
      projectName,
      architecture
    );
    const configFiles = this.generateConfigurationFiles(selectedFeatures);
    const summary = this.generateFeaturesSummary(selectedFeatures);
    const validation = this.validateFeaturesForArchitecture(
      selectedFeatures,
      architecture
    );

    return {
      metadata: {
        projectName,
        architecture,
        projectType,
        generatedAt: new Date().toISOString(),
        version: "1.0.0",
      },
      features: {
        selected: selectedFeatures,
        summary,
      },
      dependencies: {
        byProject: dependencies,
        total: Object.values(dependencies).flat().length,
      },
      configuration: {
        files: configFiles,
        validation,
      },
      installation: {
        commands: this.generateInstallationCommands(
          selectedFeatures,
          projectName,
          architecture
        ),
        documentation: this.generateDocumentation(
          selectedFeatures,
          projectName,
          architecture
        ),
      },
    };
  }
}
