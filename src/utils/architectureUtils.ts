// src/utils/architectureUtils.ts
import { Architecture, ArchitectureInfo, ProjectType, Database } from '../types/project';

export const getArchitectureInfo = (
  architecture: Architecture, 
  projectName: string,
  projectType: ProjectType = 'webapi',
  database: Database = 'none'
): ArchitectureInfo => {
  
  const getRecommendedPackages = (projectName: string, layer?: string, type?: ProjectType) => {
    const recommendations: string[] = [];
    
    // Recomendaciones por capa
    switch (layer) {
      case 'domain':
        recommendations.push('FluentValidation', 'MediatR');
        break;
      case 'application':
        recommendations.push('MediatR', 'AutoMapper', 'FluentValidation');
        break;
      case 'infrastructure':
        if (database !== 'none') {
          recommendations.push('Microsoft.EntityFrameworkCore');
          switch (database) {
            case 'sqlserver':
              recommendations.push('Microsoft.EntityFrameworkCore.SqlServer');
              break;
            case 'postgresql':
              recommendations.push('Npgsql.EntityFrameworkCore.PostgreSQL');
              break;
            case 'mysql':
              recommendations.push('Pomelo.EntityFrameworkCore.MySql');
              break;
            case 'sqlite':
              recommendations.push('Microsoft.EntityFrameworkCore.Sqlite');
              break;
          }
        }
        recommendations.push('Dapper', 'Polly', 'Serilog');
        break;
      case 'presentation':
        if (type === 'webapi') {
          recommendations.push('Swashbuckle.AspNetCore', 'Microsoft.AspNetCore.Authentication.JwtBearer');
        }
        break;
    }
    
    return recommendations;
  };

  const architectures: Record<Architecture, ArchitectureInfo> = {
    default: {
      description: 'Simple monolithic structure for rapid development',
      projects: [{
        name: projectName,
        description: 'Monolithic application containing all functionality',
        folders: ['Controllers', 'Models', 'Services', 'Data'],
        isCore: true,
        layer: 'presentation'
      }],
      recommendedPackages: {
        [projectName]: getRecommendedPackages(projectName, 'presentation', projectType)
      }
    },
    clean: {
      description: 'Separation of concerns with dependency inversion',
      projects: [
        {
          name: `${projectName}.Domain`,
          description: 'Core business entities and interfaces',
          folders: ['Entities', 'ValueObjects', 'Interfaces', 'Events'],
          dependencies: [],
          isCore: true,
          layer: 'domain'
        },
        {
          name: `${projectName}.Application`,
          description: 'Application business rules and use cases',
          folders: ['Services', 'DTOs', 'Interfaces', 'Commands', 'Queries'],
          dependencies: [`${projectName}.Domain`],
          layer: 'application'
        },
        {
          name: `${projectName}.Infrastructure`,
          description: 'External concerns and implementations',
          folders: ['Data', 'Repositories', 'Services', 'Extensions'],
          dependencies: [`${projectName}.Domain`, `${projectName}.Application`],
          layer: 'infrastructure'
        },
        {
          name: `${projectName}.API`,
          description: 'API endpoints and configuration',
          folders: ['Controllers', 'Middleware', 'Extensions', 'Filters'],
          dependencies: [`${projectName}.Application`, `${projectName}.Infrastructure`],
          layer: 'presentation'
        }
      ],
      recommendedPackages: {
        [`${projectName}.Domain`]: getRecommendedPackages(`${projectName}.Domain`, 'domain'),
        [`${projectName}.Application`]: getRecommendedPackages(`${projectName}.Application`, 'application'),
        [`${projectName}.Infrastructure`]: getRecommendedPackages(`${projectName}.Infrastructure`, 'infrastructure'),
        [`${projectName}.API`]: getRecommendedPackages(`${projectName}.API`, 'presentation', projectType)
      }
    },
    ddd: {
      description: 'Rich domain modeling with bounded contexts',
      projects: [
        {
          name: `${projectName}.Domain`,
          description: 'Core domain models and business rules',
          folders: ['Aggregates', 'Entities', 'ValueObjects', 'DomainServices', 'Events'],
          dependencies: [],
          isCore: true,
          layer: 'domain'
        },
        {
          name: `${projectName}.Application`,
          description: 'Application services and use cases',
          folders: ['Commands', 'Queries', 'EventHandlers', 'Services'],
          dependencies: [`${projectName}.Domain`, `${projectName}.Shared`],
          layer: 'application'
        },
        {
          name: `${projectName}.Infrastructure`,
          description: 'Technical implementations and external services',
          folders: ['Persistence', 'ExternalServices', 'Messaging', 'Repositories'],
          dependencies: [`${projectName}.Domain`, `${projectName}.Application`],
          layer: 'infrastructure'
        },
        {
          name: `${projectName}.API`,
          description: 'API layer and controllers',
          folders: ['Controllers', 'DTOs', 'Filters', 'Middleware'],
          dependencies: [`${projectName}.Application`, `${projectName}.Infrastructure`],
          layer: 'presentation'
        },
        {
          name: `${projectName}.Shared`,
          description: 'Shared kernel and common components',
          folders: ['Common', 'Interfaces', 'Events', 'Constants'],
          dependencies: [],
          layer: 'shared'
        }
      ],
      recommendedPackages: {
        [`${projectName}.Domain`]: [...getRecommendedPackages(`${projectName}.Domain`, 'domain'), 'MediatR'],
        [`${projectName}.Application`]: getRecommendedPackages(`${projectName}.Application`, 'application'),
        [`${projectName}.Infrastructure`]: [...getRecommendedPackages(`${projectName}.Infrastructure`, 'infrastructure'), 'MassTransit'],
        [`${projectName}.API`]: getRecommendedPackages(`${projectName}.API`, 'presentation', projectType),
        [`${projectName}.Shared`]: ['MediatR.Contracts']
      }
    },
    hexagonal: {
      description: 'Ports and adapters pattern for business logic isolation',
      projects: [
        {
          name: `${projectName}.Core`,
          description: 'Core business logic and ports',
          folders: ['Domain', 'Ports', 'UseCases', 'Services'],
          dependencies: [],
          isCore: true,
          layer: 'domain'
        },
        {
          name: `${projectName}.Adapters`,
          description: 'Implementation of ports (adapters)',
          folders: ['Primary', 'Secondary', 'Persistence', 'External'],
          dependencies: [`${projectName}.Core`],
          layer: 'infrastructure'
        },
        {
          name: `${projectName}.Infrastructure`,
          description: 'Technical infrastructure and external services',
          folders: ['Database', 'ExternalAPIs', 'FileSystem', 'Configuration'],
          dependencies: [`${projectName}.Core`, `${projectName}.Adapters`],
          layer: 'infrastructure'
        },
        {
          name: `${projectName}.API`,
          description: 'Web API and DTOs',
          folders: ['Controllers', 'DTOs', 'Mappers', 'Filters'],
          dependencies: [`${projectName}.Core`, `${projectName}.Adapters`],
          layer: 'presentation'
        }
      ],
      recommendedPackages: {
        [`${projectName}.Core`]: getRecommendedPackages(`${projectName}.Core`, 'domain'),
        [`${projectName}.Adapters`]: ['AutoMapper', 'Polly'],
        [`${projectName}.Infrastructure`]: getRecommendedPackages(`${projectName}.Infrastructure`, 'infrastructure'),
        [`${projectName}.API`]: getRecommendedPackages(`${projectName}.API`, 'presentation', projectType)
      }
    },
    onion: {
      description: 'Layered architecture with dependencies pointing inward',
      projects: [
        {
          name: `${projectName}.Core`,
          description: 'Core domain models and interfaces',
          folders: ['Entities', 'Interfaces', 'ValueObjects', 'Specifications'],
          dependencies: [],
          isCore: true,
          layer: 'domain'
        },
        {
          name: `${projectName}.Services`,
          description: 'Business logic and application services',
          folders: ['Services', 'Behaviors', 'DomainServices', 'Validators'],
          dependencies: [`${projectName}.Core`],
          layer: 'application'
        },
        {
          name: `${projectName}.Infrastructure`,
          description: 'Data access and external services',
          folders: ['Data', 'ExternalServices', 'Repositories', 'Identity'],
          dependencies: [`${projectName}.Core`, `${projectName}.Services`],
          layer: 'infrastructure'
        },
        {
          name: `${projectName}.Web`,
          description: 'Web layer and UI logic',
          folders: ['Controllers', 'ViewModels', 'Filters', 'Extensions'],
          dependencies: [`${projectName}.Services`, `${projectName}.Infrastructure`],
          layer: 'presentation'
        }
      ],
      recommendedPackages: {
        [`${projectName}.Core`]: getRecommendedPackages(`${projectName}.Core`, 'domain'),
        [`${projectName}.Services`]: getRecommendedPackages(`${projectName}.Services`, 'application'),
        [`${projectName}.Infrastructure`]: getRecommendedPackages(`${projectName}.Infrastructure`, 'infrastructure'),
        [`${projectName}.Web`]: getRecommendedPackages(`${projectName}.Web`, 'presentation', projectType)
      }
    }
  };

  return architectures[architecture];
};