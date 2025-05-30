// src/utils/architectureUtils.ts
import { Architecture, ArchitectureInfo, ProjectType } from "../types/project";

export const getArchitectureInfo = (
  architecture: Architecture,
  projectName: string,
  projectType: ProjectType = "webapi"
): ArchitectureInfo => {
  const getRecommendedPackages = (
    projectName: string,
    layer?: string,
    type?: ProjectType
  ) => {
    const recommendations: string[] = [];

    // Recomendaciones por capa
    switch (layer) {
      case "domain":
        recommendations.push("FluentValidation", "MediatR");
        break;
      case "application":
        recommendations.push("MediatR", "AutoMapper", "FluentValidation");
        break;
      case "infrastructure":
        recommendations.push(
          "Microsoft.EntityFrameworkCore",
          "Dapper",
          "Polly",
          "Serilog"
        );
        break;
      case "presentation":
        if (type === "webapi") {
          recommendations.push(
            "Swashbuckle.AspNetCore",
            "Microsoft.AspNetCore.Authentication.JwtBearer"
          );
        }
        break;
    }

    return recommendations;
  };

  const architectures: Record<Architecture, ArchitectureInfo> = {
    default: {
      description:
        "Simple monolithic structure for rapid development and prototyping",
      projects: [
        {
          name: projectName,
          description:
            "Monolithic application containing all functionality in a single project",
          folders: [
            "Controllers",
            "Models",
            "Services",
            "Data",
            "DTOs",
            "Middleware",
          ],
          isCore: true,
          layer: "presentation",
        },
      ],
      recommendedPackages: {
        [projectName]: getRecommendedPackages(
          projectName,
          "presentation",
          projectType
        ),
      },
    },
    clean: {
      description:
        "Clear separation of concerns with dependency inversion principle, promoting maintainable and testable code",
      projects: [
        {
          name: `${projectName}.Domain`,
          description:
            "Core business entities, value objects, and domain interfaces",
          folders: [
            "Entities",
            "ValueObjects",
            "Interfaces",
            "Events",
            "Exceptions",
          ],
          dependencies: [],
          isCore: true,
          layer: "domain",
        },
        {
          name: `${projectName}.Application`,
          description:
            "Application business rules, use cases, and application services",
          folders: [
            "Services",
            "DTOs",
            "Interfaces",
            "Commands",
            "Queries",
            "Behaviors",
          ],
          dependencies: [`${projectName}.Domain`],
          layer: "application",
        },
        {
          name: `${projectName}.Infrastructure`,
          description: "External concerns implementation and data access layer",
          folders: [
            "Data",
            "Repositories",
            "Services",
            "Extensions",
            "Configurations",
          ],
          dependencies: [`${projectName}.Domain`, `${projectName}.Application`],
          layer: "infrastructure",
        },
        {
          name: `${projectName}.API`,
          description:
            "Web API endpoints, controllers, and presentation layer configuration",
          folders: [
            "Controllers",
            "Middleware",
            "Extensions",
            "Filters",
            "DTOs",
          ],
          dependencies: [
            `${projectName}.Application`,
            `${projectName}.Infrastructure`,
          ],
          layer: "presentation",
        },
      ],
      recommendedPackages: {
        [`${projectName}.Domain`]: getRecommendedPackages(
          `${projectName}.Domain`,
          "domain"
        ),
        [`${projectName}.Application`]: getRecommendedPackages(
          `${projectName}.Application`,
          "application"
        ),
        [`${projectName}.Infrastructure`]: getRecommendedPackages(
          `${projectName}.Infrastructure`,
          "infrastructure"
        ),
        [`${projectName}.API`]: getRecommendedPackages(
          `${projectName}.API`,
          "presentation",
          projectType
        ),
      },
    },
    ddd: {
      description:
        "Rich domain modeling with bounded contexts, aggregates, and domain-driven design principles",
      projects: [
        {
          name: `${projectName}.Domain`,
          description:
            "Core domain models, aggregates, and rich business rules",
          folders: [
            "Aggregates",
            "Entities",
            "ValueObjects",
            "DomainServices",
            "Events",
            "Specifications",
          ],
          dependencies: [],
          isCore: true,
          layer: "domain",
        },
        {
          name: `${projectName}.Application`,
          description:
            "Application services, command/query handlers, and use cases",
          folders: [
            "Commands",
            "Queries",
            "EventHandlers",
            "Services",
            "DTOs",
            "Behaviors",
          ],
          dependencies: [`${projectName}.Domain`, `${projectName}.Shared`],
          layer: "application",
        },
        {
          name: `${projectName}.Infrastructure`,
          description:
            "Technical implementations, repositories, and external service integrations",
          folders: [
            "Persistence",
            "ExternalServices",
            "Messaging",
            "Repositories",
            "Configurations",
          ],
          dependencies: [`${projectName}.Domain`, `${projectName}.Application`],
          layer: "infrastructure",
        },
        {
          name: `${projectName}.API`,
          description: "RESTful API endpoints and presentation layer",
          folders: [
            "Controllers",
            "DTOs",
            "Filters",
            "Middleware",
            "Extensions",
          ],
          dependencies: [
            `${projectName}.Application`,
            `${projectName}.Infrastructure`,
          ],
          layer: "presentation",
        },
        {
          name: `${projectName}.Shared`,
          description:
            "Shared kernel with common components and cross-cutting concerns",
          folders: [
            "Common",
            "Interfaces",
            "Events",
            "Constants",
            "Extensions",
          ],
          dependencies: [],
          layer: "shared",
        },
      ],
      recommendedPackages: {
        [`${projectName}.Domain`]: [
          ...getRecommendedPackages(`${projectName}.Domain`, "domain"),
          "MediatR",
        ],
        [`${projectName}.Application`]: getRecommendedPackages(
          `${projectName}.Application`,
          "application"
        ),
        [`${projectName}.Infrastructure`]: [
          ...getRecommendedPackages(
            `${projectName}.Infrastructure`,
            "infrastructure"
          ),
          "MassTransit",
        ],
        [`${projectName}.API`]: getRecommendedPackages(
          `${projectName}.API`,
          "presentation",
          projectType
        ),
        [`${projectName}.Shared`]: ["MediatR.Contracts"],
      },
    },
    hexagonal: {
      description:
        "Ports and adapters pattern isolating business logic from external concerns",
      projects: [
        {
          name: `${projectName}.Core`,
          description:
            "Core business logic, domain models, and port definitions",
          folders: ["Domain", "Ports", "UseCases", "Services", "Models"],
          dependencies: [],
          isCore: true,
          layer: "domain",
        },
        {
          name: `${projectName}.Adapters`,
          description: "Implementation of ports through various adapters",
          folders: [
            "Primary",
            "Secondary",
            "Persistence",
            "External",
            "Messaging",
          ],
          dependencies: [`${projectName}.Core`],
          layer: "infrastructure",
        },
        {
          name: `${projectName}.Infrastructure`,
          description:
            "Technical infrastructure, configuration, and external service integrations",
          folders: [
            "Database",
            "ExternalAPIs",
            "FileSystem",
            "Configuration",
            "Logging",
          ],
          dependencies: [`${projectName}.Core`, `${projectName}.Adapters`],
          layer: "infrastructure",
        },
        {
          name: `${projectName}.API`,
          description: "Web API controllers, DTOs, and HTTP-specific concerns",
          folders: ["Controllers", "DTOs", "Mappers", "Filters", "Middleware"],
          dependencies: [`${projectName}.Core`, `${projectName}.Adapters`],
          layer: "presentation",
        },
      ],
      recommendedPackages: {
        [`${projectName}.Core`]: getRecommendedPackages(
          `${projectName}.Core`,
          "domain"
        ),
        [`${projectName}.Adapters`]: ["AutoMapper", "Polly"],
        [`${projectName}.Infrastructure`]: getRecommendedPackages(
          `${projectName}.Infrastructure`,
          "infrastructure"
        ),
        [`${projectName}.API`]: getRecommendedPackages(
          `${projectName}.API`,
          "presentation",
          projectType
        ),
      },
    },
    onion: {
      description:
        "Layered architecture with dependencies flowing inward toward the core",
      projects: [
        {
          name: `${projectName}.Core`,
          description:
            "Core domain models, entities, and business rule interfaces",
          folders: [
            "Entities",
            "Interfaces",
            "ValueObjects",
            "Specifications",
            "Enums",
          ],
          dependencies: [],
          isCore: true,
          layer: "domain",
        },
        {
          name: `${projectName}.Services`,
          description: "Business logic implementation and application services",
          folders: [
            "Services",
            "Behaviors",
            "DomainServices",
            "Validators",
            "Handlers",
          ],
          dependencies: [`${projectName}.Core`],
          layer: "application",
        },
        {
          name: `${projectName}.Infrastructure`,
          description:
            "Data access, external services, and technical implementations",
          folders: [
            "Data",
            "ExternalServices",
            "Repositories",
            "Identity",
            "Configurations",
          ],
          dependencies: [`${projectName}.Core`, `${projectName}.Services`],
          layer: "infrastructure",
        },
        {
          name: `${projectName}.Web`,
          description:
            "Web layer with controllers, views, and UI-specific logic",
          folders: [
            "Controllers",
            "ViewModels",
            "Filters",
            "Extensions",
            "Middleware",
          ],
          dependencies: [
            `${projectName}.Services`,
            `${projectName}.Infrastructure`,
          ],
          layer: "presentation",
        },
      ],
      recommendedPackages: {
        [`${projectName}.Core`]: getRecommendedPackages(
          `${projectName}.Core`,
          "domain"
        ),
        [`${projectName}.Services`]: getRecommendedPackages(
          `${projectName}.Services`,
          "application"
        ),
        [`${projectName}.Infrastructure`]: getRecommendedPackages(
          `${projectName}.Infrastructure`,
          "infrastructure"
        ),
        [`${projectName}.Web`]: getRecommendedPackages(
          `${projectName}.Web`,
          "presentation",
          projectType
        ),
      },
    },
  };

  return architectures[architecture];
};
